# [@routes/npm-badge](https://www.npmjs.com/package/@routes/npm-badge)

## 🎫 Create an NPM badge

```js
const badge = require('@routes/npm-badge');

app.get('/npm-badge', badge);
```

Request
```
[GET] https://badge-service.com/npm-badge?name=@airbnb/lunar-apollo
```

Result
```
<svg version="1" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" width="270" height="18" style="background:#FFF"><path d="M0 0h42v18H0V0z" fill="#CB3737"/><path d="M5 5h8v8h-2V7H9v6H5V5zM15 5h8v8h-4v2h-4V5zM25 5h12v8h-2V7h-2v6h-2V7h-2v6h-4V5z" fill="#FFF"/><path d="M19 7h2v4h-2V7z" fill="#CB3737"/><text x="46" y="12" style="font:13px monospace">@airbnb/lunar-apollo (9⬇)</text></svg>
```
