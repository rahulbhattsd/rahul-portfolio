const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const webGLCheck = `
function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
`;

const fallbackRender = `
export default function App() {
  if (!hasWebGLSupport()) {
    return (
      <main className="fallback-page">
        <style>{appStyles}</style>
        <div className="fallback-card">
          <p>System Error</p>
          <h1>WebGL Not Supported</h1>
          <div style={{ color: 'rgba(237, 247, 255, 0.66)', fontSize: '0.95rem', lineHeight: '1.68' }}>
            Your device or browser does not support WebGL, which is required for this 3D experience.
          </div>
          <pre>ERR_WEBGL_UNSUPPORTED</pre>
        </div>
      </main>
    );
  }

  return (
    <main className="black-hole-app">
      <style>{appStyles}</style>
      <SpaceScene />
      <PortfolioIdentity />
      <ProjectRail />
    </main>
  )
}
`;

code = code.replace(/export default function App\(\) \{[\s\S]*\}\s*$/, webGLCheck + fallbackRender);
fs.writeFileSync('src/App.jsx', code);
