# RegalBank

## Descripción del Proyecto

**RegalBank** es una aplicación full-stack didáctica que simula un sistema bancario.

- Backend: Spring Boot (Java 17), MySQL, JPA/Hibernate.
  Expone una API REST con tres áreas: Cuentas, Administración de cuentas y Terceros.
- Frontend: React + Vite, Auth con Supabase, SPA protegida con rutas privadas.
  Implementa el portal del cliente (no incluye UI de administración).

La solución permite gestionar cuentas bancarias, usuarios y operaciones como consulta de saldos, listado/detalle de cuentas y (a nivel de API) transferencias internas, alta/baja de cuentas y cambio de estado. Se aplican reglas de negocio como mínimos, comisiones, intereses y penalizaciones al calcular balances.

## Arranque local

Backend (Spring Boot)
```bash

# 1) Clonar repositorio
     git clone https://github.com/iamluismoran/Bank-FullStack-Project.git

# 2) Configurar MySQL en `application.properties`.
     Ver sección en Variables de entorno

# 3) Levantar la API
     ./mvnw spring-boot:run
     #API disponible en http://localhost:8080
     #Health check: http://localhost:8080/api/health

```

Frontend (Vite + React)
```bash

# 1) En otra terminal, ir a la carpeta del front
     cd my-front

# 2) Instalar dependencias
     npm install

# 3) Crear .env y arrancar
     npm run dev

Front disponible en http://localhost:5173

```

## Requisitos

- Java 17 + y Maven 3+
- MySQL 8+
- Node.js 18+ y npm
- Supabase

##  Variables de entorno

Backend (Spring Boot)
Ruta: `bankback/src/main/resources/application.properties`
```bash
#---- App ----
spring.application.name=bankback

# ---- MySQL ----
spring.datasource.url=jdbc:mysql://localhost:3314/bankback?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=ironhack
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ---- JPA / Hibernate ----
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# # ---- data.sql ----
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always

# ---- Errores ----
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

```
> Nota: `ddl-auto=create-drop` es cómodo para desarrollo (recrea el esquema en cada arranque).


Frontend (Vite + React)

```bash
#---- URL base del backend ----
VITE_API_URL=http://localhost:8080/api


```

## API Endpoints


| Método     | Endpoint                        | Descripción                                                                                           |
|------------|---------------------------------|-------------------------------------------------------------------------------------------------------|
| `GET`      | `/api/health`                   | Verifica que la API y la BD estén disponibles                                                         |
| `GET`      | `/api/accounts`                 | Lista de cuentas con paginación y búsqueda. Query: `search`, `page`, `pageSize`.                      |
| `GET`      | `/api/accounts/{id}`            | Detalle de una cuenta |
| `GET`      | `/api/accounts/{id}/balance`    | Obtiene el balance “vivo” aplicando reglas (intereses/penalizaciones)                                 |
| `POST`     | `/api/accounts/transfer`       | Transferencia entre cuentas del banco (valida secretos / reglas)                                       |
| `POST`     | `/api/admin/accounts/checking-or-student`    | Crea cuenta `Checking / Student` .                                                       |
| `POST`     | `/api/admin/accounts/saving`       | Crea una cuenta `Savings`.                                                                         |
| `POST`     | `/api/admin/accounts/credit-card`  | Crea una cuenta `Credit card`.                                                                     |
| `PATCH`    | `/api/admin/accounts/{id}/status?status=`   |Cambia estado de la cuenta (por ej. `ACTIVE, FROZEN`).                                     |
| `DELETE`   | `/api/admin/accounts/{id}`  | Elimina una cuenta.                                                                                       |

> Comportamiento de Home: si hay sesión activa, redirige a Dashboard; si no, muestra la Landing Page.
> En el front hay un botón `Probar conexión` (consulta `GET /api/health`) que muesttra Conexión abierta / Sin conexión.


## Tecnologías

| Área                | Tecnologías                                                                 |
|---------------------|------------------------------------------------------------------------------|
| **Frontend**        | React + Vite, React Router, CSS modular por páginas                |
| **Autenticación**   | Supabase Auth (email/password, `user_metadata` para `ownerId`)              |
| **Backend**         | Java 17, Spring Boot 3, Spring Web, Spring Data JPA (Hibernate)             |
| **Base de datos**   | MySQL 8 (local)                                                              |
| **Testing**         | JUnit 5 (backend)                                                            |
| **Tooling**         | Maven, Node.js (npm), Postman, DBeaver                    |
| **Dev/Build**       | Vite Dev Server (5173), Spring Boot (8080)                                   |


## Notas de desarrollo
- Auth, se usa Supabase (email + password). El correo del usuario se muestra en el header, el logout limpia la sesión y devuelve a `/login`.
- Owner ID en el front guarda un `ownerId` asociado al usuario para filtrar "Mis cuentas". Esto se persiste como user_metadata en Supabase(y se cachea en `localStorage` para usabilidad).
- Balance en Dashboard, se prioriza la cuenta `CHECKING` como cuenta principal. Para su saldo se llama `/api/accounts/{id}/balance`.
- Estilos unificados (tarjetas, jerarquía, tipografías).

Capacidades de adminstración
- Crear cuentas (`Checking/Student`, `Savings`, `Credit Card`).
- Cambiar estado `(ACTIVE/FROZEN)`.
- Eliminar cuentas.

> Estas acciones se prueban con Postman; no hay interfaz Visual en el front. 

## Mejoras futuras
- Interfaz de administración (web) para las operaciones ya disponibles en la API.
- Roles y permisos (clientes / admin) y vistas separadas.
- Transferencias desde el front, historial y movimientos.
- Auditoría y registro de actividad.
- Tareas programadas para aplicar comisiones/intereses periódicos

## Autor del Proyecto
- Autor: Luis Elías Morán
- GitHub: [iamluismoran](https://github.com/iamluismoran)