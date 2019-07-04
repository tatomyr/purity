#!/bin/bash

bash bin/transform-to-common-js.sh

# Running tests
npx jest
