const fs = require('node:fs');
fs.mkdirSync('dist', {recursive:true});
for (const file of ['index.html','style.css','workbench.js']) fs.copyFileSync(file,'dist/'+file);
