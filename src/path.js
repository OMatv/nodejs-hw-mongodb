import path from 'node:path';

const pathToWorkDir = path.join(process.cwd());

export const pathToFile = (name) => {
  return path.join(pathToWorkDir, 'src', name);
};
