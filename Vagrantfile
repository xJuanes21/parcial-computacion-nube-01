# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-22.04"

  # NODO DE CONTROL (Terraform + Ansible)
  config.vm.define "control" do |control|
    control.vm.hostname = "control-node"
    control.vm.network "private_network", ip: "192.168.80.10"
    control.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 1
    end
    # Provisioning basic tools in control node
    control.vm.provision "shell", inline: <<-SHELL
      sudo apt update -y
      sudo apt install -y gnupg software-properties-common curl git unzip ansible
      
      # Instalar Terraform
      wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
      echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
      sudo apt update && sudo apt install terraform -y
    SHELL
  end

  # VM PARA HAPROXY
  config.vm.define "haproxy" do |haproxy|
    haproxy.vm.hostname = "vm-haproxy"
    haproxy.vm.network "private_network", ip: "192.168.80.11"
    haproxy.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end
  end

  # VM PARA MICROSERVICIOS
  config.vm.define "microservices" do |microservices|
    microservices.vm.hostname = "vm-microservices"
    microservices.vm.network "private_network", ip: "192.168.80.12"
    microservices.vm.provider "virtualbox" do |vb|
      vb.memory = "4096"
      vb.cpus = 2
    end
  end
end