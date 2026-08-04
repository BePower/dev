import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

function findPackageRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    const pkgPath = join(dir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === '@bepower/dev') return dir;
      } catch {
        // ignore parse errors, keep searching
      }
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('Could not find @bepower/dev package root');
    dir = parent;
  }
}

const packageRoot: string = findPackageRoot(__dirname);

export const paths: {
  root: string;
  configs: string;
  kiro: string;
  workflows: string;
  templates: string;
} = {
  root: packageRoot,
  configs: join(packageRoot, 'configs'),
  kiro: join(packageRoot, 'kiro'),
  workflows: join(packageRoot, 'workflows'),
  templates: join(packageRoot, 'templates'),
};
