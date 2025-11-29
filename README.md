**API-Byte**

Descripción
- **Proyecto**: API REST en Node.js + TypeScript para manejar recursos de personas (CRUD).
- **Tecnologías**: Node.js, TypeScript, Express, MySQL, Docker (opcional).

Requisitos
- **Node.js** v16+ y **npm**
- **Docker** y **docker-compose** (opcional, para la base de datos)

Instalación
1. Clonar el repositorio y acceder al proyecto:
   - `git clone <repo>`
   - `cd api-byte`
2. Instalar dependencias:

```powershell
npm install
```

Configuración (variables de entorno)
- Las variables de configuración se leen desde el entorno y están definidas en `src/config/env.config.ts`.
- Variables principales que puede necesitar configurar:
  - `PORT` — puerto donde corre la API (por defecto `3000`)
  - `API_KEY` — clave de API (si aplica)
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`

Base de datos
- Hay un contenedor MySQL preparado en `docker/mysql` con `init.sql` para inicializar esquemas/datos.
- Para levantar la base de datos con Docker:

```powershell
docker-compose up --build
```

Ejecución
- Modo desarrollo (recompilación automática):

```powershell
npm run dev
```

- Compilar y ejecutar la versión de producción:

```powershell
npm run build
npm run start
```

Rutas principales
- Punto de montaje de la API: `http://localhost:<PORT>/api`
- Rutas públicas de ejemplo:
  - `GET /api/` — comprobación de salud de la API
  - `GET /api/test-db` — prueba de conexión a la base de datos

- Módulo de personas (protegido por token): base `GET/POST/PUT/DELETE` en ` /api/persons`
  - `GET /api/persons` — obtener lista de personas
  - `GET /api/persons/:id` — obtener persona por id
  - `POST /api/persons` — crear persona
  - `PUT /api/persons/:id` — actualizar persona
  - `DELETE /api/persons/:id` — eliminar persona

Nota: El módulo de personas está protegido por `verifyToken` (revisar `src/routes/index.ts`).

Estructura del proyecto
- Código fuente en `src/`
  - `src/index.ts` y `src/API-server.ts` — arranque del servidor
  - `src/routes/` — definiciones de rutas (ver `person.routes.ts`)
  - `src/controllers/`, `src/services/`, `src/repositories/` — lógica MVC
  - `src/config/` — configuración y conexión a BD

Tests
- No hay pruebas automatizadas incluidas en el repositorio actualmente.

Contacto
- Si necesitas que incluya ejemplos concretos de peticiones (curl o Postman), autenticación JWT o un `.env.example`, dímelo y lo agrego.

**Pruebas (Testing)**
- **Framework**: Jest con `ts-jest` para TypeScript. Se usa `supertest` para pruebas de rutas.
- **Comandos**:

```powershell
# Ejecutar la suite completa de tests
npm test

# Ejecutar en modo watch
npm run test:watch
```

- **Qué se ha probado**:
  - `tests/routes.test.ts`: pruebas de las rutas públicas (`GET /api/`, `GET /api/test-db`) con mock de la conexión a la base de datos para evitar dependencias externas.
  - `tests/person.service.test.ts`: tests unitarios para `PersonService` (mockeando `PersonRepository`, `CredentialRepository` y funciones de validación) que cubren flujos de creación, obtención, actualización y borrado.

- **Notas sobre mocks**:
  - El middleware de verificación de tokens usa la librería `jose` (ESM). Para los tests se mockea `jose` en los tests que lo requieren para evitar cargas ESM en Jest.
  - La conexión a MySQL se mockea en los tests de rutas para que las pruebas sean deterministas y no dependan de una base de datos en ejecución.

- **Advertencia ts-jest**: al ejecutar los tests puedes ver la advertencia TS151002 relacionada con el modo de módulos (`isolatedModules`). Para eliminarla puedes:
  - habilitar `isolatedModules: true` en `tsconfig.json`, o
  - ajustar `jest.config.ts` para ignorar el código de diagnóstico 151002 en la configuración de `ts-jest`.

**Integración continua (CI) — sugerencia rápida**
- Recomiendo añadir un workflow de GitHub Actions que instale dependencias y ejecute `npm test` en cada PR/push a `main`.

Ejemplo corto (añadir archivo `.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
```

Si quieres que genere el `.env.example`, el workflow de CI o ejemplos de petición curl/Postman en la documentación, dime cuál prefieres y lo agrego.

Arquitectura Docker — tres contenedores
- El `docker-compose.yml` define tres servicios que forman el entorno de desarrollo/QA:
  - `api`: la propia aplicación Node.js/TypeScript (expone `3000` por defecto, mapeado a `${PORT:-3000}` en el host).
  - `keycloak`: servidor Keycloak (autenticación/Autorización). En el `docker-compose` está mapeado al puerto `8180` del host (`8180:8080`).
  - `mysql`: servidor MySQL (base de datos) en el puerto `3306`.

- El servicio `api` depende de `keycloak` y `mysql`, por eso el orden al levantar los contenedores importa.

Levantar los tres contenedores:

```powershell
docker-compose up --build
```

Keycloak (autenticación)
- Propósito: Keycloak emite tokens JWT que se usan para proteger el módulo de `persons` con el middleware `verifyToken`.
- Acceso al admin console: `http://localhost:8180` (usuario: `admin`, contraseña: `admin` según `docker-compose.yml`).

Pasos básicos para configurar Keycloak para esta API (rápido):
1. Entrar al Admin Console en `http://localhost:8180` y crear un nuevo *realm* (ej.: `DemoByte`).
2. Dentro del *realm*, crear un *client* (ej.: `api-client`). Para APIs normalmente:
   - Puede usar `Access Type = confidential` (si la API obtiene tokens via client credentials) o `public`/`direct access` para pruebas con credenciales de usuario.
   - Habilitar **Direct Access Grants** si quieres obtener tokens con `grant_type=password` (útil para pruebas rápidas).
3. Crear usuarios (Users) y asignarles roles/roles del realm si tu API usa control por roles.

Obtener un token (ejemplo con grant password, para pruebas):

```bash
curl -X POST 'http://localhost:8180/realms/DemoByte/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password&client_id=api-client&username=usuario&password=contraseña'
```

Respuesta: JSON con `access_token`. Usar ese token en las peticiones protegidas:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/persons
```

Variables de entorno recomendadas para la integración con Keycloak (añadir a tu `.env`):
- `KEYCLOAK_BASE_URL=http://localhost:8180`
- `KEYCLOAK_REALM=DemoByte`
- `KEYCLOAK_CLIENT_ID=api-client`
- `KEYCLOAK_CLIENT_SECRET=<si usas confidential>`

Notas y recomendaciones
- Para entornos de producción no uses las credenciales por defecto `admin/admin` ni `root/root` de MySQL.
- Si vas a exponer Keycloak en otra máquina/puerto, actualiza `KC_HOSTNAME` y las URLs en el cliente de Keycloak.
- Revisa el middleware `verifyToken` en `src/middlewares/verifyToken.ts` para ver cómo se valida el token y qué claims (roles, audiencia) espera.
