const foo = require("./lib/foo");
const bar = require("./lib/bar");

const elem = document.querySelector(".result");
const x = foo() + bar();
elem.textContent = x;
