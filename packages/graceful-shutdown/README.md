# @routes/graceful-shutdown <a href="https://www.npmjs.com/package/@routes/graceful-shutdown"><img src="https://img.shields.io/npm/v/@routes/graceful-shutdown.svg"></a> [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/routes/tree/master/packages/graceful-shutdown)

## 💀 Shut down gracefully

```js
const graceful = require('@routes/graceful-shutdown');

const server = app.listen(1337);
graceful(server, {});
```

### Arguments
- First argument is an Express Server instance (`server`)
- Second argument is options:

| option | type | meaning | default
| - | - | - | -
| `timeout` | Number | Time (in milliseconds) to wait before forcefully shutting down | `10000` (10 sec)
| `logger` | Object | Logger object with `info` and `error` function (supports async loggers) | `console`
