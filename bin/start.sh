#!/bin/bash

# Start 2 tasks in parallel with output to the terminal
(trap 'kill 0' SIGINT; zsh bin/compile.sh & zsh bin/serve.sh)
