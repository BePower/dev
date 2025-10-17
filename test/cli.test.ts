import * as fs from 'node:fs';
import process from 'node:process';

import { vol } from 'memfs';
import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from 'vitest';

const rootPath = vi.hoisted(() => '/fake/root/path');
const packagePath = `${rootPath}/package.json`;

vi.mock('node:fs', async () => {
  const { fs } = await import('memfs');

  return {
    default: fs,
    ...fs,
  };
});

vi.mock(import('node:path'), async (importOriginal) => {
  const path = await importOriginal();

  return {
    ...path,
    join: vi.fn((...args: string[]) => {
      const realRootPath1 = path.dirname(import.meta.dirname);
      if (args[0].startsWith(realRootPath1)) {
        args[0] = args[0].replace(realRootPath1, rootPath);
      }

      return path.join(...args);
    }),
  };
});

vi.spyOn(process, 'cwd').mockReturnValue(rootPath);

describe('cli', () => {
  let stdoutSpy: MockInstance<typeof process.stdout.write>;
  let stderrSpy: MockInstance<typeof process.stderr.write>;

  let readFileSyncSpy: MockInstance<typeof fs.readFileSync>;
  let writeFileSyncSpy: MockInstance<typeof fs.writeFileSync>;

  let processExitSpy: MockInstance<typeof process.exit>;

  const name = '@bepower/dev';
  const version = '1.2.3';
  const description = 'A small description';

  beforeEach(() => {
    vol.fromJSON({
      [packagePath]: JSON.stringify({ name, version, description }),
    });

    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync');

    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`);
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('help', () => {
    const helpMessage = `Usage: @bepower/dev [options] [command]

A small description

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init [options]  Initializes the configuration of most common modules
  help [command]  display help for command
`;

    test('calling without commands', async () => {
      process.argv = ['node', 'cli.js'];
      await expect(import('../cli/index.js')).rejects.toThrow('process.exit: 1');

      expect(stdoutSpy).not.toHaveBeenCalled();
      expect(stderrSpy).toHaveBeenCalledWith(helpMessage);
    });
  });
});
