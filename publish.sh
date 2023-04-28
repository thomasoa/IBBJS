#!/bin/sh

[ -d ../thomasoa.github.io ] || exit 0
( cd dest ; tar cf - .) | (cd ../thomasoa.github.io/impossible; tar xvf -)
cd ../thomasoa.gitgub.io
git add .
git commit -m $1
git push

