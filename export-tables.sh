if [ -d "table-out" ]; then
  rsync --recursive --remove-source-files table-out/ out/ && rm -rf table-out
fi
