<template>
    <div class="widget-chat">
        <a href="https://join.slack.com/t/kestra-io/shared_invite/zt-193shv281-rK9QOEfZC2_vEbDO7Uxtbw" class="btn btn-primary rounded">
            <slack title="" /> Chat <span v-if="online" class="online">{{ onlineText }} members</span>
        </a>
    </div>
</template>

<script>
import Slack from 'vue-material-design-icons/Slack'
import axios from "axios";

export default {
    components: {
        Slack
    },
    data() {
        return {
            online: undefined,
        }
    },
    mounted() {
        if (!window.sessionStorage.getItem("slack_member_count")) {
            axios.get("https://api.kestra.io/v1/communities/slack")
                .then(response => {
                    window.sessionStorage.setItem("slack_member_count", response.data.total)
                    this.online = response.data.total;
                })
        } else {
            this.online = window.sessionStorage.getItem("slack_member_count");
        }
    },

    computed: {
        onlineText() {
            return this.online === undefined ? "" : Intl.NumberFormat('en-US').format(this.online);
        }
    }
}
</script>

<style lang="scss" scoped>
@import ".vuepress/theme/styles/variables";
.widget-chat {
    position: fixed;
    z-index: 9999;
    bottom: 10px;
    right: 10px;

    span.online {
        font-weight: normal;
        font-size: $font-size-sm;
    }

    .btn-primary {
        background: #404eed !important;
        border-color: darken(#404eed, 5%) !important;
    }
}
</style>
