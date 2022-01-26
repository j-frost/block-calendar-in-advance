#!/bin/bash
# #### Instructions to fill the CLASPJSON_FILE env var
#  1. `clasp login` and authenticate
#  2. `clasp clone` and choose the correct project
#  3. `cat .clasp.json` and copy the output
#  4. Go to https://gitpod.io/settings/ and create:
#     - name: CLASPJSON_FILE
#     - value: paste-the-output
#     - repo: j-frost/block-calendar-in-advance

if [ -z "$CLASPJSON_FILE" ]; then
    echo "CLASPJSON_FILE not set, doing nothing."
    return;
fi
echo "$CLASPJSON_FILE" > "/workspace/block-calendar-in-advance/.clasp.json"
