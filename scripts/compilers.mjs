import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

export const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
export const defaultProjects = ['frontend/tsconfig.json', 'backend/tsconfig.json'];
export const compilerIds = ['tsc', 'tsgo', 'tsrs'];

const packages = {
  tsc: { name: 'typescript-js', bin: 'tsc', implementation: 'JavaScript' },
  tsgo: { name: 'typescript-go', bin: 'tsc', implementation: 'Go' },
  tsrs: { name: 'tsrs', bin: 'tsrs', implementation: 'Rust' },
};

export function getCompiler(id) {
  if (!Object.hasOwn(packages, id)) {
    throw new Error(`Unknown compiler: ${id}. Choose ${compilerIds.join(', ')}.`);
  }

  const entry = packages[id];
  const manifest = require.resolve(`${entry.name}/package.json`);
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));

  return {
    id,
    implementation: entry.implementation,
    package: entry.name,
    version: pkg.version,
    launcher: resolve(dirname(manifest), pkg.bin[entry.bin]),
  };
}

function execute(compiler, args, env = process.env) {
  const start = performance.now();
  const result = spawnSync(process.execPath, [compiler.launcher, ...args], {
    cwd: workspaceRoot,
    env,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  const durationMs = performance.now() - start;

  if (result.error || result.signal || result.status !== 0) {
    throw Object.assign(
      new Error(
        [
          `${compiler.id} failed: ${args.join(' ')}`,
          result.error?.message,
          result.signal && `Signal: ${result.signal}`,
          result.stdout?.trim(),
          result.stderr?.trim(),
        ]
          .filter(Boolean)
          .join('\n'),
      ),
      { exitCode: result.status || 1 },
    );
  }

  return { durationMs, output: `${result.stdout}${result.stderr}`.trim() };
}

export function compilerVersion(compiler) {
  return execute(compiler, ['--version']).output;
}

export function runTypecheck(compiler, project, { fast = false, benchmark = false } = {}) {
  if (fast && compiler.id !== 'tsrs') {
    throw new Error('--fast is only supported for tsrs.');
  }

  const env = { ...process.env };
  if (benchmark) {
    // Compare the shipped defaults without inherited compiler tuning.
    for (const key of Object.keys(env)) {
      if (
        key.startsWith('TSRS_') ||
        ['GOMAXPROCS', 'GOMEMLIMIT', 'RAYON_NUM_THREADS'].includes(key)
      ) {
        delete env[key];
      }
    }
  }

  const args = ['--project', resolve(workspaceRoot, project), '--noEmit', '--pretty', 'false'];
  if (benchmark) args.push('--incremental', 'false');
  if (compiler.id === 'tsrs') args.push('--fast', String(fast));

  return execute(compiler, args, env);
}
