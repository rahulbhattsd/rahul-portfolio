const fs = require('fs');

// src/App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace(/height: 100vh !important;/g, 'height: 100dvh !important;');
appJsx = appJsx.replace(/min-height: 100vh;/g, 'min-height: 100dvh;');
appJsx = appJsx.replace(/max-height: calc\(100vh/g, 'max-height: calc(100dvh');
fs.writeFileSync('src/App.jsx', appJsx);

// src/index.css
let indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss = indexCss.replace(/min-height: 100vh;/g, 'min-height: 100dvh;');
fs.writeFileSync('src/index.css', indexCss);

// src/components/SpaceScene.jsx
let spaceScene = fs.readFileSync('src/components/SpaceScene.jsx', 'utf8');
spaceScene = spaceScene.replace(/height: '100vh'/g, "height: '100dvh'");
fs.writeFileSync('src/components/SpaceScene.jsx', spaceScene);
