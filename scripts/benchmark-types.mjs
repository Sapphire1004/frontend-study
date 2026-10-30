import { mkdirSync, writeFileSync } from 'node:fs';
import { arch, cpus, platform, release } from 'node:os';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';

import {
  compilerIds,
  compilerVersion,
  defaultProjects,
  getCompiler,
  runTypecheck,
  workspaceRoot,
} from './compilers.mjs';

function integer(value, name, minimum) {
  const number = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(number) || number < minimum) {
    throw new Error(`${name} must be an integer >= ${minimum}.`);
  }
  return number;
}

function statistics(samples) {
  const sorted = samples.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return {
    medianMs: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    meanMs: samples.reduce((sum, value) => sum + value, 0) / samples.length,
    minMs: sorted[0],
    maxMs: sorted.at(-1),
  };
}

let report;
let output;

try {
  const { values } = parseArgs({
    options: {
      runs: { type: 'string', default: '7' },
      warmup: { type: 'string', default: '2' },
      project: { type: 'string', multiple: true },
      output: { type: 'string', default: '.bench/typecheck-results.json' },
      'rust-fast': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    console.log(`Usage: pnpm bench:types [options]
  --runs N           Measured runs per compiler (default: 7)
  --warmup N         Excluded warm-up runs per compiler (default: 2)
  --project PATH     Compare a specific tsconfig; repeat for multiple projects
  --rust-fast        Enable the optional fast preset for tsrs only
  --output PATH      JSON report (default: .bench/typecheck-results.json)

Measures fresh CLI processes with --noEmit --incremental false.
Default workload: frontend/tsconfig.json + backend/tsconfig.json.
This is a warm-filesystem-cache benchmark, not a cold-disk benchmark.`);
  } else {
    const runs = integer(values.runs, '--runs', 1);
    const warmup = integer(values.warmup, '--warmup', 0);
    const projects = values.project ?? defaultProjects;
    const rustFast = values['rust-fast'];
    const compilers = compilerIds.map(getCompiler);
    output = resolve(workspaceRoot, values.output);
    if (!output.endsWith('.json')) throw new Error('--output must end in .json');
    mkdirSync(dirname(output), { recursive: true });

    report = {
      status: 'running',
      generatedAt: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: platform(),
        release: release(),
        arch: arch(),
        cpu: cpus()[0]?.model,
        logicalCpus: cpus().length,
      },
      method: {
        runs,
        warmup,
        projects,
        commonFlags: ['--noEmit', '--incremental', 'false', '--pretty', 'false'],
        rustFast,
        cache: 'Fresh compiler processes; warmed filesystem cache; no incremental cache',
        order: 'Rotate compiler order each round; never run compilers in parallel',
        timing: 'Sum of frontend/backend CLI wall times, including process startup; excludes pnpm',
        note: 'JS uses TypeScript 6; Go/Rust use TypeScript 7.1 beta. Versions and bundled libraries differ.',
      },
      compilers: compilers.map((compiler) => ({
        id: compiler.id,
        implementation: compiler.implementation,
        package: compiler.package,
        version: compiler.version,
        versionOutput: compilerVersion(compiler),
        samples: [],
      })),
    };

    console.log(`Projects: ${projects.join(' + ')}`);
    console.log(`Warm-up: ${warmup}; measured runs: ${runs}; tsrs --fast: ${rustFast}`);
    console.log('Fresh CLI processes, warm filesystem cache, incremental cache disabled.\n');

    for (let round = 0; round < warmup + runs; round++) {
      const offset = round % compilers.length;
      const order = [...compilers.slice(offset), ...compilers.slice(0, offset)];
      const measured = round >= warmup;
      console.log(`${measured ? 'Run' : 'Warm-up'} ${measured ? round - warmup + 1 : round + 1}`);

      for (const compiler of order) {
        const projectSamples = projects.map((project) => ({
          project,
          durationMs: runTypecheck(compiler, project, {
            benchmark: true,
            fast: compiler.id === 'tsrs' && rustFast,
          }).durationMs,
          exitCode: 0,
        }));
        const durationMs = projectSamples.reduce((sum, sample) => sum + sample.durationMs, 0);
        console.log(`  ${compiler.id.padEnd(4)} ${durationMs.toFixed(1)} ms`);

        if (measured) {
          report.compilers
            .find((entry) => entry.id === compiler.id)
            .samples.push({
              round: round - warmup + 1,
              durationMs,
              projects: projectSamples,
            });
        }
      }
    }

    for (const compiler of report.compilers) {
      compiler.statistics = statistics(compiler.samples.map((sample) => sample.durationMs));
    }
    const baseline = report.compilers.find((compiler) => compiler.id === 'tsc').statistics.medianMs;
    for (const compiler of report.compilers) {
      compiler.statistics.speedupVsTsc = baseline / compiler.statistics.medianMs;
    }

    report.status = 'passed';
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
    console.log();
    console.table(
      report.compilers.map((compiler) => ({
        Compiler: `${compiler.id} (${compiler.implementation})`,
        Version: compiler.version,
        'Median ms': compiler.statistics.medianMs.toFixed(1),
        'Mean ms': compiler.statistics.meanMs.toFixed(1),
        'Min ms': compiler.statistics.minMs.toFixed(1),
        'Max ms': compiler.statistics.maxMs.toFixed(1),
        'vs tsc': `${compiler.statistics.speedupVsTsc.toFixed(2)}x`,
      })),
    );
    console.log(`Report: ${output}`);
    console.log(
      'Small projects mostly measure startup and dependency parsing; results are workload-specific.',
    );
  }
} catch (error) {
  if (report && output) {
    report.status = 'failed';
    report.error = error.message;
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.error(error.message);
  console.error('Benchmark aborted. Failed type checks are not included in speed comparisons.');
  process.exitCode = error.exitCode ?? 1;
}
