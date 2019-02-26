if [ -d "table-out" ]; then
  rsync --recursive --remove-source-files --ignore-missing-args table-out/ out/ && rm -rf table-out
fi
