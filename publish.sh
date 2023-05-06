#!/bin/sh

repo=$(git config --get remote.origin.url)
revision=$(git rev-parse HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)
echo "{\"repo\":\"$repo\",\"branch\":\"$branch\",\"revision\":\"$revision\"}" > dest/revision.json
exit 0

[ -d ../thomasoa.github.io ] || exit 0
( cd dest ; tar cf - .) | (cd ../thomasoa.github.io/impossible; tar xvf -)
cd ../thomasoa.github.io
git add .
git commit -m "$*"
git push

