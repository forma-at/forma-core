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

**3.** Create a file in the project root directory named `.env` and place the following content in it. Make sure to replace these placeholder values with the actual secrets and connection details you wish to use. The recommended JWT secret is an at least 20 characters long random generated string.
```dotenv
PORT=5000
MONGODB_HOST="localhost"
MONGODB_PORT=27017
MONGODB_POOLSIZE=20
MONGODB_NAME="forma"
JWT_SECRET=""
```

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

For an exhaustive list of all available API endpoints, authorization information, request and response parameters, as well as request and response samples view the API documentation written in OpenAPI 3 format at `docs/core-api.yaml`. To run a user-friendly API documentation server using `redoc-cli` run the following command:
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

## Generate mock data

When testing the API endpoints or the front-end UI it can come in handy to have test users ready, and manual creation can be tedious. The following command will generate 15 school and 15 teacher accounts, all fully configured and set up. None of the users will have memberships or classes by default.
```bash
npm run gen-mock-data
```
Keep in mind that this should only be run once, otherwise you might end up with duplicate users. To customize the mock data before running the command you can edit the files under `scripts/mock`. The generated users will have the following format by default:
|Type|Email|Password|
|--|--|--|
|school|school1@forma.fi|Testing123|
|school|school2@forma.fi|Testing123|
|...|...|...|
|school|school14@forma.fi|Testing123|
|school|school15@forma.fi|Testing123|
|teacher|teacher1@forma.fi|Testing123|
|teacher|teacher2@forma.fi|Testing123|
|...|...|...|
|teacher|teacher14@forma.fi|Testing123|
|teacher|teacher15@forma.fi|Testing123|
