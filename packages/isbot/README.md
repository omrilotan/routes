# [@routes/isbot](https://www.npmjs.com/package/@routes/isbot)

## 🕷 Express middleware to detect crawler requests: request.isbot

The middleware adds a getter to the request: `isbot`.

- ✅ Lazy processing: performs the check only if it's actually used
- ✅ Memoisation: Operation result is cached
- ✅ Quick and Simple: Only check if it's a known crawler, does not parse the user agent string to a complex object
- ✅ Customisable bot list

```js
const isbot = require('@routes/isbot');

app.use(isbot);

app.get('/api', (request, response) => {
	if (request.isbot) {
		// do things
	}
	...

	response.sendStatus(200);
});
```

## Customisation
All customisation options from [isbot](https://www.npmjs.com/package/isbot) package are also available here

```js
isbot.exclude(['bot']);
isbot.extend(['(?<! cu)bot']);
```
