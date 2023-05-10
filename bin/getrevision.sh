#!/bin/sh

repo=$(git config --get remote.origin.url)
repoURL=$(echo $repo | perl -pe 's/\.git$//;')
revision=$(git rev-parse HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)
url="$repoURL/commit/$revision"
mkdir -p tree
echo "{\"repo\":\"$repo\",\"branch\":\"$branch\",\"url\":\"$url\",\"revision\":\"$revision\"}" > tree/revision.json
