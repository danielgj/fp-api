You can check [Code Coverage](https://danielgj.github.io/fp-api/) here.

## Description

A REST API for a custom service developed with [Node.js](http://nodejs.org) and [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This API relies on a PostgreSQL database. There is a docker-compose configuration that enables the cloud deployment of the entire API solution and also runing locally the DB for development purposes.
With docker installed on your computer, to launch the DB you can just run the following command:

```bash
# Launch DB on docker image
$ docker compose up -d
```

### .env file
For security and obvious reasons, the config file has not been uploaded to this repo. To properly run the API and enable the connection to the DB, you need to manually create a **.env** file with the following entries with your custom values:
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USERNAME
- DB_PASSWORD
- SALT_ROUNDS
- JWT_SECRET
- JWT_EXPIRES_IN

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Stay in touch

- Author - [Daniel García](https://danielgarciajones.web.app)
- Twitter - [@danielgarjones](https://twitter.com/danielgarjones)

