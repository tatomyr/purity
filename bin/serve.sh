#!/bin/bash

# Run this to serve the modules locally @ http://localhost:8081/
# deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts --port 8081 --cors

# Using NPX
npx static-server -p 8081 -c "*"
