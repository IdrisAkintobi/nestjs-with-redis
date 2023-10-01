# NestJS with Redis

## Description

This is a simple Node.js application that uses the [NestJS](https://nestjs.com/) framework to create a REST API for a simple server. The application uses [ioredis](https://github.com/luin/ioredis#readme) to connect to a Redis database. The redis database is used for caching and to persist shot lived data i.e token. The application uses [Jest](https://jestjs.io/) for unit testing.

## Requirements

-   [Node.js](https://nodejs.org/en/) v18.0.0 or higher
-   [Yarn](https://yarnpkg.com/) v1.22.0 or higher
-   [Redis](https://redis.io/) v6.2.4 or higher

## Environment Variables

```bash
# Redis Host
REDIS_HOST=
# Redis Port
REDIS_PORT=
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Code Structure

```bash
src
├── app.module.ts
├── controller
│   ├── app.controller.ts
│   ├── dto
│   │   ├── password-reset-token-request.dto.ts
│   │   ├── password-update-request.dto.ts
│   │   └── product.request.dto.ts
│   ├── password-reset.controller.ts
│   └── product.controller.ts
├── domain
│   ├── enum
│   │   └── redis-prefix-enum.ts
│   └── interface
│       ├── product.interface.ts
│       ├── redis.repository.interface.ts
│       └── reset.token.interface.ts
├── infrastructure
│   └── redis
│       ├── redis.client.factory.ts
│       ├── redis.module.ts
│       └── repository
│           └── redis.repository.ts
├── main.ts
└── service
    ├── app.service.ts
    ├── password-reset.service.ts
    ├── product.service.ts
    └── redis.service.ts
```

## License

[MIT licensed](LICENSE.txt)
