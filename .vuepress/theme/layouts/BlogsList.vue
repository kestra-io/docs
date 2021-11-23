<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <!-- Blog STart -->
                <section class="section">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-4 col-md-6 mb-4 pb-2"
                                 v-for="page of filteredList"
                                 :key="page.key"
                            >
                                <div class="card blog rounded border-0 shadow overflow-hidden">
                                    <div class="position-relative">
                                        <img :src="page.frontmatter.image" class="card-img-top" :alt="page.title" />
                                        <router-link :to="page.path" class="overlay rounded-top bg-dark">
                                        </router-link>
                                    </div>
                                    <div class="card-body content">
                                        <h5>
                                            <router-link
                                                :to="page.path"
                                                class="card-title title text-dark">
                                                {{ page.title }}
                                            </router-link>

                                        </h5>
                                        <div class="post-meta d-flex justify-content-between mt-3">
                                            <ul class="list-unstyled mb-0">
                                                <!--
                                                <li class="list-inline-item mr-2 mb-0"><a href="javascript:void(0)" class="text-muted like"><i class="mdi mdi-heart-outline mr-1"></i>33</a></li>
                                                <li class="list-inline-item"><a href="javascript:void(0)" class="text-muted comments"><i class="mdi mdi-comment-outline mr-1"></i>08</a></li>
                                                -->
                                            </ul>
                                            <router-link :to="page.path" class="text-muted readmore">
                                                Read More <ChevronRight title="" />
                                            </router-link>
                                        </div>
                                    </div>
                                    <div class="author">
                                        <!-- <small class="text-light user d-block"><i class="mdi mdi-account"></i> Calvin Carlo</small> -->
                                        <small class="text-light date">
                                            <CalendarCheck title="" />
                                            <time-ago
                                                :last-updated="page.frontmatter.date || page.lastUpdated"
                                                class="item-date"
                                            />
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <!--end col-->

                            <!-- PAGINATION START -->
                            <!--
                            <div class="col-12">
                                <ul class="pagination justify-content-center mb-0">
                                    <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Previous">Prev</a></li>
                                    <li class="page-item active"><a class="page-link" href="javascript:void(0)">1</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Next">Next</a></li>
                                </ul>
                            </div>
                            -->
                            <!--end col-->
                            <!-- PAGINATION END -->
                        </div>
                        <!--end row-->
                    </div>
                    <!--end container-->
                </section>
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import TimeAgo from '../components/TimeAgo';
import Breadcrumb from "../components/layout/Breadcrumb"
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import CalendarCheck from 'vue-material-design-icons/CalendarCheck'

export default {
    components: {
        Header,
        Footer,
        TimeAgo,
        Breadcrumb,
        ChevronRight,
        CalendarCheck
    },
    computed: {
        filteredList() {
            // Order by publish date, desc
            return this.$site.pages
                .filter(item => item.path.startsWith("/blogs/") && item.path !== "/blogs/")
                .sort((a, b) => {
                    return new Date(b.frontmatter.date || b.lastUpdated) - new Date(a.frontmatter.date || a.lastUpdated)
                })
        }
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>
