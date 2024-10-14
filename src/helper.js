import { Readable, Transform } from 'node:stream';
import fs from 'node:fs';
import path from 'node:path';
import convertToTable from './format.js';

export const log = (data) => {
  const message =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  Readable.from([message, '\n']).pipe(process.stdout);
};

export const getArgs = () => process.argv.slice(2);

export const getUsernameFromArgs = (args) => {
  const keyword = 'username';
  return args
    .find((arg) => arg.startsWith(`--${keyword}=`))
    .slice(keyword.length + 3);
};

export const getWelcomeMessage = (username) =>
  `Welcome to the File Manager, ${username}!`;

export const generateCWDMessage = () => `You are currently in ${process.cwd()}`;

export const operate = new Transform({
  transform(chunk, _, callback) {
    const command = chunk.toString().trim().split(' ');
    const operator = command[0];
    const args = command.slice(1);
    let message = '';

    switch (operator) {
      case 'up': {
        up();
        break;
      }
      case 'cd': {
        cd(args.join(' '));
        break;
      }
      case 'ls': {
        message = ls();
        break;
      }
      case 'cat': {
        cat(args[0]);
        break;
      }
      case 'add': {
        add(args[0]);
        break;
      }
      case "rn": {
        rn(args[0], args[1]);
        break;
      }
      case "cp": {
        cp(args[0], args[1]);
        break;
      }
      case "mv": {
        mv(args[0], args[1]);
        break;
      }
      case "rm": {
        rm(args[0]);
        break;
      }
    }

    callback(null, `${message}\n${generateCWDMessage()}\n`);
  },
});

const up = () => cd('..');

const cd = (path) => {
  process.chdir(path);
};

const ls = () => {
  const files = getDirFiles(process.cwd());
  files.sort((f1, f2) =>
    f1.type < f2.type ? -1 : f1.type > f2.type ? 1 : f1.name < f2.name ? -1 : 1
  );
  return convertToTable(files);
};

const cat = (path) => {
  const readStream = fs.createReadStream(path);
  readStream.pipe(process.stdout);
};

const add = (filename) => {
  fs.writeFileSync(path.join(process.cwd(), filename), '');
};

const rn = (oldPath, filename) => {
  const newPath = path.join(path.dirname(path.join(oldPath)), filename);
  fs.renameSync(oldPath, newPath);
};

const cp = (srcPath, destDir) => {
  const destPath = path.join(destDir, path.basename(srcPath));
  const readStream = fs.createReadStream(srcPath);
  const writeStream = fs.createWriteStream(destPath);
  return readStream.pipe(writeStream);
};

const mv = (srcPath, destDir) => {
  cp(srcPath, destDir).on("finish", () => rm(srcPath));
};

const rm = (path) => {
  fs.rmSync(path, { recursive: true, force: true });
};

const getDirFiles = (path) => {
  return fs.readdirSync(path, { withFileTypes: true }).map((file) => ({
    name: file.name,
    type: file.isDirectory() ? 'directory' : 'file',
  }));
};
