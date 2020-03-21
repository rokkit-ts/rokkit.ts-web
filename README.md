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

The web module of rokkit.ts is based on a the HTTP-Server framework [restify](). Rokkit.ts uses restify as an underlying HTTP-Server to register user methods on it and to be able to rely on an well tested and widely used framework.

#### Controller

The controller builds the entry point to create an endpoint for your web API. The controller annotation does two things for you.
First it marks a class as an [component](https://github.com/rokkit-ts/rokkit.ts-core) of the framework. Secondly the web module will register this class as container that provides request methods for the HTTP-Server.
The following example shows a sample controller with a simple method that returns a string on a HTTP-GET on the correct request path.
The controller here specifies the base path for all methods with the class. The method can add onto this base path or just respond to the base path.
In the shown example the method will be called when ever a HTTP-GET request hits the path `/hello/world`.

```TypeScript
import { Controller, Get } from '@rokkit.ts/web'

@Controller('/hello')
class SampleController {

  @Get('/world')
  public helloWorld () {
    return 'Hello World!'
  }
}
```

#### Http Methods

Beside the previously shows Get decorator there decorators for each HTTP method. Each of the decorators works in the same ways as it can specify an request path or just use the parent one from the controller.

Decorators:

- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD
- OPTIONS

```TypeScript
@DecoratorName(RequestPath)
```

The decorator could only be used on functions within a controller class, otherwise these are not recognized by the framework.

#### Request Attribute accessors

Next to access more data based on the request or to define the request you are able to inject different objects or attributes.
These decorators can only be used on parameters of a controller method that is also annotated with one of the previously named functions.

Parameter Decorators:

- Request -- Provides you the full request object
- Response -- Provides you the full response object
- Body -- Provides you the request body as an json obj
- RequestQueryParameter(name) -- Provides you the specified request parameter
- RequestPathParameter(name) -- Provides you the specified path parameter
- Header(name) -- Provides you the specified request header

### Querying web APIs

_Currently in development_

## Contribution

If you want to contribute to the project, please don't hesitate to send feedback, create issues or pull requests for open ones.

## License

Rokkit.ts Core is Open Source software released under the [MIT license](./LICENSE).
