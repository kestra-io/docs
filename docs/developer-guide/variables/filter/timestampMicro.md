# `timestampMicro`
The `timestampMicro` filter will convert a date to an unix timestamps in micro second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](../filter/date) filter.


```twig
{{ date | timestampMicro(timeZone="Europe/Paris" }}
```

## Arguments
- existingFormat
- timeZone