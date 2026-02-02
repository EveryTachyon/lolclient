// index.js
console.log("LOL client starting from scratch...");

// Example: simple command-line input
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("Enter a command: ", (cmd) => {
    console.log(`You typed: ${cmd}`);
    readline.close();
});
