// src/main.js
import foo from './foo';
import core from '@actions/core'

function main() {
  console.log(foo);
  console.log(core.getInput('who-to-greet'));
}

main()

