<template>
    <section class="section overflow-hidden">
        <Shape class="text-bg top" />

        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-title pb-2">
                        <h4 class="title mb-4 text-center" data-aos="fade-right">What customers are saying!</h4>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <img class="mb-3" src="../../assets/home/customers/lm.svg" alt="" title=""  data-aos="fade-right" />
                            </div>
                            <div class="col-12 col-md-9" >
                                <p class="text-muted mx-auto" data-aos="fade-left">
                                    <span class="text-primary mb-0 font-weight-bold">Kestra</span> allow us to develop without installation, directly on browser and start build a true business use case <strong>in few hours</strong>.
                                    Since the <strong>learning curve is easy</strong>, you can easily onboard new teammate due to its descriptive language.
                                    And moreover, it handles <strong>all the part of the data pipeline</strong>, the transport, load, transform, data modelization, data quality and monitoring of all our data pipeline.
                                    Since the tool offer <strong>strong role based access & security</strong> on the Entreprise Edition, we are safe to share ir in Software as Service to all applications allowing
                                    also to embrace the Data Mesh pattern.
                                </p>
                                <p class="text-right">
                                    <router-link
                                        to="/blogs/2022-01-10-leroy-merlin-usage-kestra"
                                        class="btn btn-primary"
                                        data-aos="zoom-in"
                                    >
                                        <FileDocumentOutline title="" /> Read the case study
                                        <ArrowRight title="" />
                                    </router-link>
                                </p>

                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div class="row justify-content-center"  data-aos="fade-left">
                <div class="col-lg-12 mt-4">
                    <Testimonial :testimonialData="testimonialData" />
                </div>
            </div>
        </div>

        <Shape class="text-white top" />
    </section>

</template>

<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import FileDocumentOutline from 'vue-material-design-icons/FileDocumentOutline'
import Shape from "../layout/Shape";
import Testimonial from "../layout/Testimonial";

export default {
    components: {
        Shape,
        ArrowRight,
        FileDocumentOutline,
        Testimonial
    },
    data() {
        return {
            testimonialData: [
                {
                    id: 1,
                    profile: require("../../assets/home/customers/alex.jpg"),
                    message: "Kestra is a product designed to facilitate the work of Ops & Data Engineers! The possibilities offered by the application are exponential thanks to the many plugins that come out regularly.\n" +
                        "Whatever the size of the organization that implements this solution, it has all the latitude to decide to keep control of its production plan or to leave sufficient autonomy to its employees to carry out their processing operations.\n" +
                        "This application is really capable of supporting the growth of the company thanks to a complete and controlled scalability!",
                    name: "Alexandre Millet-Bassez",
                    link: "https://www.linkedin.com/in/alexandre-m-618399103/",
                    designation: "Ntico",
                },
                {
                    id: 2,
                    profile: require("../../assets/home/customers/fares.jpeg"),
                    message: "It's been great. Easy to use and very powerful, It does everything I need and orchestrating flows has never been easier. It also become such an integral part of our work. Thanks to a good documentation to help quickly gain technical knowledge.",
                    name: "Fares Daoud",
                    link: "https://www.linkedin.com/in/faresdaoudofficiel/",
                    designation: "Logic@l Conseils",
                },
                {
                    id: 3,
                    profile: require("../../assets/home/customers/mourad.jpg"),
                    message: "Kestra is very easy to learn, with a large number of features covering a large number of use cases (scheduled workflows, API calls, triggers, flow synchronization, data and file transfers, etc.).\n" +
                        "The Web interface facilitates the monitoring of flows and the consultation of logs.\n" +
                        "New features are added very regularly, often in response to needs. Kestra is evolving rapidly.",
                    name: "Mourad Bouloussa",
                    link: "https://www.linkedin.com/in/mourad-bouloussa-541146191/",
                    designation: "Sopra Steria",
                },
                {
                    id: 4,
                    profile: require("../../assets/home/customers/ousama.jpg"),
                    message: "The product allows you to build almost anything you want. You can also integrate different types of data (csv, json, txt, avro) from SFTP server, google bucket, google drive, JDBC database (Postgresql, Oracle, ...). The system of task is easy to manipulate/use and offers a maximum of flexibility in the development.\n" +
                        "The tool meets the need perfectly, very simple to use, it manages all the complexity behind it to offer a huge saving in time and cost.",
                    name: "Oussama Bakkali",
                    link: "https://www.linkedin.com/in/oussama-bakkali-949708b6/",
                    designation: "Umanis",
                }
            ]
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value),
        };
    },
}
</script>
