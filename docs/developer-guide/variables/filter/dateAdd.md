# `dateAdd`
The `dateAdd` filter add some unit and formats a date with the same behavior than [date](./date) filters.


```twig
{{ user.birthday | dateAdd(-1, 'DAYS') }}
```


## Arguments
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
- format: see [date](./date)
- existingFormat [date](./date)
- timeZone [date](./date)
- locale [date](./date)