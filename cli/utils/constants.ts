import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { paths } from './paths.js';

const pkg = JSON.parse(readFileSync(join(paths.root, 'package.json'), 'utf-8'));

function dep(name: string): string {
  return pkg.devDependencies[name] ?? pkg.dependencies?.[name] ?? '';
}

export const DEV_DEPENDENCIES: Record<string, string> = {
  '@biomejs/biome': dep('@biomejs/biome'),
  '@commitlint/cli': dep('@commitlint/cli'),
  '@commitlint/config-conventional': dep('@commitlint/config-conventional'),
  '@tsconfig/node22': dep('@tsconfig/node22'),
  '@types/node': dep('@types/node'),
  '@vitest/coverage-v8': dep('@vitest/coverage-v8'),
  bonvoy: dep('bonvoy'),
  concurrently: dep('concurrently'),
  lefthook: dep('lefthook'),
  'lockfile-lint': dep('lockfile-lint'),
  'ls-engines': dep('ls-engines'),
  'npm-package-json-lint': dep('npm-package-json-lint'),
  rimraf: dep('rimraf'),
  'sort-package-json': dep('sort-package-json'),
  tsdown: dep('tsdown'),
  typescript: dep('typescript'),
  vitest: dep('vitest'),
};

export const SCRIPTS: Record<string, string> = {
  build: 'tsdown',
  clean: 'rimraf dist',
  lint: 'concurrently npm:lint:* --prefixColors auto',
  'lint:engines': 'ls-engines',
  'lint:format': 'biome check --write',
  'lint:lockfile': 'lockfile-lint',
  'lint:package': 'npmPkgJsonLint .',
  'lint:sort_package': 'sort-package-json "package.json"',
  'lint:typecheck': 'tsc --noEmit',
  prepare: '[ -n "$CI" ] || [ -n "$CODEBUILD_BUILD_ID" ] || lefthook install',
  test: 'vitest run',
  'test:coverage': 'vitest run --coverage',
};
