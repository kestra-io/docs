<template>
    <time
        :datetime="lastUpdated"
        :title="lastUpdated"
        pubdate="pubdate"
    >
        {{ lastUpdated | timeago() }}
    </time>
</template>

<script>
    import { format } from 'timeago.js';
    export default {
        filters: {
            timeago: (str) => {
                return format(new Date(str), 'en_US')
            },
            formatDate: date => {
                return new Date(date).toLocaleString()
            }
        },
        props: {
            lastUpdated: {
                type: [ String, Date, Number ],
                required: true
            },
        },
    }
</script>
