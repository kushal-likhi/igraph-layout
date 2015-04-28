#!/bin/sh

C_DIR=`pwd`

cd ./out/igraph-0.7.1

make

cd $C_DIR

pwd

gcc src/igraph-cmd.c -I out/igraph-0.7.1/include/ -L out/igraph-0.7.1/src/.libs -o igraph-cmd -ligraph


