#!/bin/bash

for i in `ls ./test*`; do
  sh $i $1
done
