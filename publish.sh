#!/bin/sh

repo=$(git config --get remote.origin.url)
repoURL=$(echo $repo | perl -pe 's/\.git$//;')
revision=$(git rev-parse HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)
url="$repoURL/commit/$revision"
echo "{\"repo\":\"$repo\",\"branch\":\"$branch\",\"revision\":\"$url\"}" > dest/revision.json
[ -d ../thomasoa.github.io ] || exit 0
( cd dest ; tar cf - .) | (cd ../thomasoa.github.io/impossible; tar xvf -)
cd ../thomasoa.github.io
git add .
git commit -m "$*"
git push

