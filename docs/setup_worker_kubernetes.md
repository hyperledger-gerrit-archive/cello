# Kubernetes type host creation guide

## Prepare Kubernetes environment

Get started with Kubernetes: [Kubernetes Guide](https://kubernetes.io/docs/user-journeys/users/application-developer/foundational/)

## Add Kubernetes type host

Login to Cello and navigate to the Hosts-&gt;Add Host

In the &quot;Add a host&quot; page select &quot;Host Type&quot; as KUBERNETES

 ![k8s-select](imgs/k8s-select.png)

Give a name of the Kubernetes host like &quot;cello-k8s&quot;, you can specify a capacity number, this number can be configured later.

 ![k8s-setting](imgs/k8s-setting.png)

In the Master address field input your Kubernetes master node IP address. Port 443 is used as default and is only supported for now.

In the &quot;Credential Type&quot; drop down list, select the credential type for Kubernetes host.

In the &quot;NFS Server Address&quot; input the NFS server address.

**Action required for NFS Service:**
Cello provides the NFS server by default, please ensure the kubernete cluster could connect to the Cello Host node.

Use the host node IP as the NFS address.

In the &quot;Use SSL Verification&quot; checkbox, check it if SSL verification is enabled.

Optional: in the &quot;Extra Parameters&quot; input the extra Kubernetes parameters in JSON format.

There are three ways to connect to Kubernetes Host:
#### Username & password

In the &quot;username&quot; and &quot;password&quot; fields input the username & password with the correct privileges.

#### Certificate and key

In the &quot;Certificate content&quot; input ssh certificate content.

In the &quot;Key content&quot; input ssh key content.

#### Configuration file

In the &quot;Configuration content&quot; input configuration file content.

### Finish Creating Host

Click Create. You will see the follow page.

 ![vm active](imgs/k8s-active.png)

This means that the Kubernetes host is ready the new host will be in active state.


## Minikube setup

Run the following commands in linux platform to setup Minikube test environment:

```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl

export MINIKUBE_WANTUPDATENOTIFICATION=false
export MINIKUBE_WANTREPORTERRORPROMPT=false
export MINIKUBE_HOME=$HOME
export CHANGE_MINIKUBE_NONE_USER=true
mkdir -p $HOME/.kube
touch $HOME/.kube/config

export KUBECONFIG=$HOME/.kube/config
sudo -E ./minikube start --vm-driver=none

# this for loop waits until kubectl can access the api server that Minikube has created
for i in {1..150}; do # timeout for 5 minutes
   ./kubectl get po &> /dev/null
   if [ $? -ne 1 ]; then
      break
  fi
  sleep 2
done
```
