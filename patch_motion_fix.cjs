const fs = require('fs');

// The replacement replaced <style> twice because it's a global regex? Let's check how many times it was added.
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /@media \(prefers-reduced-motion: reduce\) \{\s*\*\s*\{\s*animation-duration: 0\.01ms !important;\s*animation-iteration-count: 1 !important;\s*transition-duration: 0\.01ms !important;\s*scroll-behavior: auto !important;\s*\}\s*\}/g;

const matches = appJsx.match(regex);
if (matches && matches.length > 1) {
  // Remove all occurrences
  appJsx = appJsx.replace(regex, '');
  // Add it back just once before </style>
  appJsx = appJsx.replace(/<\/style>/g, `\n@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}\n</style>`);
  fs.writeFileSync('src/App.jsx', appJsx);
}
