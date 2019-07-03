#!/bin/bash

bash ./transform-to-common-js.sh

# Updating tests
npx jest -u
