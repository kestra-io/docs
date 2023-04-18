<template>
    <div class="container">
        <Section
            title="Meet the team"
            subtitle="The Backbone of Kestra"
        >
            <div class="row">
                <div class="col-md-3">
                    <img src="/landing/company/emmanuel.png" width="248" alt="Emmanuel Darras Picture"/>
                    <div>
                        <div class="team-name">Emmanuel Darras</div>
                        <div class="team-title font-small">CEO</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/emmanuel-darras/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/ludovic.png" width="248" alt="Ludovic Dehon Picture"/>
                    <div>
                        <div class="team-name">Ludovic Dehon</div>
                        <div class="team-title font-small">CTO</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/ludovic-dehon/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/tchiotludo" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                        <a href="https://twitter.com/tchiotludo" target="_blank" class="me-2"><img src="/landing/company/twitter.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/quentin.png" width="248" alt="Quentin Sinig Picture"/>
                    <div>
                        <div class="team-name">Quentin Sinig</div>
                        <div class="team-title font-small">VP Go-to-Market</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/quentinsinig/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/quentin-js" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/martin-pierre.png" width="248" alt="Martin Roset Picture"/>
                    <div>
                        <div class="team-name">Martin-Pierre Roset</div>
                        <div class="team-title font-small">Lead Growth & Marketing</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/martin-pierre-roset/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://twitter.com/martin_roset" target="_blank" class="me-2"><img src="/landing/company/twitter.png" /></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <img src="/landing/company/loic.png" width="248" alt="Loïc Mathieu Picture"/>
                    <div>
                        <div class="team-name">Loïc Mathieu</div>
                        <div class="team-title font-small">Lead Software Engineer</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/lo%C3%AFc-mathieu-475b144/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/loicmathieu" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                        <a href="https://twitter.com/loicmathieu" target="_blank" class="me-2"><img src="/landing/company/twitter.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/nicolas.png" width="248" alt="Nicolas Callens Picture"/>
                    <div>
                        <div class="team-name">Nicolas Callens</div>
                        <div class="team-title font-small">Lead product designer</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/todobai/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/Nico-Kestra" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/yann.png" width="248" alt="Yann Coornaert Picture"/>
                    <div>
                        <div class="team-name">Yann Coornaert</div>
                        <div class="team-title font-small">Software Engineer</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/yannc/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/Skraye" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <img src="/landing/company/benoit.png" width="248" alt="Benoît Pimpaud Picture"/>
                    <div>
                        <div class="team-name">Benoît Pimpaud</div>
                        <div class="team-title font-small">Product Owner & Data Engineer</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/pimpaudben/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/ben8t" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                        <a href="https://twitter.com/Ben8t" target="_blank" class="me-2"><img src="/landing/company/twitter.png" /></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <img src="/landing/company/brian.png" width="248" alt="Brian Mullier Picture"/>
                    <div>
                        <div class="team-name">Brian Mullier</div>
                        <div class="team-title font-small">Software Engineer</div>
                    </div>
                    <div>
                        <a href="https://www.linkedin.com/in/brian-mulier-326869150/" target="_blank" class="me-2"><img src="/landing/company/linkedin.png" /></a>
                        <a href="https://github.com/brian-mulier-p" target="_blank" class="me-2"><img src="/landing/company/github.png" /></a>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        .row {
            padding-bottom: calc($spacer * 2);
        }
    }

    .team-name {
        font-weight: bold;
        margin-bottom: -5px;
    }

    .team-title {
        font-size: 0.8rem;
        color:#49506D;
    }
</style>