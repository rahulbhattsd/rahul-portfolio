# Rahul Portfolio

Cinematic React/Vite portfolio for Rahul Bhatt.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The Vite base path is configured in `vite.config.ts` as `/rahul-portfolio/`, so the production build loads correctly from:

https://rahulbhattsd.github.io/rahul-portfolio/

## GitHub Pages Deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Build and deployment` -> `Source` to `GitHub Actions`.
4. Push to the `main` branch, or run `Deploy to GitHub Pages` manually from the `Actions` tab.

Do not publish the repository root directly with GitHub Pages. The source `index.html` points to `/src/main.jsx` for Vite development; GitHub Pages must serve the generated `dist` folder instead.

If you prefer the older branch deploy flow, run:

```bash
npm run deploy
```

Then set `Settings` -> `Pages` -> `Build and deployment` to `Deploy from a branch`, choose the `gh-pages` branch, and choose `/ (root)`.
