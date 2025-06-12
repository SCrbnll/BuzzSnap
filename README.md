# BuzzSnap

**BuzzSnap** es una aplicación web de mensajería en tiempo real que permite a los usuarios comunicarse de forma fluida mediante WebSockets. Ofrece funcionalidades como registro, login, gestión de contactos y envío/recepción de mensajes instantáneos. Este proyecto ha sido desarrollado como parte de mi **Trabajo de Fin de Grado (TFG)** del ciclo superior de **Desarrollo de Aplicaciones Web**.

Decidí utilizar **React** para el frontend y **Spring Boot** con **JPA (Hibernate)** en el backend, formando un stack moderno, robusto y escalable. Para la comunicación en tiempo real se integró un servidor **Socket.IO**, y todo el entorno se puede levantar fácilmente mediante contenedores **Docker** configurados en una instancia EC2 de **AWS**.

---

## Tecnologías Utilizadas

- **Frontend →** React + Vite
- **Backend →** Spring Boot + Hibernate
- **Base de datos →** MySQL
- **Sockets →** Socket.IO
- **Contenedores y despliegue →** Docker + AWS EC2

---

## Estructura de ramas del repositorio

- `main` → Contiene el código fuente final del frontend. Esta rama está conectada a un sistema de despliegue automático en una instancia EC2 de AWS.
- `aws` → Configuración de contenedores Docker. Incluye Dockerfiles y docker-compose para levantar el backend, base de datos y servidor de sockets.
- `bd-api` → Contiene tanto la API desarrollada en Spring Boot como los scripts SQL para la base de datos.
- `desarrollo` → Rama de trabajo principal durante el desarrollo. Aquí se encuentran todos los commits intermedios.
- `sockets` → Código fuente del servidor Socket.IO utilizado para la comunicación en tiempo real.

---

## Instalación y despliegue

### Requisitos

- Node.js
- Docker & Docker Compose
- Acceso al repositorio

### Opción 1: Levantar todo con Docker (recomendado)

1. Clonar el repositorio
   ```bash
   git checkout aws
   ```
2. Cambiar a la rama aws
   ```bash
   git checkout aws
   ```
3. Ejecutar Docker COmposepara levantar el backend, base de datos y servidor de sockets
   ```bash
   docker-compose up --build
   ```
4. En otra terminal, cambiar a la rama main para el frontend
   ```bash
   git checkout main
   ```
5. Instalar dependencias del front
   ```bash
    npm install
   ```
6. Iniciar el frontend
    ```bash
   npm run dev
   ```
   
![BuzzSnap](buzzsnap.png)
