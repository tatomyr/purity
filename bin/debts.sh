#!/bin/bash

# Find all technical debt marks in the project
fixmes=$(grep -r FIXME: . --exclude=*{.snap,__.js} --exclude-dir=coverage --exclude-dir=bin | wc -l)
todos=$(grep -r TODO: . --exclude=*{.snap,__.js} --exclude-dir=coverage --exclude-dir=bin | wc -l)
total=$((fixmes+todos))

# Check whether the .debts file exists and if no - create one
if [ ! -f .debts ]; then
  echo 0 > .debts
fi

# Read previous amount of debts in the project
while read -r prev_debts; do
  diff=$(($total-$prev_debts))
done < .debts

# Write new debts count to file
echo $total > .debts

# Save debts count file to the project's repo
git add .debts

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
# Clear color
NC='\033[0m'

message="${YELLOW}Technical debts: $total${NC} "
if [ $diff -gt 0 ]; then
  message+=\(${RED}+$diff${NC}\)
fi
if [ $diff -lt 0 ]; then
  message+=\(${GREEN}$diff${NC}\)
fi

if [ $total -gt 0 ]; then
  echo
  echo -e "$message (FIXMEs: $(($fixmes)), TODOs: $(($todos)))"
  echo
else
  echo There are no debts!
fi
