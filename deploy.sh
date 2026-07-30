#!/bin/bash
set -e

export NODE=/home2/datingsi/nodevenv/backend/18/bin/node
export NPM=/home2/datingsi/nodevenv/backend/18/bin/npm
export WORKDIR=/home2/datingsi/backend

echo "=== Deploying pre-built artifacts ==="
cd "$WORKDIR"

echo "=== Installing production dependencies ==="
$NPM ci --omit=dev

echo "=== Generating Prisma client ==="
$NPM exec prisma generate

echo "=== Running Prisma migrations ==="
$NPM exec prisma migrate deploy

echo "=== Restarting Passenger ==="
mkdir -p "$WORKDIR/tmp"
touch "$WORKDIR/tmp/restart.txt"

echo "=== Deploy complete ==="