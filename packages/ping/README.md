# [@routes/ping](https://www.npmjs.com/package/@routes/ping)

## 🏓 out-of-the-box expressjs ping route

```js
const ping = require('@routes/ping');

app.get('/ping', ping);
```

Returns
 - status code: `200`
 - content type: `plain/text`
 - response body: `pong`
