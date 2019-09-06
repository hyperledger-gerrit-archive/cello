#!/bin/sh

#Download kubernetes config
source download_config.sh

#Check if the namespace exists
NAMESPACE_EXISTS=`kubectl get namespaces | grep $AGENT_ID`

#Create a namespace if it doesn't exists
if [ -z "$NAMESPACE_EXISTS" ]
then
      kubectl create namespace $AGENT_ID
fi

CURRENT_NAMESPACE=$AGENT_ID

#Set namespace as default for current context
kubectl config set-context --current --namespace=$CURRENT_NAMESPACE

PERFORM_OPERATION=$OPERATION

if [ $PERFORM_OPERATION == "create" ]
then
	sh create.sh
elif [[ $PERFORM_OPERATION == "delete" ]]
then
	sh delete.sh
else
	echo "Not supported OPERATION"
	exit
fi