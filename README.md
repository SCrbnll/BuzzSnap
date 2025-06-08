# BuzzSnap

Este proyecto es un ejemplo de como crear una aplicación web de mensajería en tiempo real utilizando tecnologías como Spring Boot, Socket.IO y Docker.

## Estructura del proyecto

El proyecto se encuentra dividido en dos carpetas:

*   `backend`: Contiene el código fuente del servidor, que se encarga de manejar las conexiones en tiempo real y de almacenar los mensajes en una base de datos. El servidor se encuentra en la carpeta `api` y se encarga de manejar las conexiones REST. La carpeta `socket` contiene el código del servidor Socket.IO.
*   `frontend`: Contiene el código fuente de la interfaz de usuario, que se encarga de mostrar los mensajes en la pantalla del usuario. El frontend se encuentra en la carpeta `nginx` y se encarga de servir el contenido estático de la aplicación.

## Cómo funciona

El servidor Socket.IO se encarga de manejar las conexiones en tiempo real entre los clientes y el servidor. Cuando un usuario envía un mensaje, el servidor Socket.IO se encarga de reenviar ese mensaje a todos los clientes conectados. El servidor REST se encarga de manejar las solicitudes de los clientes y de almacenar los mensajes en una base de datos.

## Cómo ejecutar el proyecto

Para ejecutar el proyecto, es necesario instalar Docker en tu máquina local. Luego, es necesario ejecutar el comando `docker-compose up -d --build` en la carpeta raíz del proyecto. Esto creará los contenedores necesarios para ejecutar la aplicación.

Una vez que los contenedores estén ejecutándose, puedes acceder a la aplicación desde tu navegador web, accediendo a la dirección `http://localhost`.
