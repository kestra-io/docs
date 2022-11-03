<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import FeatureSearch from "vue-material-design-icons/FeatureSearch"

export default {
    components: {ArrowRight, FeatureSearch},
};
</script>

<template>
    <div>
        <h2>⭐ What you get:</h2>
        <ul class="advantage">
            <li><span>👶</span> Join an early startup and become a prominent member of the company</li>
            <li><span>💲</span> Market-competitive salary</li>
            <li><span>✈</span> Minimum of 25 PTO</li>
            <li><span>🌍</span> Work from home anywhere</li>
            <li><span>🕰</span> Flexible Hours & Days</li>
            <li><span>🖥</span> Budget to choose own hardware and office set-up</li>
            <li><span>📖</span> A transparent, collaborative & inclusive culture</li>
            <li><span>💗</span> Endless growth opportunities</li>
            <li>And more!</li>
        </ul>

        <div class="col-12 mt-4 pt-4 text-center">
            <a
                :href="'mailto:jobs@kestra.io?subject=[jobs] ' + $page.title"
                class="btn btn-primary"
            >
                <FeatureSearch title="" /> Apply for this job
                <ArrowRight title="" />
            </a>
        </div>
    </div>
</template>


<style lang="scss" scoped>

@import '../../styles/variables';


.advantage li span {
    display: inline-block;
    width: 30px;
    text-align: center;
}

</style>
