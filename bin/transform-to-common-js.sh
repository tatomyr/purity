#!/bin/bash

# Transforming htmx.js to CommonJS module
file_content=`cat ./htmx.js`
file_content="${file_content/export const/const}"
file_content+="
;module.exports={htmx}"
echo "$file_content" > __htmx__.js

# Transforming purity.js to CommonJS module
file_content=`cat ./purity.js`
file_content="${file_content/export const/const}"
file_content+="
;module.exports={createStore}"
echo "$file_content" > __purity__.js
