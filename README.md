# ☁️ Parcial #2 - Computación en la Nube

Este repositorio contiene la entrega del **Segundo Parcial de Computación en la Nube**.

## 👥 Estudiantes
*   **Andrés Cardona**
*   **Juan Esteban Salazar**

---

## 🛠️ Descripción del Proyecto
El proyecto consiste en una arquitectura de microservices altamente disponible y reproducible, desplegada inicialmente en un entorno local (Vagrant) y diseñada para ser escalable en la nube (Azure).

### Componentes Clave:
1.  **Infraestructura como Código (IaC)**:
    *   **Terraform**: Para el aprovisionamiento de máquinas virtuales y recursos de red.
    *   **Ansible**: Para la configuración automática de los nodos (instalación de Docker, HAProxy y despliegue de contenedores).
2.  **Arquitectura de Microservicios**:
    *   Tres microservicios independientes (`Users`, `Products`, `Orders`) desarrollados en Flask con bases de datos MySQL aisladas.
    *   **Consul**: Para Service Discovery entre microservicios.
3.  **Balanceo de Carga**:
    *   **HAProxy**: Como punto de entrada único, gestionando el ruteo por rutas URL (`/api/users`, etc.) y balanceo Round-Robin entre múltiples réplicas.
4.  **Orquestación con Kubernetes**:
    *   Manifiestos de Kubernetes para despliegue en cluster (Local con Minikube o Cloud con AKS).
    *   Uso de **Ingress Controller** para la gestión del tráfico externo.

---

## 🚀 Cómo ejecutar (Modo Local)

1.  **Levantar Infraestructura**:
    ```bash
    vagrant up
    ```
2.  **Configurar con Ansible**:
    Desde el nodo `control`:
    ```bash
    cd /vagrant/provisioning/ansible
    ansible-playbook -i inventory.ini playbook.yml --extra-vars "ansible_ssh_pass=vagrant"
    ```
3.  **Acceder al Sistema**:
    *   **API**: `http://192.168.80.11/api/users`
    *   **Estadísticas HAProxy**: `http://192.168.80.11:8080/stats` (admin/admin123)

---
*Universidad EAFIT - 2026*
