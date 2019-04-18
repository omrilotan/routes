# @routes/index <a href="https://www.npmjs.com/package/@routes/index"><img src="https://img.shields.io/npm/v/@routes/index.svg"></a> [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/routes/tree/master/packages/index)

## 📇 An index of routes exposed by Express app

![](https://user-images.githubusercontent.com/516342/56301442-bafcd600-612f-11e9-9676-6b46cdb610d7.png)

```
const app = express();
const index = require('@routes/index');

...

const filter = (method, path) => {
	if (/patch/i.test(method)) { return false; }
	if (path.endsWith('ping')) { return false; }
	return true;
};
index(app, filter);
```

## Arguments and options

- First argument is an Expressjs app instance.
- Second, optional, argument is a named options object. All options are optional

| Name | Type | Meaning
| - | - | -
| filter | {Function} | Filter routes by method or path
| should | {Function} | For 'route' method, should it display the 404 list page or simply call next middleware

`filter` method accepts two arguments: method (lowercase), and path - respectfully (e.g. :`'get', '/users/:user_id'`)
```js
const filter = (method, path) => path.starsWith('/api');
```

`should` method accepts two arguments: request and response - the express middleware arguments
```js
const should = (request, response) => request.path.startsWith('/api');
```

## Usage

#### Example express app setup
> ```
> const express = require('express');
>
> const app = express();
> app.get('/ping', ...);
> app.get('/users/:user_id', ...);
> app.patch('/users/:user_id', ...);
> app.delete('/users/:user_id', ...);
> app.get('/users', ...);
> app.post('/users', ...);
> ```

#### Get an index of all available routes
```js
const index = require('@routes/index');

index(app);
```

| Example
| -
| ![](https://user-images.githubusercontent.com/516342/56299759-93583e80-612c-11e9-8136-7f6bf66c4cac.png)

#### Get a flat list of routes (no methods) (* de-duped)
```js
const {flat} = index(app);

flat // ['/users', '/users/:user_id']
```

#### Show API consumers an index for 404 message
```js
const {route} = index(
	app,

	// filter paths from the list
	{
		filter: (method, path) => !['/ping', '*'].includes(path),
		should: (request, response) => !request.is('html'),
	}
);
app.all('*', route);
```

| Example
| -
| ![](https://user-images.githubusercontent.com/516342/56300498-fc8c8180-612d-11e9-96e5-51eb3fa1d7a8.png)

Result
```sh
< HTTP/1.1 404 Not Found
< Content-Type: text/plain; charset=utf-8
< Content-Length: 290
< Date: Wed, 17 Apr 2019 21:19:32 GMT
< Connection: keep-alive
<
{ [290 bytes data]
404 error - Could not find route [GET] /missing
Here is a index of available routes:
- [GET] /users
- [POST] /users
- [GET] /users/:user_id
- [PATCH] /users/:user_id
- [DELETE] /users/:user_id
```
