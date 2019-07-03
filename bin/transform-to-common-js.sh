#!/bin/bash

# Transforming html.js to CommonJS module
file_content=`cat ./html.js`
file_content="${file_content/export const/const}"
file_content+="
;module.exports={html}"
echo "$file_content" > __html__.js

# Transforming quantum.js to CommonJS module
file_content=`cat ./quantum.js`
file_content="${file_content/export const/const}"
file_content+="
;module.exports={createStore}"
echo "$file_content" > __quantum__.js
