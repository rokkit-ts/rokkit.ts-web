# [Rokkit.ts Web](https://rokkit.dev)

![GitHub](https://img.shields.io/github/license/rokkit-ts/rokkit.ts-web)
![npm (scoped)](https://img.shields.io/npm/v/@rokkit.ts/web)
[![Build Status](https://travis-ci.com/rokkit-ts/rokkit.ts-web.svg?branch=master)](https://travis-ci.com/rokkit-ts/rokkit.ts-web)

Rokkit.ts a microservice framework build in TypeScript for Node.js.
It focuses on a modular component system, developer exerience and good designed APIs to build any application without making restrictions.  
Rokkit.ts tries to be adaptable for all needs.
If you want to know more about the framework check out our [Website](https://rokkit.dev/).  
The Framework is still in an early phase but allready provides functionality to build basic applications.

This is the web module of Rokkit.ts. This module provides the ability to easily build and query web API's.
This module is meant to be used with the [Rokkit.ts-Core](https://github.com/rokkit-ts/rokkit.ts-core), there is a way to use the module on its own but only with additional effort that is not needed when using the core-module.

## Install

Install rokkit.ts-web as an npm package:

```bash
npm install @rokkit.ts/web
```

### [Getting Started](https://rokkit.dev/#getting-started)

In order to start your first project check out the [Getting Started](https://rokkit.dev/#getting-started) section on our website and try out our cli to create your first project. For a detailed example have a look at our [sample application repository](https://github.com/rokkit-ts/sample-application).

## API

The web modules' functionallities can be devided into two major categories:

- Building web APIs
- Querying web APIs

Both are explained in the following.
_Disclaimer_ The current version of the web module only support the first part of the planned functionality.

### Building web APIs

#### Controller

#### Http Methods

- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD
- OPTIONS

#### Request Attribute accessors

- Body
- RequestParameter
- PathParameter
- Header
- Request
- Response

### Querying web APIs

_Currently in development_

## Contribution

If you want to contribute to the project, please don't hesitate to send feedback, create issues or pull requests for open ones.

## License

Rokkit.ts Core is Open Source software released under the [MIT license](./LICENSE).
