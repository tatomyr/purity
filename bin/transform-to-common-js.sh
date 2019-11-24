#!/bin/bash

# Transforming factory.js to CommonJS module
file_content=`cat ./factory.js`
file_content="${file_content/export const/const}"
file_content+="
;module.exports={createStore}"
echo "$file_content" > __factory__.js

# Transforming htmx.js to CommonJS module
file_content=`cat ./htmx.js`
file_content="${file_content//export const/const}"
file_content+="
;module.exports={htmx,render}"
echo "$file_content" > __htmx__.js
