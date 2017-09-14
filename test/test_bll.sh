#!/bin/bash

arg1="&WT.si_n=CB_&"

for i in `seq $1`; do
    mobile=11`date +%N`
    arg2="&WT.mobile=${mobile}&WT.co_f=${mobile}"
    if (( $i <= 100 )); then 
        curl "http://127.0.0.1:8080/dcs4z5cx4100004v6ds8atsl2_4c9q/dcs.gif?&WT.si_x=99${arg1}${arg2}"
    else      
        curl "http://127.0.0.1:8080/dcs4z5cx4100004v6ds8atsl2_4c9q/dcs.gif?${arg1}${arg2}"           
    fi        
done

echo "Request total $1"
