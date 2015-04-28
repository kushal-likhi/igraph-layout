#!/bin/sh

rm -rfv ./out/igraph-0.7.1

cp -rfv deps/igraph-0.7.1 ./out/igraph-0.7.1

cd ./out/igraph-0.7.1

./configure