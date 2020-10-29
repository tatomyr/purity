#!/bin/bash

bash bin/lint.sh &&
bash bin/jest.sh &&
bash bin/e2e.sh
