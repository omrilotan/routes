# 2.1.0
## 2022-06-06
- Replace "request.end" monkey-patch with on "finish" listener
- Fix double slashes on router routes
- Add "request" and "response" to measurement arguments

# 2.0.3
## 2021-10-13
Default to "*" if route is not defined

# 2.0.2
## 2020-10-13
Support route set as array

# 2.0.1
## 2019-08-25
Convert Bigint to number only after calculation


# 2.0.0
## 2019-05-20
If a no route pattern matches the request - the route will equal `*`
