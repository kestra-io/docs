# `timestampNano`
The `timestampNano` filter will convert a date to an unix timestamps in nano second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](../filter/date) filter.


```twig
{{ date | timestampNano(timeZone="Europe/Paris" }}
```

## Arguments
- existingFormat
- timeZone