<template>
    <div class="card shadow-lg mb-3">
        <div class="card-body">
            <p>
                {{ item.message }}
            </p>
            <div class="footer">
                <img :src="item.profile"  width="50" alt="" />
                <span>
                    <a :href="item.link">{{ item.name }}</a><br />
                    {{ item.designation }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object
            }
        }
    }
</script>
