#!/bin/bash

# Exit immediately if a command exits with a non-zero status for initial setup
set -e

echo "================================================="
echo "   Starting Application Environment              "
echo "================================================="

if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies (first time)..."
  npm install
else
  echo "📦 Dependencies already installed. Skipping npm install..."
fi

echo "🚀 Starting Next.js Server and Decap CMS Proxy..."
echo "Press Ctrl+C to stop both servers."
echo "-------------------------------------------------"

# Open the local URLs automatically after 4 seconds to give servers time to start
(sleep 4 && open "http://localhost:3000" && open "http://localhost:3000/admin/index.html/") &

# Use concurrently to run both commands in parallel and kill both if either exits
npx --yes concurrently \
  --prefix "[{name}]" \
  --names "Next.js,DecapCMS" \
  --prefix-colors "blue,green" \
  --kill-others \
  "npm run dev" \
  "npm run cms-proxy"
