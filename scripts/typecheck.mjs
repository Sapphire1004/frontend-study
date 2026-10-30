import { defaultProjects, getCompiler, runTypecheck } from './compilers.mjs';

try {
  const [id = 'tsrs', ...flags] = process.argv.slice(2);
  if (flags.some((flag) => flag !== '--fast')) throw new Error('Supported option: --fast');

  const compiler = getCompiler(id);
  const fast = flags.includes('--fast');
  console.log(
    `${compiler.id} (${compiler.implementation}) ${compiler.version}${fast ? ' --fast' : ''}`,
  );

  for (const project of defaultProjects) {
    runTypecheck(compiler, project, { fast });
    console.log(`PASS ${project}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = error.exitCode ?? 1;
}
