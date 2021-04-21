# forma-core

RESTful API service to create, read, update and delete data from the web and mobile applications.

## Usage

**1.** Clone this repository using the terminal command or GitHub Desktop.
```bash
git clone https://github.com/Forma-AT/forma-core.git
```
**2.** Install the dependencies using npm
```bash
npm i
```
**3.** Get the `.env` file containing the environment variables and place it in the root directory of the project.

**4.** Start the server in development mode with TypeScript compilation and hot-reloading enabled
```bash
npm run dev
```
**5a. (optional)** Compile source code manually
```bash
npm run build
```
**5b. (optional)** Start the server in production mode
```bash
npm run prod
```
**6.** Access the API using any client (e.g. Postman) at
```bash
http://localhost:5000/api
```

## API endpoints

For an exhaustive list of all available API endpoints, authorization information, request and response parameters, as well as request and response samples view the API documentation written in OpenAPI 3 format at `api/core-api.yml`. To run a user-friendly API documentation server using `redoc-cli` run the following command:
```bash
npm run api
```
or to run the API server in watch mode (no hot-reloading)
```bash
npm run api:dev
```
and then open the documentation server in the browser at
```bash
http://localhost:8080/
```
