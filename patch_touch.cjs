const fs = require('fs');

let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace(
  /\.space-scene-canvas \{\n  position: fixed !important;/g,
  '.space-scene-canvas {\n  position: fixed !important;\n  touch-action: none;'
);
fs.writeFileSync('src/App.jsx', appJsx);
