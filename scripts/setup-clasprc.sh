#!/bin/bash
# #### Instructions to fill the CLASPRC_FILE env var
#  1. `clasp login` and authenticate
#  2. `cat ~/.clasprc.json` and copy the output
#  3. Go to https://gitpod.io/settings/ and create:
#     - name: CLASPRC_FILE
#     - value: paste-the-output
#     - repo: j-frost/block-calendar-in-advance

if [ -z "$CLASPRC_FILE" ]; then
    echo "CLASPRC_FILE not set, doing nothing."
    return;
fi
echo "$CLASPRC_FILE" > "/home/gitpod/.clasprc.json"
