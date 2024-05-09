# Stealthy Users UI
Frontend service component of Stealthy application for users management.
UI server that serves static pages. Encapsulates admin user's business
logic of Stealthy application:
- provides UI for viewing list of active users
- provides UI of creating and deleting application users

### Technologies
Build with:
- Angular 17
- Nginx 1.25.3

Works on HTTP web protocol.

### Requirements
Installed Docker and Docker-compose plugin

### How to up and run
#### Configure application
1. Copy file: `config.yaml.example` to `src/app/assets/config.yaml`.
2. Make changes you need in configuration file.

#### Build docker images
Build docker images and start service
```bash
docker compose up
```

Stop and remove containers after application use
```bash
docker compose down
```

### Usage
UI can be used only in pair with REST API backend server:
https://github.com/DmitroKihtenko/stealthy-access-backend.
After backend server was launched you should set access token
from backend server configuration file in UI header.
