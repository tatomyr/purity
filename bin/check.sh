#!/bin/bash

bash bin/minify.sh &&
bash bin/lint.sh &&
bash bin/test.sh &&
bash bin/debts.sh
