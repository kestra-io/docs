<template>
    <div class="container-error">
        <div class="row g-0">
            <div class="col-md-6 p-5">
                <h6>OHHHH... 😔</h6>
                <h1>
                    {{
                        error.statusCode === 404 ?
                            "We lost that page..." :
                            "We broke that page..."
                    }}
                </h1>
                <p class="text-error">
                    {{
                        error.statusCode === 404 ?
                            "Sorry, the page you are looking for doesn’t exist or has been moved." :
                            "Sorry, an error occured."
                    }}
                </p>
                <p class="text-error">
                    Here are some helpful links:
                </p>
                <div class="container-error-small">
                    <div class="col-12">
                        <label class="visually-hidden" for="search-input">Email</label>
                        <input type="text" class="form-control" id="search-input"
                               @input="event => search(event.target.value)" placeholder="Search">
                    </div>
                    <div class="search-result mt-3" v-if="searchResults">
                        <div v-for="results in searchResults">
                            <a :href="results.slug">
                                <h5>{{ results.title }}</h5>
                                <h6>{{ results.slug }}</h6>
                            </a>
                        </div>
                    </div>
                    <div class="mt-5">
                        <NuxtLink class="text-dark" to="/docs/">
                            <p class="small-text purple-text m-0">Documentation
                                <ArrowRight/>
                            </p>
                            <p class="small-text">Dive in to learn all about our product</p>
                        </NuxtLink>
                        <hr>
                    </div>
                </div>
            </div>
            <div class="col-md-6 p-5">
                <img class="img-fluid" src="/error/error.png" alt="error"/>
            </div>
        </div>
    </div>
</template>

<script>
    import ArrowRight from "vue-material-design-icons/ArrowRight";
    import axios from "axios";

    export default {
        name: "error",
        props: ['error'],
        data() {
            return {
                searchResults: undefined
            }
        },
        components: {ArrowRight},
        methods: {
            search(query) {
                return axios.get("/api/search", {
                    params: {
                        query: query
                    }
                }).then(response => {
                    this.searchResults = response.data;

                    return response.data;
                })
            },
        },
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";

    .container-error {
        display: flex;
        height: 100%;
        justify-content: center;
        background-color: $light-cyan;
    }

    .container-error-small {
        width: 80%
    }

    .text-error {
        font-size: $font-size-lg;
        font-weight: 300;
    }

    .small-text {
        font-size: $font-size-sm;
    }

    .purple-text {
        color: $primary;
    }

    .search-result {

        h5 {
            font-size: $h6-font-size;
            margin-bottom: 0;
            color: $primary;
        }

        h6 {
            font-size: $font-size-sm;
            color: $success;
        }
    }
</style>