#!/bin/bash

postcss .output/public/_nuxt/*.css -u cssnano -d dist/assets

for file in .output/public/_nuxt/*.js; do
  uglifyjs "$file" -o "${file%.js}.min.js"
  mv "${file%.js}.min.js" "$file"
done