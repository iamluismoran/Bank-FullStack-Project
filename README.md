# REGALBANK

## Descripción del Proyecto

**BankBack** es una aplicación utilizada para simular un sistema bancario.

- Backend: Spring Boot (Java 17), MySQL, JPA/Hibernate.
- Frontend: React + Vite, Auth con Supabase, SPA protegida con rutas privadas.

Esta apliación permite la gestión de cuentas bancarias, usuarios y operaciones básicas como consultas, transferencias, creación de cuentas por parte del administrador y movimientos de terceros. El sistema implementa reglas de negocio como mínimos, comisiones, intereses y penalizaciones.

## Requisitos

- Java 17 + y Maven 3+
- MySQL 8+
- Node.js 18+ y npm
- Supabase



##  Variables de entorno

Backend (Spring Boot)
`bankback/src/main/resources/aplication.properties`
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

Frontend (Vite + React)

```bash
#---- URL base del backend ----
VITE_API_URL=http://localhost:8080/api


```

## Estructura de controladores y rutas


| Método     | Endpoint                        | Descripción                                                                                           |
|------------|---------------------------------|-------------------------------------------------------------------------------------------------------|
| `GET`      | `/api/health`                   | Verifica que la API y la BD estén disponibles                                                         |
| `GET`      | `/api/accounts`                 | Lista de cuentas con paginación y búsqueda. Query: `search`, `page`, `pageSize`.                      |
| `GET`      | `/api/accounts/{id}`            | Detalle de una cuenta |
| `GET`      | `/api/accounts/{id}/balance`    | Obtiene el balance “vivo” aplicando reglas (intereses/penalizaciones)                |
| `POST`      | `/api/accounts/transfer`       | Transferencia entre cuentas del banco (valida secretos / reglas)                              |


> Comportamiento de Home: si hay sesión activa, redirige a Dashboard; si no, muestra la Landing Page.

## Notas de desarrollo
- Auth: se usa Supabase (email + password). El correo del usuario se muestra en el header, el logout limpia la sesión y devuelve a `/login`.
- Owner ID: el front guarda un `ownerId` asociado al usuario para filtrar "Mis cuentas". Esto se persiste como user_metadata en Supabase(y se cachea en `localStorage` para usabilidad).
- Balance en Dahsboard: se prioriza la cuente `CHECKING` como cuenta principal. Para su saldo se llama `/api/accounts/{id}/balance`.
- Estilos: se homogenizó el CSS (tarjetas, jerarquía, tipografías).

## Tecnologías
Backend
- Java 17, Spring Boot 3
- Spring Data JPA / Hibernate
- MySQL
- Maven
- JUnit 5

Frontend
- React 19 + Vite
- React Router
- @tanstack/react-query
- CSS modular por páginas


## Autor del Proyecto
- Autor: Luis Elías Morán
- GitHub: [iamluismoran](https://github.com/iamluismoran)

