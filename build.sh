#!/bin/sh

if [ -e "dist/" ]; then
    rm -r dist/
fi

npm run build

# zipにする（アップロード用）
if [ -e "package.zip" ]; then
  rm "package.zip"
fi

zip package.zip -r dist/
rm -r dist/
