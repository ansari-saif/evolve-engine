#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
    echo "Starting production server..."
    serve -s dist -l 3000
else
    echo "Starting development server..."
    yarn dev --host 0.0.0.0 --port 3000
fi
