# TopDealerAuto - Project Context & Guidelines

## Project Overview
**TopDealerAuto** é um sistema de gerenciamento de concessionária de veículos. O projeto é dividido em um frontend web (estático) e uma API REST backend desenvolvida em Spring Boot.

## Architecture & Technologies

### Frontend (Root Directory)
- **Tech Stack:** HTML5, CSS3, JavaScript (ES6 Modules).
- **Frameworks:** Bootstrap 5.3.0, Bootstrap Icons.
- **Key Files:**
    - `index.html`: Página principal e estrutura da UI.
    - `Dev.js`: Lógica de interação, chamadas de API e manipulação do DOM.
    - `Dev.css`: Estilização customizada.
    - `Favicon.jpg`, `Kicks*.jpeg`: Assets de imagem.

### Backend (`/backend`)
- **Tech Stack:** Java 21, Spring Boot 4.0.3 (Project Parent).
- **Architecture:** Controller-Model-Repository (MVC simplificado para API).
- **Dependencies:**
    - Spring Data JPA (Persistência).
    - Spring Web (REST Endpoints).
    - SQL Server (MSSQL Driver).
- **Database:** Configurado via `application.properties`.
- **Namespace:** `com.topdealerauto.backend`.

## Project Standards

### Naming Conventions
- **Java:** CamelCase para classes, camelCase para métodos/variáveis. Seguir padrões Spring Boot.
- **Frontend:** kebab-case para classes CSS, camelCase para variáveis/funções JavaScript.

### Code Style
- **Java:** Respeitar as anotações do Spring Boot (`@RestController`, `@Entity`, `@Repository`).
- **JavaScript:** Utilizar `async/await` para operações assíncronas e seguir a estrutura de módulos.
- **HTML:** Manter a estrutura semântica do Bootstrap.

## Common Tasks & Workflows

### Running Backend
- Navegar para `/backend`.
- Executar `./mvnw spring-boot:run`.

### Running Frontend
- O frontend pode ser servido por qualquer servidor estático simples ou aberto diretamente via `index.html` (considerando restrições de CORS ao se comunicar com a API local).

### Database
- O projeto utiliza SQL Server. Verifique as configurações de conexão em `backend/src/main/resources/application.properties`.

## Security & Privacy
- **Atenção:** Jamais commite ou exponha credenciais presentes no `application.properties`.
- Siga as orientações do `global_context` sobre proteção de segredos.

## Development Lifecycle
1. **Research:** Sempre verifique o `Dev.js` para entender como o front consome a API antes de alterar o `UsuarioController`.
2. **Execution:** Ao adicionar novos campos no `model/Usuario.java`, lembre-se de atualizar o frontend correspondente.
3. **Validation:** Testes unitários do backend estão em `backend/src/test/java`.
