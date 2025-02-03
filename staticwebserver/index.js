const express = require('express');
const path = require('path');

const app = express();
let options = {"port": 80};

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith("--")) {
    options[process.argv[i].substring(2)] = process.argv[i+1];
    i+=2;
  }
}

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    app.route("examples/index.js");
});

app.listen(options.port, () => {
    console.log(`Server Established at PORT ${options.port}`);
});


 