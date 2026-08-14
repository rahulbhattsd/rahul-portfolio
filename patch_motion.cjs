const fs = require('fs');

const reducedMotionMedia = `
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

// src/App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace(/<\/style>/g, reducedMotionMedia + '\n      </style>');
fs.writeFileSync('src/App.jsx', appJsx);

// src/styles/globals.css
let globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
globalsCss += '\n' + reducedMotionMedia;
fs.writeFileSync('src/styles/globals.css', globalsCss);
