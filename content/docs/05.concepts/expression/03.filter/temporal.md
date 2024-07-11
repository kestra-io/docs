---
title: Temporal Filters
icon: /docs/icons/expression.svg
---

Temporals filters are used to format dates and timestamps.

- [date](#date)
- [dateAdd](#dateadd)
- [timestamp](#timestamp)
- [timestampMicro](#timestampmicro)
- [timestampNano](#timestampnano)

## date

The `date` filter formats a date in a variety of formats. It can handle `java.util.Date`,
Java 8 `java.time` constructs like `OffsetDateTime` and timestamps in milliseconds from the epoch.
The filter will construct a `java.text.SimpleDateFormat` or `java.time.format.DateTimeFormatter` using the provided
pattern and then use this newly created format to format the provided date object. If you don't provide a pattern,
either `DateTimeFormatter.ISO_DATE_TIME` or `yyyy-MM-dd'T'HH:mm:ssZ` will be used.

```twig
{{ user.birthday | date("yyyy-MM-dd") }}
```

An alternative way to use this filter is to use it on a string but then provide two arguments:
the first is the desired pattern for the output, and the second is the existing format used to parse the
input string into a `java.util.Date` object.

```twig
{{ "July 24, 2001" | date("yyyy-MM-dd", existingFormat="MMMM dd, yyyy") }}
```

The above example will output the following:
```twig
2001-07-24
```

**Time zones**

If the provided date has time zone info (e.g. `OffsetDateTime`) then it will be used. If the provided date has no
time zone info, by default the system time zone will be used. If you need to use a specific
time zone then you can pass in a `timeZone` parameter any string that's understood by `ZoneId` / `ZoneInfo`:
```twig
{# the timeZone parameter will be ignored #}
{{ someOffsetDateTime | date("yyyy-MM-dd'T'HH:mm:ssX", timeZone="UTC") }}
{# the provided time zone will override the system default #}
{{ someInstant | date("yyyy-MM-dd'T'HH:mm:ssX", timeZone="Pacific/Funafuti") }}
```

**format & existingFormat**

Format can be:
- [DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) format
- `iso` = `yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX`
- `iso_sec` = `yyyy-MM-dd'T'HH:mm:ssXXX`
- `sql` = `yyyy-MM-dd HH:mm:ss.SSSSSS`
- `sql_seq` = `yyyy-MM-dd HH:mm:ss`
- `iso_date_time`
- `iso_date`
- `iso_time`
- `iso_local_date`
- `iso_instant`
- `iso_local_date_time`
- `iso_local_time`
- `iso_offset_time`
- `iso_ordinal_date`
- `iso_week_date`
- `iso_zoned_date_time`
- `rfc_1123_date_time`

**Arguments**
- `format`: the output format
- `existingFormat`: the input format if the based variable is a string
- `timeZone`:  the timezone to use
- `locale`: the locale to use

## dateAdd

The `dateAdd` filter adds a unit and formats a date with the same behavior as [date](#date) filters.

```twig
{{ user.birthday | dateAdd(-1, 'DAYS') }}
```

**Arguments**
- amount: an integer value positive or negative
- unit:
  - `NANOS`
  - `MICROS`
  - `MILLIS`
  - `SECONDS`
  - `MINUTES`
  - `HOURS`
  - `HALF_DAYS`
  - `DAYS`
  - `WEEKS`
  - `MONTHS`
  - `YEARS`
  - `DECADES`
  - `CENTURIES`
  - `MILLENNIA`
  - `ERAS`
- format: see [date](#date)
- existingFormat [date](#date)
- timeZone [date](#date)
- locale [date](#date)


## timestamp

The `timestamp` filter will convert a date to a unix timestamps in second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.


```twig
{{ now() | timestamp(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone


## timestampMicro

The `timestampMicro` filter will convert a date to a unix timestamps in microsecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.


```twig
{{ now() | timestampMicro(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone

## timestampNano

The `timestampNano` filter will convert a date to a unix timestamps in nanosecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.

```twig
{{ now() | timestampNano(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone

# Temporal Filters in action

Let us create a sample flow to understand the temporal filters.

```yaml
id: temporal-dates
namespace: company.myteam

tasks:
  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message:
      - "Present timestamp: {{ now() }}"
      - "Formatted timestamp: {{ now() | date('yyyy-MM-dd') }}"
      - "Previous day: {{ now() | dateAdd(-1, 'DAYS') }}"
      - "Next day: {{ now() | dateAdd(1, 'DAYS') }}"
      - "Different timezone: {{ now() | timestamp(timeZone='Asia/Kolkata') }}"
      - "Different timezone (in macro): {{ now() | timestampMicro(timeZone='Asia/Kolkata') }}"
      - "Different timezone (in nano): {{ now() | timestampNano(timeZone='Asia/Kolkata') }}"
```

The logs of this flow will be:

```
Present timestamp: 2024-07-09T06:17:01.171193Z
Formatted timestamp: 2024-07-09
Previous day: 2024-07-08T06:17:01.174686Z
Next day: 2024-07-10T06:17:01.176138Z
Different timezone: 1720505821
Different timezone (in macro): 1720505821000180275
Different timezone (in nano): 1720505821182413000
```
