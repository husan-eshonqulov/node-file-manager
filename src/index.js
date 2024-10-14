import {
  log,
  getArgs,
  getUsernameFromArgs,
  getWelcomeMessage,
  generateCWDMessage,
  operate
} from './helper.js';


const input = process.stdin;
const output = process.stdout;

const args = getArgs();
const username = getUsernameFromArgs(args);

log(getWelcomeMessage(username));
log(generateCWDMessage());

input.pipe(operate).pipe(output);
