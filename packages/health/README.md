# @routes/health <a href="https://www.npmjs.com/package/@routes/health"><img src="https://img.shields.io/npm/v/@routes/health.svg"></a> [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/routes/tree/master/packages/index)

## 💪 health check route

Pass in a method checking application and/or machine health. If any error occur - the function should throw an error if anything is wrong.

If anything is wrong - the route will return error code (503) and exit the process with code 0 (`process.exit(0)`)

#### Expose a health route with health check
```js
const health = require('@routes/health');

function healthCheck() {
	if (!db.serverConfig.isConnected()) {
		throw new Error('Database not connected');
	}
}

app.get('/ping', ...);
app.get('/health', health(healthCheck));
...

```

### Arguments

- 1st argument is a function of health check. Should throw an error if anything is wrong. This function can be asynchronous.
- 2nd argument is an options object:

| Name | Type | Default | Meaning
| - | - | -
| timeout | Number | 10,000 | The number of milliseconds to wait between test fail and process.exit action
| logger | Object | console | A logger object containing `error` function that can accept an Error object

#### Example with all options
```js
app.get(
	'/health',
	health(
		healthCheck,
		{
			timeout: 4000,
			logger: { error: (error) => send(error) },
		}
	)
);
```
