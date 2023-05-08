#!/bin/sh

perl -pe '/\.[cm]?js"/ || s/from "([^"]*)"/from "$1.js"/' -i.bak dest/*/*.js
find dest -name '*.bak' -print | xargs rm 

