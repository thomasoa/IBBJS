#!/bin/sh

[ -d ../thomasoa.github.io ] || exit 0
( cd dest ; tar cf - .) | (cd ../thomasoa.github.io/impossible; tar xvf -)
cd ../thomasoa.github.io
git add .
git commit -m "IBBJS: $*"
git push

