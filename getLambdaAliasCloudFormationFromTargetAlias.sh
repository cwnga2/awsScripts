#!/bin/bash
function getLambdaAliasCloudFormationFromTargetAlias()
{

  if ! [ -x "$(command -v jq)" ]; then
      echo 'Error: jq not install' >&2
      exit 1
  fi
  local functionName=$1
  local currentAliasName=$2
  local aliasName=$3
  local version
  version=$(aws lambda get-alias --function-name "$functionName" --name "$currentAliasName" | jq ".FunctionVersion | tonumber")

  cloudformation=$(cat <<EOF
  ${functionName}Tag${aliasName}:
    Type: "AWS::Lambda::Alias"
    Properties:
      FunctionName: "$functionName"
      FunctionVersion: $version
      Name: "$aliasName"
EOF
)
  echo "$cloudformation"
}

