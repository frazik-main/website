---
layout: post
title: Nginx Reverse Proxy for Amazon OpenSearch Kibana with Ansible
date: 2022-10-19 14:34:00
description: A guide on how to set up access to Amazon OpenSearch Service Kibana using an Nginx reverse proxy, provisioned with Ansible. This includes defining inventory, creating a main playbook, and configuring Nginx for basic proxying.
tags: ansible, nginx, opensearch, kibana, reverse-proxy, aws, automation, devops
categories: devops, aws
---

## Motivation

Amazon OpenSearch Service cluster instances run inside a Virtual Private Cloud (VPC). If you want to access the Kibana interface dedicated to one of these instances, you generally have two options. One is tunneling to an EC2 bastion host, which is relatively straightforward. However, a disadvantage of this approach is the need to share bastion host keys with clients. Another option is to set up a reverse proxy on a bastion host that points to the private OpenSearch Kibana endpoint.

This example demonstrates how you can set up access to Kibana using an Nginx reverse proxy and provision it with Ansible.

This example represents a basic setup that can serve as a foundation for future improvements. It does not include secure access configurations like SSL/TLS certificates or authentication. It uses HTTP between the client and the proxy server; for a production environment, using HTTPS in this context is highly recommended. While it's an easier setup, it is also less secure.

## Example

### Inventory

First, you need to define your Ansible inventory with at least one variable (`open_search_endpoint`) which should point to your Kibana instance. Notice that we have two EC2 instances in our inventory. One could be for a production environment, and the second for staging, for example.

```ini
[opensearch_proxies]
proxy-prod ansible_host=ec2-X-X-X-X.compute-1.amazonaws.com open_search_endpoint="http://your-prod-opensearch-kibana-endpoint.com"
proxy-staging ansible_host=ec2-Y-Y-Y-Y.compute-1.amazonaws.com open_search_endpoint="http://your-staging-opensearch-kibana-endpoint.com"
```

### Main Playbook

Next, we define the main Ansible playbook, which is quite straightforward. For it to work, you need to have the configuration files (`default.conf.j2` and a basic `nginx.conf`) located in your Ansible playbook's path.

```yaml
---
- name: Setup Nginx Reverse Proxy for OpenSearch Kibana
  hosts: opensearch_proxies
  become: yes

  tasks:
    - name: Update apt cache (Debian/Ubuntu)
      ansible.builtin.apt:
        update_cache: yes
      when: ansible_os_family == "Debian"

    - name: Install Nginx (Debian/Ubuntu)
      ansible.builtin.apt:
        name: nginx
        state: present
      when: ansible_os_family == "Debian"

    - name: Install Nginx (RedHat/CentOS)
      ansible.builtin.yum:
        name: nginx
        state: present
      when: ansible_os_family == "RedHat"

    - name: Ensure Nginx service is running and enabled
      ansible.builtin.systemd:
        name: nginx
        state: started
        enabled: yes

    - name: Copy default Nginx configuration for Kibana proxy
      ansible.builtin.template:
        src: default.conf.j2 # This file needs to be in your files/templates directory
        dest: /etc/nginx/sites-available/default
        mode: "0644"
      notify: Reload Nginx

    - name: Enable site by symlinking
      ansible.builtin.file:
        src: /etc/nginx/sites-available/default
        dest: /etc/nginx/sites-enabled/default
        state: link
      notify: Reload Nginx

    - name: Remove default Nginx welcome page config (if present)
      ansible.builtin.file:
        path: /etc/nginx/conf.d/default.conf
        state: absent
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      ansible.builtin.systemd:
        name: nginx
        state: reloaded
```

### Default Configuration

For `default.conf.j2`, we are using a simple proxy pass. If you want a more secure connection, this is where you would configure HTTPS. This file should be placed in your `templates` directory (e.g., `playbook_directory/templates/default.conf.j2`).

```nginx
# templates/default.conf.j2
server {
    listen 80;
    server_name _; # Listen on all hostnames or specify your domain

    location / {
        proxy_pass {{ open_search_endpoint }}/; # Note the trailing slash to correctly proxy paths
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        # Add headers to avoid issues with Kibana
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Ensure Kibana URLs are handled correctly if it expects a specific base path
        # proxy_redirect default; # Might be needed if Kibana redirects
    }
}
```

### Nginx Configuration

This typically refers to the main `nginx.conf` file, which is often included with the Nginx installation. The key part for our setup is ensuring that `sites-enabled` configurations are included. You might not need to explicitly manage this file via Ansible if the default Nginx installation already includes the necessary `include` directives. However, if you need to customize global Nginx settings (like `worker_processes` or logging), you would place a template for it (e.g., `nginx.conf.j2`) in your `templates` directory and copy it to `/etc/nginx/nginx.conf` with Ansible.

```nginx
# /etc/nginx/nginx.conf (Example content for completeness)
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*; # This line ensures our 'default' site config is loaded
}
```
