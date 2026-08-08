#!/usr/bin/env bash
# Build with the GH Pages base path and publish dist/ to the gh-pages branch.
set -e
export PATH="$HOME/.local/node/bin:$PATH"
# Self-contained demo: equipment images served from this same GH Pages build,
# not the (possibly not-yet-live) production root domain.
DEPLOY_BASE=/affordable-air-direct-store/ \
VITE_ASSET_BASE=https://servicespartan432.github.io/affordable-air-direct-store/equipment \
  npm run build
rm -rf /tmp/ghp && cp -r dist /tmp/ghp && cd /tmp/ghp && touch .nojekyll
# SPA fallback for BrowserRouter on GH Pages: serve the app at any path
cp index.html 404.html
git init -q && git checkout -qb gh-pages && git add -A
git -c user.email=jeremiah@service-spartan.com -c user.name="Jeremiah Ballew" commit -q -m "Deploy store demo"
git remote add origin https://github.com/ServiceSpartan432/affordable-air-direct-store.git
git push -qf origin gh-pages
echo "Deployed -> https://servicespartan432.github.io/affordable-air-direct-store/"
