#!/bin/sh

# Start the Node.js server in the background
node dist/index.js &

# Start nginx in the foreground
nginx -g "daemon off;" 