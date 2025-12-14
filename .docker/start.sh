#!/bin/bash

echo "Installing App Dependencies..."
npm ci

echo "App is ready."
tail -f /dev/null