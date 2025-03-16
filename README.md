# BBDD & API

### SQL
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único del usuario
    name VARCHAR(100) NOT NULL,         -- Nombre del usuario
    email VARCHAR(255) UNIQUE NOT NULL, -- Email del usuario (único)
    password VARCHAR(255) NOT NULL,     -- Contraseña cifrada
    avatar_url VARCHAR(255) DEFAULT 'https://media.discordapp.net/attachments/1350894316767416412/1350897517507903559/2301-default-2.png?ex=67d868da&is=67d7175a&hm=7cf1b8c93ccdb5b4091dedd02f9ecfc665ac2a779e2440413781caf05e343839&=&format=webp&quality=lossless',            -- URL del avatar (puede ser almacenado en un S3)
    description VARCHAR(255),			-- Descripción personaizada del usuario
    theme VARCHAR(50) DEFAULT 'light',  -- Tema seleccionado (por ejemplo 'light' o 'dark')
    last_login TIMESTAMP NULL DEFAULT NULL,  -- Última vez que el usuario estuvo en línea
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la cuenta
    closed BOOLEAN DEFAULT false        -- Estado de la cuenta (borrada o no borrada)
);

-- 2. Tabla de Amigos o Contactos
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,               -- Usuario que envió la solicitud
    friend_id INT NOT NULL,             -- Usuario al que se le envió la solicitud
    status ENUM('pending', 'accepted', 'canceled') NOT NULL, -- Estado de la solicitud
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha en que se realizó la solicitud
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,  
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE 
);

-- 3. Tabla de Grupos
CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,   -- ID único del grupo
    name VARCHAR(100) NOT NULL,           -- Nombre del grupo
    image_url VARCHAR(255),               -- URL de la imagen del grupo (puede ser almacenada en un S3)
    description TEXT,                     -- Descripción del grupo
    created_by INT NOT NULL,              -- ID del creador del grupo
    invite_code VARCHAR(8) UNIQUE NOT NULL,  -- Código de invitación único para el grupo (letras y números, longitud máxima 8)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación del grupo
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE 
);

-- 4. Tabla de Miembros de Grupos
CREATE TABLE group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- ID único
    group_id INT NOT NULL,                  -- ID del grupo
    user_id INT NOT NULL,                   -- ID del usuario
    role ENUM('admin', 'member') NOT NULL,  -- Rol del miembro (Administrador o Miembro)
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de unión al grupo
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,  
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    
);

-- 5. Tabla de Mensajes
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- ID único del mensaje
    sender_id INT NOT NULL,                  -- ID del usuario que envió el mensaje
    group_id INT DEFAULT NULL,               -- ID del grupo (si es mensaje de grupo)
    receiver_id INT DEFAULT NULL,            -- ID del receptor (si es mensaje privado)
    message_type ENUM('text', 'image', 'video', 'audio') NOT NULL, -- Tipo de mensaje (texto o multimedia)
    content TEXT NOT NULL,                   -- Contenido del mensaje
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación del mensaje
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE, 
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE 
);

```

### Compilar el Proyecto
Usa Maven para compilar el proyecto. Esto descargará todas las dependencias necesarias y compilará el código fuente:

```bash
mvn clean install
```

### Ejecutar la Aplicación
Para ejecutar la aplicación, utiliza el siguiente comando de Maven:

```bash
mvn spring-boot:run
```

### Acceder a la Aplicación
Una vez que la aplicación esté en funcionamiento, puedes acceder a ella a través de tu navegador web en la siguiente URL:

```arduino
http://localhost:8080
```

### Configuración Adicional
- Archivo application.properties
Puedes configurar diferentes aspectos de la aplicación en el archivo `src/main/resources/application.properties` y en el arcihvo `src/main/resources/hibernate.cfg.xml`. Por ejemplo, puedes configurar la conexión a la base de datos, el puerto del servidor, etc.

```properties
# application.properties ::
spring.datasource.url=jdbc:mariadb://localhost:3306/nombre_de_tu_base_de_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
server.port=8080


# hibernate.cfg.xml ::
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
        "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
        "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.dialect">org.hibernate.dialect.MySQL8Dialect</property>
        <property name="hibernate.connection.password">tu_contraseña</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost/nombre_de_tu_base_de_datos</property>
        <property name="hibernate.connection.username">tu_usuario</property>
        <property name="hibernate.dialect">org.hibernate.dialect.MariaDBDialect</property>
        <property name="hibernate.show_sql">true</property>
        <property name="hibernate.format_sql">false</property>
    </session-factory>
</hibernate-configuration>
```

### Compilar y Empaquetar
Para compilar y empaquetar la aplicación en un archivo JAR ejecutable, utiliza el siguiente comando:

```bash
mvn clean package
```

El archivo JAR resultante se encontrará en el directorio target y puedes ejecutarlo con:

```bash
java -jar target/nombre-de-tu-archivo.jar
```
