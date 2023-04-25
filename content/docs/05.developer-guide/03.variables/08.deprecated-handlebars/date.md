---
title: Date functions
---


## `dateFormat`: Date format

```handlebars
{{dateFormat date ['format'] [format='format'][tz=timeZone|timeZoneId]}}
```


#### Arguments:
- `format`: Format parameters is one of :
  - `full`: Sunday, September 8, 2013 at 4:19:12 PM Central European Summer Time
  - `long`: September 8, 2013 at 4:19:12 PM CEST
  - `medium`: Sep 8, 2013, 4:19:12 PM
  - `short`: 9/8/13, 4:19 PM
  - `iso`: 2013-09-08T16:19:12.000000+02:00
  - `iso_sec`: 2013-09-08T16:19:12+02:00
  - `sql`: 2013-09-08 16:19:12.000000
  - `sql_seq`: 2013-09-08 16:19:12
  - `iso_date_time`: 2013-09-08T16:19:12+02:00[Europe/Paris]
  - `iso_date`: 2013-09-08+02:00
  - `iso_time`: 16:19:12+02:00
  - `iso_local_date`: 2013-09-08
  - `iso_instant`: 2013-09-08T14:19:12Z
  - `iso_local_date_time`: 2013-09-08T16:19:12
  - `iso_local_time`: 16:19:12
  - `iso_offset_time`: 16:19:12+02:00
  - `iso_ordinal_date`: 2013-251+02:00
  - `iso_week_date`: 2013-W36-7+02:00
  - `iso_zoned_date_time`: 2013-09-08T16:19:12+02:00[Europe/Paris]
  - `rfc_1123_date_time`: Sun, 8 Sep 2013 16:19:12 +0200
  - `pattern`: a date pattern.
  - Otherwise, the default formatter `iso` will be used. The format option can be specified as a parameter or hash (a.k.a named parameter).
  - You can pass the any format from [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)
- `timezeome`: with the format `Europe/Paris`

## `now`: Current date

```handlebars
   {{now ['format'] [tz=timeZone|timeZoneId]}}
```

#### Arguments:
- `format`: Same format as `dateFormat`
 - `timezone`: with the format `Europe/Paris`

## `timestamp`: Current second timestamp

```handlebars
   {{timestamp}}
```


## `nanotimestamp`: Current nano timestamp

```handlebars
   {{nanotimestamp}}
```


## `microtimestamp`: Current micro timestamp

```handlebars
   {{microtimestamp}}
```



## `dateAdd`: Add some units to date

```handlebars
   {{ dateAdd yourDate quantity "unit" [format="format"] [tz=timeZone|timeZoneId] }}
   {{ dateAdd yourDate -1 "DAYS" }}
```
- `quantity`: an integer value positive or negative
- `format`: Format parameters is one of :
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
