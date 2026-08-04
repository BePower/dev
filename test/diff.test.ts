import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { paths } from '../cli/utils/paths.js';

let tempDir: string;
let originalCwd: string;

beforeEach(async () => {
  originalCwd = process.cwd();
  const fs = await import('node:fs/promises');
  tempDir = await fs.mkdtemp(join(tmpdir(), 'dev-test-diff-'));
  process.chdir(tempDir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  vi.restoreAllMocks();
  await import('node:fs/promises').then((fs) => fs.rm(tempDir, { recursive: true, force: true }));
});

describe('diff command', () => {
  it('should exit with error if no package.json exists', async () => {
    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { diff } = await import('../cli/commands/diff.js');
    await expect(diff.parseAsync([], { from: 'user' })).rejects.toThrow('process.exit');

    expect(console.error).toHaveBeenCalledWith(
      'package.json not found. Run this in a project directory.',
    );
  });

  it('should report missing configs', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { diff } = await import('../cli/commands/diff.js');
    await diff.parseAsync([], { from: 'user' });

    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('+ biome.json'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('missing locally'));
  });

  it('should report drifted configs', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));
    await writeFile(join(tempDir, 'biome.json'), '{"custom": true}');
    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { diff } = await import('../cli/commands/diff.js');
    await diff.parseAsync([], { from: 'user' });

    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('≠ biome.json'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('differs from golden'));
  });

  it('should report all matching when configs are identical', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

    // Copy all golden configs to the temp dir
    const { getConfigFiles } = await import('../cli/utils/configs.js');
    const configFiles = getConfigFiles();
    for (const file of configFiles) {
      const dest = join(tempDir, file.dest);
      await mkdir(dirname(dest), { recursive: true });
      await copyFile(join(paths.configs, file.src), dest);
    }

    const mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { diff } = await import('../cli/commands/diff.js');
    await diff.parseAsync([], { from: 'user' });

    expect(mockLog).toHaveBeenCalledWith('✓ All configs match golden versions.');
  });
});
