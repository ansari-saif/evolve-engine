#!/bin/sh

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Starting production server with workers..."
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
else
    echo "Starting development server..."
    uvicorn app.main:app --host 0.0.0.0 --port 8000
fi
