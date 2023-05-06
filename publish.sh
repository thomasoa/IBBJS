#!/bin/sh

repo=$(git config --get remote.origin.url)
revision=$(git rev-parse HEAD)
[ -d ../thomasoa.github.io ] || exit 0
echo "{\"repo\":\"$repo\",\"revision\":\"$revision\"}" > dest/revision.json
( cd dest ; tar cf - .) | (cd ../thomasoa.github.io/impossible; tar xvf -)
cd ../thomasoa.github.io
git add .
git commit -m "$*"
git push

