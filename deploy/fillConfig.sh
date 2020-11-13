#!/bin/bash
envs=($(printenv | grep '^VUE_APP'))
function join { local IFS="$1"; shift; echo "$*"; }

jsonProps=()

for i in "${envs[@]}"
do
    jsonProps+=("\"${i%=*}\":\"${i#*=}\"")
done
output="{$(join , ${jsonProps[*]})}"
echo $output