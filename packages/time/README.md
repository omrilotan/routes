# [@routes/time](https://www.npmjs.com/package/@routes/time)

## ⏱ middleware to report route time

Accepts a callback function which will be called **after the response has ended** with the following named arguments:

| name | type | role
| - | - | -
| method | String | HTTP Request method
| route | String | Express route (including base for routers)
| status | Number | Status Code
| duration | Number | The duration of handling the request in milliseconds (in floating point nanoseconds accuracy)

If a no route pattern matches the request - the route will equal `*`

```js
const time = require('@routes/time');

// Pass in the callback function
const measure = time(
	({
		method,
		route,
		status,
		duration,
	}) => statsdClient.time('my_service.time', duration, {
		method,
		route: route.replace(/\W/g, '_'),
		status,
	})
);

app.use(measure);
```

Example output:

> ```
> my_service.time:76.641332|ms#method:post,route:_api_v1_users__user_id,status:200
> ```
