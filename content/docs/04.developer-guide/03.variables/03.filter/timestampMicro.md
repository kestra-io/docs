---
title: timestampMicro
---

The `timestampMicro` filter will convert a date to a unix timestamps in microsecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](./date.md) filter.


```twig
{{ now() | timestampMicro(timeZone="Europe/Paris") }}
```

## Arguments
- existingFormat
- timeZone