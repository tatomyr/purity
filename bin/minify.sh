#!/bin/bash

npx minify core.js > core.min.js
npx minify utils/register-async.js > utils/register-async.min.js
npx minify lib/debounce.js > lib/debounce.min.js
npx minify lib/delay.js > lib/delay.min.js
# npx minify lib/md5.js > lib/md5.min.js
npx minify lib/sanitize.js > lib/sanitize.min.js
npx minify lib/visibility-sensor.js > lib/visibility-sensor.min.js
