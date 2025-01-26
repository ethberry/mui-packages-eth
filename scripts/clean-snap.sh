#!/usr/bin/env bash

echo -e "\033[34mCleaning snapshots...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

find . -type f -name "*.snap" | xargs rm -rf

