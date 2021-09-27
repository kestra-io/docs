# `timestamp`
The `timestamp` filter will convert a date to an unix timestamps in second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](../filter/date) filter.


```twig
{{ date | timstamp(timeZone="Europe/Paris" }}
```

## Arguments
- existingFormat
- timeZone