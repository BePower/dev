import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { Command, Option } from '@commander-js/extra-typings';

interface Package {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function initEditorConfig(dry: boolean) {
  const editorConfigFilename = '.editorconfig';
  const editorConfigFilepath = join(cwd(), editorConfigFilename);
  const editorConfigContent = readFileSync(
    join(import.meta.dirname, '..', editorConfigFilename),
    'utf8',
  );

  if (dry) {
    console.log(`Writing "${editorConfigFilepath}"`);
  } else {
    writeFileSync(editorConfigFilepath, editorConfigContent, 'utf8');
    console.log(`Wrote "${editorConfigFilepath}"`);
  }
}

function initLint(packageDetails: Package, dry: boolean, githubToken: string) {
  const lintFilename = 'biome.json';
  const lintFilepath = join(cwd(), lintFilename);
  const lintDependency = '@biomejs/biome';
  const lintVersion = packageDetails.devDependencies[lintDependency];
  const lintContent = JSON.stringify(
    {
      $schema: `https://biomejs.dev/schemas/${lintVersion}/schema.json`,
      extends: [`${packageDetails.name}/biome`],
    },
    null,
    2,
  );

  const lintPackage = `${lintDependency}@${lintVersion}`;
  const thisPackage = `${packageDetails.name}@${packageDetails.version}`;

  if (dry) {
    console.log(`Installing packages: ${lintPackage}, ${thisPackage}`);
    console.log(`Writing "${lintFilepath}"`);
  } else {
    execSync(
      `GITHUB_TOKEN="${githubToken}" npm i -D ${lintDependency}@${lintVersion} ${packageDetails.name}@${packageDetails.version}`,
    );
    writeFileSync(lintFilepath, lintContent, 'utf8');
    console.log(`Wrote "${lintFilepath}"`);
  }
}

function initCommand(packageDetails: Package) {
  const editorConfigOption = 'editorconfig';
  const lintOption = 'lint';

  return new Command()
    .name('init')
    .description('Initializes the configuration of most common modules')
    .addOption(
      new Option('-m, --modules <modules...>')
        .choices([editorConfigOption, lintOption])
        .makeOptionMandatory(),
    )
    .addOption(new Option('-t, --github-token <token>').env('GITHUB_TOKEN').makeOptionMandatory())
    .addOption(new Option('-d, --dry').default(false))
    .action(({ dry, modules, githubToken }) => {
      console.log('Initializing modules:', modules);

      if (modules.includes(editorConfigOption)) {
        console.log(`\nInitializing "${editorConfigOption}"...`);
        initEditorConfig(dry);
        console.log('');
      }

      if (modules.includes(lintOption)) {
        console.log(`\nInitializing "${lintOption}"...`);
        initLint(packageDetails, dry, githubToken);
      }
    });
}

export function buildProgram(): Command {
  const packageDetails = JSON.parse(
    readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'),
  ) as Package;

  return new Command()
    .name(packageDetails.name)
    .description(packageDetails.description)
    .version(packageDetails.version)

    .addCommand(initCommand(packageDetails));
}
