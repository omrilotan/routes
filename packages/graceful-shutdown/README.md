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

## What just happened?
1. Process termination is interrupted
2. Open connections are reset with a new timeout to allow them to close in time
3. The server is firing a close function
4. After correct closing the process exists with exit code 0
- Correct process ends
5. After `timeout` passes - an error log is printed with the amount of connection that will be forcefully terminated
6. Process exists with an exit code 1
