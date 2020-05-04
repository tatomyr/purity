#!/bin/bash

npx minify core.js > core.min.js
npx minify utils/register-async.js > utils/register-async.min.js
npx minify utils/debounce.js > utils/debounce.min.js
npx minify utils/delay.js > utils/delay.min.js
# npx minify utils/md5.js > utils/md5.min.js
npx minify utils/sanitize.js > utils/sanitize.min.js
npx minify utils/visibility-sensor.js > utils/visibility-sensor.min.js

git add core.min.js utils/*.min.js
