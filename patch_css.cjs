const fs = require('fs');

// src/App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace(
  /mask-image: linear-gradient\(90deg, black 0 72%, transparent\);/g,
  '-webkit-mask-image: linear-gradient(90deg, black 0 72%, transparent);\n  mask-image: linear-gradient(90deg, black 0 72%, transparent);'
);
fs.writeFileSync('src/App.jsx', appJsx);

// src/styles/globals.css
let globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
globalsCss = globalsCss.replace(
  /mask-image: linear-gradient\(90deg, transparent, black 18%, black 82%, transparent\);/g,
  '-webkit-mask-image: linear-gradient(90deg, transparent, black 18%, black 82%, transparent);\n  mask-image: linear-gradient(90deg, transparent, black 18%, black 82%, transparent);'
);
fs.writeFileSync('src/styles/globals.css', globalsCss);
