import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from '@commander-js/extra-typings';

import { fileExists, getConfigFiles } from '../utils/configs.js';
import { paths } from '../utils/paths.js';

export const diff = new Command()
  .name('diff')
  .description('Show differences between local configs and golden configs')
  .action(async () => {
    const cwd = process.cwd();

    if (!(await fileExists(join(cwd, 'package.json')))) {
      console.error('package.json not found. Run this in a project directory.');
      process.exit(1);
    }

    const pkg = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf-8'));
    const isWorkspace = Array.isArray(pkg.workspaces);
    const configFiles = getConfigFiles({ workspace: isWorkspace });

    let hasDiff = false;

    for (const file of configFiles) {
      const localPath = join(cwd, file.dest);
      const goldenPath = join(paths.configs, file.src);

      if (!(await fileExists(localPath))) {
        console.log(`  + ${file.dest} (missing locally, golden available)`);
        hasDiff = true;
        continue;
      }

      const localContent = await readFile(localPath, 'utf-8');
      const goldenContent = await readFile(goldenPath, 'utf-8');

      if (localContent !== goldenContent) {
        console.log(`  ≠ ${file.dest} (differs from golden)`);
        hasDiff = true;
      }
    }

    if (!hasDiff) {
      console.log('✓ All configs match golden versions.');
    } else {
      console.log('\nTo update drifted configs, run: dev setup --force');
    }
  });
