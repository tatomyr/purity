#!/bin/bash

bash bin/pre-build.sh &&
npx tsc &&
find public/examples -iname '*.ts' -delete &&
find public/playground -iname '*.ts' -delete &&
bash bin/minify.sh
