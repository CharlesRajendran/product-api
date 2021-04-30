# Product API

## Running the Application
- Clone the repository and navigate to the project folder.
- Make sure that you have installed [Docker](https://www.docker.com/) and it is running.
- RUN `npm run launch` (it will spin up 3 containers, which are, app, redis and mysql, wait till you see **`SERVER RUNNING`** ASCII Art)
- RUN `npm test`, if all the tests are passing, then the application launched successfully. (RUN `npm install` so you will have jest to run the tests)
- Visit the application running on `http://localhost:3000`.
<br />

## API Documentation and API Testing
- Go to `http://localhost:3000/api-docs` (It will load a Swagger UI Interface with All the REST Services)
  - **Note: To test bulk insert with CSV use the `data.csv` file in the root directory**
- Go to `http://localhost:3000/graphql` (To view the GraphiQL Client and Test GraphQL Operations)
<br />

## Running The Tests
- There are sample unit and integration tests available to ensure the reliability of the code. 
- To run the tests `npm test` in the terminal.
<br />

## Issue Tracking
- **Github Projects: https://github.com/CharlesRajendran/product-api/projects/1**
<br />

### #######IMPORTANT########
- Application was initially build with **Javascript** and then migrated most part to **Typescript**
- *Remaining Migration **ToDOs***
  - Custom Type Definitions for used Datastructures
  - Test migration

## Basic Architecture and Application Flow
![Image](https://drive.google.com/uc?export=view&id=1WPPvd-GtwoqUeWaxhGjavlxcXEDWLBNB)
<br />

## Folder Structure
- **.github/** - Github Specific Folder which holds Issue Template and PR Template
- **.bin/www** - Node server file
- **config/config.js** - `sequelize-cli` migration db config file
- **migrations/** - Migration file which will run when launching and testing the application to create and populate databases;
- **src/** Source Files
  - **app.js** -> Express application with routes and middlewares
  - **controller.js** -> Generic controller file that improves reusability and interations between schema, validator and service files
  - **controller/** -> Holds the API specific controllers. Controllers connect schema, validator with services.
  - **grapghql/** -> Folder for graphql specific schema, query, mutations and typedefs.
  - **middlewares/** -> Holds custom middlewares (3rd party middlewares are, put inside app.js file)
  - **models/** -> Data/ Sequelize Models
  - **routes/** -> API/Express Routes
  - **schema/** -> Joi schema files will be here
  - **services/** -> API's actual implementation resides here. Service files are the ones that interact with DB.
  - **utilities/** -> Common reusable functions (Logging Helper, Error Helper, DB Helper, Query Helper, Response Helper and etc.)
  - **validators/** -> Validates request params with Joi schema
- **test/** 
  - **data/** -> Factory folder for tests
  - **integration/** -> For integraded testing
  - **unit/** -> For unit testing
- **.env and .env.test** => Environment variables for different environments (these are versioned for the setup simplicity here)
- **eslintrc.json** -> ES Lint custom rule preferences
- **lint-staged** -> Use to provide actions to perform on precommit, such as lint:fix, formatting and etc.
- **commitlint.config.js** -> Will force the commit message format to stick to [conventional commit standard](https://www.conventionalcommits.org/en/v1.0.0/)
- **data.csv** -> Test file for bulk insert API test to use
- **docker-compose.ym**l -> container configuration for multiple containers spawn from different images (app, redis, mysql)
- **Dockerfile** -> build configuration for our application
- **jest.config.js** -> jest configurations
- **package.json and package-lock.json** - to keep track of dependencies, git hooks and npm scripts.
<br />

## Used Tools, Libraries and Technologies
- Language: Javascript
- Runtime Environment: Node.js
- Web Framework: Express
- Database: MySQL
- ORM: Sequalize
- Migration: Sequalize-CLI and umzug (for test migration)
- Container Technology: Docker
- Logging Library: Winston
- Error Handling: Hapi/Boom
- VCS: git and github
- Git Hooks: Husky
- Commiting: Commit Lint & Cnventional Commit Standard
- Release: standard-version
- Linting: ESLint with AirBnB Style Guide
- Formatter: Prettier
- Security Libraries: HPP & Helmet
- File Uploads: Multer
- HTTP: got
- Testing: Jest & Super Test
- Cache - redis (server side cache)
- Task Runner: NPM Scripts
- Environment Variable Management: dotenv-flow
- Documentation and API Testing: Swagger JSDOC & Swagger UI Express
- GraphQL: graphql and express-graphql
 
