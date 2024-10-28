import core from '@actions/core';

// src/foo.js
var foo = 'hello world!';

// src/main.js
function main() {
    console.log(foo);
    console.log(core.getInput('who-to-greet'));
}
main();
