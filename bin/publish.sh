#!/bin/sh

source=./tree
githubpage=../thomasoa.github.io
destination=$githubpage/impossible
[ -d $source ] || echo "Directory $source does not exist"
[ -d $source ] || exit

[ -d ../thomasoa.github.io ] || exit 0
( cd $source ; tar cf - .) | (cd $destination ; tar xvf -)
cd $githubpage
git add impossible
git commit -m "IBBJS: $*"
git push

