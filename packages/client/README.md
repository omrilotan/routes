# @routes/client <a href="https://www.npmjs.com/package/@routes/client"><img src="https://img.shields.io/npm/v/@routes/client.svg"></a> [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/routes/tree/master/packages/client)

## 💁‍♂️ Display information about the client making the request

Use the query string to request for specific keys

| GET /info?hostname&url&query&headers.accept&headers.user-agent
| -
| ![](https://user-images.githubusercontent.com/516342/57586025-22703080-74f8-11e9-9be6-28d7e22a2f9e.png)

Available keys to get are
- `body`
- `cookies`
- `signedCookies`
- `params`
- `query`
- `originalUrl`
- `baseUrl`
- `url`
- `protocol`
- `secure`
- `ip`
- `ips`
- `subdomains`
- `path`
- `hostname`
- `fresh`
- `stale`
- `xhr`
- `headers.*`

The `headers` sub keys have been fattened (`headers.x`) and may be acquired by asking for `headers`, `headers.*` or specifically: `headers.user-agent` and so forth.
