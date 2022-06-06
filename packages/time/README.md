# [@routes/time](https://www.npmjs.com/package/@routes/time)

## ⏱ middleware to report route time

Accepts a callback function which will be called **after the response has ended** with the following named arguments:

| name | type | role
| - | - | -
| method | String | HTTP Request method
| route | String | Express route (including base for routers)
| status | Number | Status Code
| duration | Number | The duration of handling the request in milliseconds (in floating point nanoseconds accuracy)
| request | Request | The Request object
| response | Response | The Response object

If a no route pattern matches the request - the route will equal `*`

### Metrics example

```js
const time = require('@routes/time');

// Pass in the callback function
const measure = time(
	({
		method,
		route,
		status,
		duration,
	}) => tsbdClient.time(
		'my_service.time',
		duration, {
			method,
			route: route.replace(/\W/g, '_'),
			status,
		}
	)
);

app.use(measure);
```

Example output:

> ```
> my_service.time:76.641332|ms#method:post,route:_api_v1_users__user_id,status:200
> ```

### Log example

```js
const measure = time(
	({
		duration,
		request,
		response,
	}) => logger.info({
		request: [ request.method, request.originalUrl ].join(' '),
		user_agent: request.get('user-agent'),
		status: response.statusCode,
		service: response.get('service-name'), // custom header
		duration,
	})
);

app.use(measure);
```

Example output:

> ```
> {
>   request: 'GET /user/1234',
>   user_agent: 'Mozilla/5.0 (X11) Gecko/20100101 Firefox/101.0',
>   status: 206,
>   service: 'user-api',
>   duration: 76.641332
> }
> ```
