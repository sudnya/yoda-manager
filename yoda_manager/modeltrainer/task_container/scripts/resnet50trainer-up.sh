#!/bin/bash

# Safely execute this bash script
# e exit on first failure
# u unset variables are errors
# f disable globbing on *
# pipefail | produces a failure code if any stage fails
set -Eeuoxa pipefail

# Get the directory of this script
LOCAL_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker run --rm -it -v $HOME/.aws/credentials:/root/.aws/credentials:ro resnet50trainer:latest