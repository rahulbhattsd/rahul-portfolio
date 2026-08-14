const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

// There are two <style> tags in App.jsx. One from the fallback page, one from the main page.
// The regex in patch_motion_fix replaced </style> with the media query + </style> globally.
// This is fine, as both style blocks get the reduced motion media query.

console.log('Done');
