#!/bin/bash

# Start 2 tasks in parallel with output to the terminal
(trap 'kill 0' SIGINT; bash bin/compile.sh & bash bin/serve.sh)
