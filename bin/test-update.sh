#!/bin/bash

bash bin/transform-to-common-js.sh

# Updating tests
npx jest -u
