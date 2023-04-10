
# `base64encode`
The `base64encode` filter takes the given input, converts it to an UTF-8 String (`.toString()`) and Base64-encodes it.

```twig
{{ "test" | base64encode }}
```
The above example will output the following:
```
dGVzdA==
```
