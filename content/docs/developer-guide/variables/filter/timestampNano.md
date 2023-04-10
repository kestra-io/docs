# `timestampNano`
The `timestampNano` filter will convert a date to a unix timestamps in nanosecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](../filter/date) filter.


```twig
{{ now() | timestampNano(timeZone="Europe/Paris") }}
```

## Arguments
- existingFormat
- timeZone