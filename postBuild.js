const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'deploy', 'ITLab-Front', 'js');
var jsFile = fs.readdirSync(directoryPath)
    .filter(f => f.match(/app.\S+.js/g));
console.log(jsFile[0]);