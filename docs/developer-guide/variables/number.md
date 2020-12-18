---
order: 3
---

# Number functions

[[toc]]

## `numberFormat`: Format a number
```handlebars
   {{numberFormat number ["format"] [locale=default]}}
```

Arguments: 
 - `format`: Format parameters is one of:
    - "integer": the integer number format
    - "percent": the percent number format
    - "currency": the decimal number format
    - "pattern": a decimal pattern.
    - Otherwise, the default formatter will be used.

More options:

- groupingUsed: Set whether or not grouping will be used in this format.
- maximumFractionDigits: Sets the maximum number of digits allowed in the fraction portion of
a number.
- maximumIntegerDigits: Sets the maximum number of digits allowed in the integer portion of a
number
- minimumFractionDigits: Sets the minimum number of digits allowed in the fraction portion of
a number
- minimumIntegerDigits: Sets the minimum number of digits allowed in the integer portion of a
number.
- parseIntegerOnly: Sets whether or not numbers should be parsed as integers only.
- roundingMode: Sets the {@link java.math.RoundingMode} used in this NumberFormat.
