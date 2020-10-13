#!/bin/bash

npx minify src/purity.js > src/purity.min.js
npx minify src/debounce.js > src/debounce.min.js
npx minify src/delay.js > src/delay.min.js
# npx minify src/md5.js > src/md5.min.js
npx minify src/sanitize.js > src/sanitize.min.js
npx minify src/visibility-sensor.js > src/visibility-sensor.min.js

git add src/*.min.js
