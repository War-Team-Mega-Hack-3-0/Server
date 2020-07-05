# Mega Hack 3.0 - Server

Backend repo of the Server solution of Team War.

## Technologies

#### Serverless Framework

- DocumentDB
- Lambda
- VPC

#### HTTP Framework

- Express + serverless-http
  - Middleware/Pipes and Filters based

#### Testing

- Jest
- Mongo Memory Server + MongoDB on Localhost

## Project Architecture

The architecture of this project is simple, and its based on the handler functions and its rules. Each `handler` (or Lambda Function handler) handles a context of requests and routes.

```Bash
.
├── README.md
├── __tests__
│   ├── error-handler.test.js
│   └── functions
│       ├── example.test.js
│       └── ...
├── package-lock.json
├── package.json
├── serverless.yml
└── src
    ├── app.js
    ├── handler.js
    ├── handlers
    │   ├── example.js
    │   └── ...
    └── middlewares
        ├── middleware-example.js
        └── ...
```

Each `handler` has a collection of routes that are configured with the `Express` module, and wrapped with the `serverless-http` to be delivered by the Lambda. This creates a more friendly and organized development environment.

## Mocking the responses

Due to the _lack of a sandbox environment_, we needed to mock the returns of the values for the dashboard to be shown up based on a _generic dataset_. The integration part is ready based on the developer documentation of VTEX, but the integrations could not be tested properly.

## Running it Locally

Just run the `local` script on the `package.json`

It will connect to a localhost `MongoDB` database named `dev` by default if its running offline.

```
npm run local
```

## Testing

It has two options of scripts: the `test` and `test:silent`

```
npm run test

// or

npm run test:silent // this will run without logging debug logs to the console
```
