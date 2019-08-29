# [safe-set-header](https://www.npmjs.com/package/safe-set-header)

## 🤯 make ServerResponse.setHeader idempotent for HttpServer

```js
require('safe-set-header')();
```

Will not try to set headers after they were sent. For example, if a middleware has already sent relevant response headers

Example of errors that should not happen:
- `ERR_HTTP2_HEADERS_AFTER_RESPOND` (Cannot specify additional headers after response initiated)
- `ERR_HTTP_HEADERS_SENT` (Cannot set headers after they are sent to the client)

## log cases where this happens
[_optional_] Pass in a log function. The log function will be called with an error object

```js
require('safe-set-header')({log: console.log});
```
