import * as _dayjs from 'dayjs';

import RelativeTime from "dayjs/plugin/relativeTime.js";
import UpdateLocale from "dayjs/plugin/updateLocale.js";

let dayjs = _dayjs;

dayjs = dayjs.extend(RelativeTime);
dayjs = dayjs.extend(UpdateLocale)

dayjs.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'A few seconds',
        m: "1 minute",
        mm: "%d minutes",
        h: "1 hour",
        hh: "%d hours",
        d: "1 day",
        dd: "%d days",
        M: "1 month",
        MM: "%d months",
        y: "1 year",
        yy: "%d years"
    }
})

export function timesAgo(date) {;
    return dayjs(date).fromNow();
}