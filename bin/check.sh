#!/bin/bash

bash bin/lint.sh && bash bin/minify.sh && bash bin/test.sh && bash bin/debts.sh
