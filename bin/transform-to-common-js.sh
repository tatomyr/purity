#!/bin/bash

# Transforming core.js to CommonJS module
file_content=`cat ./core.js`
file_content="${file_content//export const/const}"
file_content+="
;module.exports={createStore,render}"
echo "$file_content" > __core__.js
