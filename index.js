const cypress = require('cypress');
const argv = require('minimist')(process.argv.slice(2));

cypress.run({
  spec: './cypress/integration/benchmarker.js',
  headless: false,
  // quiet: true,
  browser: "chrome",
  env: {
      search: argv.search || null
  }
})
.then((results) => {
    console.log("success");
  // console.log(results)
})
.catch((err) => {
  // console.error(err)
  console.log("error");
});
