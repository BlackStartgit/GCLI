import { promises as fs } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export const fileCommands = {
  ls: async (currentDir) => {
    try {
      const files = await fs.readdir(currentDir);
      const stats = await Promise.all(
        files.map(async (file) => {
          const stat = await fs.stat(join(currentDir, file));
          return {
            name: file,
            isDirectory: stat.isDirectory(),
            size: stat.size,
          };
        })
      );
      
      stats.forEach(({ name, isDirectory, size }) => {
        const prefix = isDirectory ? chalk.blue('d ') : '- ';
        console.log(`${prefix}${name.padEnd(30)} ${size} bytes`);
      });
    } catch (err) {
      console.error(chalk.red('Error listing directory:', err.message));
    }
  },

  cat: async (currentDir, filename) => {
    if (!filename) {
      console.error(chalk.red('Please provide a file name'));
      return;
    }
    try {
      const content = await fs.readFile(join(currentDir, filename), 'utf8');
      console.log(content);
    } catch (err) {
      console.error(chalk.red('Error reading file:', err.message));
    }
  },

  rm: async (currentDir, target) => {
    if (!target) {
      console.error(chalk.red('Please provide a file/directory name'));
      return;
    }
    try {
      const path = join(currentDir, target);
      const stats = await fs.stat(path);
      if (stats.isDirectory()) {
        await fs.rmdir(path, { recursive: true });
        console.log(chalk.green(`Directory ${target} removed`));
      } else {
        await fs.unlink(path);
        console.log(chalk.green(`File ${target} removed`));
      }
    } catch (err) {
      console.error(chalk.red('Error removing file/directory:', err.message));
    }
  },

  cp: async (currentDir, source, dest) => {
    if (!source || !dest) {
      console.error(chalk.red('Please provide source and destination'));
      return;
    }
    try {
      const sourcePath = join(currentDir, source);
      const destPath = join(currentDir, dest);
      await fs.copyFile(sourcePath, destPath);
      console.log(chalk.green(`Copied ${source} to ${dest}`));
    } catch (err) {
      console.error(chalk.red('Error copying file:', err.message));
    }
  }
};