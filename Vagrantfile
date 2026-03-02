# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.define :servidorWeb do |servidorWeb|

    servidorWeb.vm.box = "bento/ubuntu-22.04"
    servidorWeb.vm.hostname = "servidorWeb"

    # IP privada fija
    servidorWeb.vm.network :private_network, ip: "192.168.80.10"

    # Recursos suficientes para Docker + MySQL + Consul
    servidorWeb.vm.provider "virtualbox" do |vb|
      vb.gui = true	
      vb.memory = 4096
      vb.cpus = 2
    end

    # IMPORTANTE:
    # NO usamos file provisioner.
    # Trabajaremos con la carpeta sincronizada automática:
    # Windows ↔ /vagrant

    servidorWeb.vm.provision "shell", inline: <<-SHELL

      sudo apt update -y
      sudo apt upgrade -y

      # Instalar herramientas básicas
      sudo apt install -y git curl unzip

      # Instalar Docker
      sudo apt install -y docker.io docker-compose

      sudo systemctl enable docker
      sudo systemctl start docker

      # Permitir usar docker sin sudo
      sudo usermod -aG docker vagrant

    SHELL

  end
end