#!/bin/bash
redis-cli flushall

arg1="&WT.si_n=CB_&"

for i in `seq $1`; do
  mobile=11`date +%N`
  arg2="&WT.mobile=${mobile}&WT.co_f=${mobile}"
  curl http://192.168.4.156:8080/dcs4z5cx4100004v6ds8atsl2_4c9q/dcs.gif?${arg1}${arg2}
done

echo "Request total $1"
