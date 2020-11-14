#!/bin/bash
IFS=$'\n'
envs=($(printenv | grep '^VUE_APP'))
function join { local IFS="$1"; shift; echo "$*"; }

jsonProps=()
for i in "${envs[@]}"
do
    jsonProps+=("\"$(cut -d '=' -f1 <<< $i)\":\"$(cut -d '=' -f2 <<< $i)\"")
done
output="{$(join , ${jsonProps[*]})}"
echo $output