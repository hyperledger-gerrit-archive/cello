#!/bin/sh
echo "Getting Kubernetes Agent Config"

#Get kubernetes config file
wget $AGENT_CONFIG_FILE -P /tmp
CONFIG_FILE=$(basename $AGENT_CONFIG_FILE)
if [ ${CONFIG_FILE: -4} == ".zip" ]
then
  unzip /tmp/$CONFIG_FILE -d $HOME/
else
  mkdir $HOME/.kube/ && mv /tmp/$CONFIG_FILE $HOME/.kube/
fi