const fs = require("fs");
const path = require('path');
let jsBytes = fs.readFileSync(path.resolve(__dirname,'dist/zilpocket.js'));
fs.writeFileSync(path.resolve(__dirname,'dist/zilpocket.json'),JSON.stringify({
    zilpocket:jsBytes.toString()
}))
