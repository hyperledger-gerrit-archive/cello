# Hyperledger-fabric on AWS using ansible

This document focused on the explanation of  files related to ansible agent which you need to alterate 
if you run your custom network for deploying fabric on AWS using ansible .
There are two aws related files in ansible agent directory .One is root file located in main ansible
agent directory  while other is located in vars directory.

## Aws Root File :

Default content of this file are as follows

```
---
- name: Get start timestamp
  hosts: cloud
  connection: local
  tasks:
    - set_fact:
        starttime: "{{ ansible_date_time }}"

- name: Run the plays
  vars:
    env: "aws"
    cloud_type: "aws"
  include: "roles/cloud_aws/plays.yml"

- name: Run the plays
  vars:
    env: "aws"
    env_type: "flanneld"
  include: "roles/env_flanneld/{{ mode }}.yml"

- name: Run the plays
  vars:
    env: "bc1st"
    deploy_type: "compose"
  include: "roles/deploy_compose/plays.yml"

- name: Inform the installer
  hosts: cloud
  connection: local
  tasks:
    - debug:
        msg: >-
          The work load started at {{ hostvars.cloud.starttime.time }},
          ended at {{ ansible_date_time.time }}

```
Ansible execute this file and run plays according to path defined in this file.    
If you define your custom fabric configuration file then you need to change this section according 
to your filename

```
- name: Run the plays
  vars:
    env: "bc1st"
    deploy_type: "compose"
  include: "roles/deploy_compose/plays.yml"

```
## Vars/aws.yml File :
Another configuration file related to aws is aws.yml in vars directory 
(https://github.com/hyperledger/cello/tree/master/src/agent/ansible/vars)
which need little bit alteration . Lets take a look at that configuration file

```
---
# AWS Keys will be use to provision EC2 instances on AWS Cloud
auth: {
  auth_url: "",
  # This should be your AWS Access Key ID
  username: "AKIAJY32VWHYOFOR4J7Q",
  # This should be your AWS Secret Access Key
  # can be passed as part of cmd line when running the playbook
  password: "{{ password | default(lookup('env', 'AWS_SECRET_KEY')) }}"
}

# These variable defines AWS cloud provision attributes
cluster: {
  region_name: "us-east-1",     #TODO  Dynamic fetch
  availability_zone: "", #TODO  Dynamic fetch based on region
  security_group: "Fabric",

  target_os: "ubuntu",
  image_name: "ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-*",
  image_id: "ami-d15a75c7",
  flavor_name: "t2.medium",  # "m2.medium" is big enough for Fabric
  ssh_user: "ubuntu",
  validate_certs: True,
  private_net_name: "demonet",

  public_key_file: "/home/ubuntu/.ssh/fd.pub",
  private_key_file: "/home/ubuntu/.ssh/fd",
  ssh_key_name: "fabric",
  # This variable indicate what IP should be used, only valid values are
  # private_ip or public_ip
  node_ip: "public_ip",
  assign_public_ip: true,

  container_network: {
    Network: "172.16.0.0/16",
    SubnetLen: 24,
    SubnetMin: "172.16.0.0",
    SubnetMax: "172.16.255.0",
    Backend: {
      Type: "udp",
      Port: 8285
    }
  },

  service_ip_range: "172.15.0.0/24",
  dns_service_ip: "172.15.0.4",

  # the section defines preallocated IP addresses for each node, if there is no
  # preallocated IPs, leave it blank
  node_ips: [ ],

  # fabric network node names expect to be using a clear pattern, this defines
  # the prefix for the node names.
  name_prefix: "fabric",
  domain: "fabricnet",

  # stack_size determines how many virtual or physical machines we will have
  # each machine will be named ${name_prefix}001 to ${name_prefix}${stack_size}
  stack_size: 3,

  etcdnodes: ["fabric001", "fabric002", "fabric003"],
  builders: ["fabric001"],

  flannel_repo: "https://github.com/coreos/flannel/releases/download/v0.7.1/flannel-v0.7.1-linux-amd64.tar.gz",
  etcd_repo: "https://github.com/coreos/etcd/releases/download/v3.2.0/etcd-v3.2.0-linux-amd64.tar.gz",
  k8s_repo: "https://storage.googleapis.com/kubernetes-release/release/v1.7.0/bin/linux/amd64/",
  go_repo: "https://dl.google.com/go/go1.9.2.linux-amd64.tar.gz",

  # If volume want to be used, specify a size in GB, make volume size 0 if wish
  # not to use volume from your cloud
  volume_size: 8
}

```
First you need to change username` in auth section` . You need to generate AWS Access key Id and 
AWS secret access token from your aws account . Once you generated those keys , replace that 
`AWS Access Key Id` with your key . 
Regarding your secret access token , save it somewhere else . You will need this key later .

### Cluster Section: 
Cluster section defines your region name and security group . 
When you run ansible script it will create clusters in that specific region and create security group 
with name Fabric.If you want to change security group name you can change in this file.

### Target_os Section : 
This section defines what os should be installed on your amazon clusters. One thing you need to make
sure that you aws account should be capable of hosting `t2.medium` instances . 
Normally free aws account have limit of `t2.micro` instances which is not enough for running fabric
network .

Next section is related to public key /private key section . Ansible will store public key and 
private key in your local ssh directory so that later on you can ssh’ed into your ubuntu instances 
from your terminal . 

One thing you need to take care is `ssh_key_name` . You should generate and download your 
ssh key-pairs from your aws account here https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#KeyPairs:sort=keyName 
and replace `ssh_key_name` with your key-pair names . You will need to provide that ssh key path 
when logging into ubuntu instances.

### Stack_Size : 
Stack_size define number of servers that you want to put in your fabric architecture. By default 
ansible uses 3 servers but you can increase or decrease it as per your requirements.

## Configuring Fabric Layout:

Ansible by default uses this configuration file to deploy fabric on aws. 
(https://github.com/hyperledger/cello/blob/master/src/agent/ansible/vars/bc1st.yml ).
You can replace this file with your custom file or can  tweek this file .

The `bc1st.yml` layout file tells ansible to deploy 4-organizations and their peers on three 
ubuntu servers with database set as `couchdb` . Out of 4 orgainzations , orgc and orgd act as 
ordering service while orga and orgb will be main participants which involves in transfer of assets.
Since there are multiple ordering-service so we need kafka and zookeeper servers for consensus mechanism . 
In this layout file we define 3 kafka and zookeeper servers which is enough for this network. 
However for larger network you should properly calculate sizing of these kafka servers. 

You can define as many kafka servers but make sure it dosen’t overkill your application.
For Kafka and zookeeper to run properly  you need `t2.medium` instances . Reason being is zookeeper 
and Kafka needs at least 1 GB RAM to properly work while `t2.micro` instance is unable to provide . 
If you run with micro instance you will probably end up getting `Memory corruption` error in kafka 
containers.

Rest of the contents in this file is self explanatory .

## Other Important Files:

### ansible/role/deploy_compose : 
This folder contain all necessary code regarding fabric setup from channel_artifacts to instantiate_chaincode .

### Chaincode : 
If you want to change chaincode , navigate to https://github.com/hyperledger/cello/tree/master/src/agent/ansible/roles/deploy_compose/fabricsetup/templates 
and paste your chaincode in file `firstcode.go`

### Endorsement Policy : 
If you want to change endorsement policy , navigate to dochannel.j2' 
(https://github.com/hyperledger/cello/blob/master/src/agent/ansible/roles/deploy_compose/fabricsetup/templates/dochannel.j2) 
and change policy as per your business needs.

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>


