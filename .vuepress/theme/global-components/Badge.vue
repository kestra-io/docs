<script>

export default {
    functional: true,
    props: {
        type: {
            type: String,
            default: 'success'
        },
        text: String,
    },
    render (h, { props, slots }) {
        return h('span', {
            class: ['badge', "badge-" + props.type],
        }, props.text || slots().default)
    }
}

</script>