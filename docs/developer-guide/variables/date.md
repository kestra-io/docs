# Date functions

[[toc]]


## `dateFormat`: Date format

```handlebars
{{dateFormat date [`format`] [format=`format`][tz=timeZone|timeZoneId]}}
```


#### Arguments: 
 - `format`: Format parameters is one of:
    - `full`: full date format. For example: Tuesday, June 19, 2012
    - `long`: long date format. For example: June 19, 2012
    - `medium`: medium date format. For example: Jun 19, 2012
    - `short`: short date format. For example: 6/19/12
    - `pattern`: a date pattern.
    - Otherwise, the default formatter will be used. The format option can be specified as a parameter or hash (a.k.a named parameter).


## `now`: Current date

```handlebars
   {{now [`format`] [tz=timeZone|timeZoneId]}}
```

#### Arguments: 
- `format`: Format parameters is one of:    
    - `full`: full date format. For example: Tuesday, June 19, 2012
    - `long`: long date format. For example: June 19, 2012
    - `medium`: medium date format. For example: Jun 19, 2012
    - `short`: short date format. For example: 6/19/12
    - `pattern`: a date pattern.
    - Otherwise, the default formatter will be used.
