# `timestamp`
The `timestamp` filter will convert a date to a unix timestamps in second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](../filter/date) filter.


```twig
{{ now() | timestamp(timeZone="Europe/Paris") }}
```

## Arguments
- existingFormat
- timeZone