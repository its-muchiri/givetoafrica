#!/bin/bash
cd /home2/datingsi/backend

echo "Starting deploy..."

npm install --production

npx prisma generate

npx prisma migrate deploy

echo "Deploy complete"