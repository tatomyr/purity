#!/bin/bash

# Start testing server
npx static-server -p 8085 -c "*" &
# Run tests with Cypress
npx cypress@10.4.0 run --config baseUrl=http://localhost:8085
# Catch the most recent command response
RESULT=$?
# Find the testing server PID
test_server_PID=`ps -A | grep 'static-server -p 8085' | grep -v grep | awk '{print $1}'`
# Kill the process
kill -9 $test_server_PID
# Exit with error if testing has failed
$RESULT || exit $RESULT
