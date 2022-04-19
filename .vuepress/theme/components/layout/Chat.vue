<template>
    <div class="widget-chat">
        <a href="https://discord.gg/NMG39WKGth" class="btn btn-primary rounded">
            <discord title="" /> Chat <span v-if="online" class="online">{{ onlineText }} members</span>
        </a>
    </div>
</template>

<script>
import Discord from 'vue-material-design-icons/Discord'
import axios from "axios";

export default {
    components: {
        Discord
    },
    data() {
        return {
            online: undefined,
        }
    },
    mounted() {
        if (!window.sessionStorage.getItem("discord_member_count")) {
            axios.get("https://discord.com/api/v9/invites/NMG39WKGth?with_counts=true&with_expiration=true")
                .then(response => {
                    window.sessionStorage.setItem("discord_member_count", response.data.approximate_member_count)
                    window.sessionStorage.setItem("discord_online_count", response.data.approximate_presence_count)
                    this.online = response.data.approximate_member_count;
                })
        } else {
            this.online = window.sessionStorage.getItem("discord_member_count");
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
