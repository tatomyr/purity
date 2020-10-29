#!/bin/bash

npx minify public/purity.js > public/purity.min.js
npx minify public/debounce.js > public/debounce.min.js
npx minify public/delay.js > public/delay.min.js
# npx minify public/md5.js > public/md5.min.js
npx minify public/sanitize.js > public/sanitize.min.js
npx minify public/visibility-sensor.js > public/visibility-sensor.min.js
npx minify public/selection-insert.js > public/selection-insert.min.js
