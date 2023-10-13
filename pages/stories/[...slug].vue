<template>
    <div class="main">

        <StoriesList v-if="slug === '/stories/'" :stories="stories" :icons="icons" />

        <div v-else>
            <StoriesHeader :slug="slug" :name="name" :title="title" />
            <div class="container">
                <div class="mt-5">
                    <h1>Introduction</h1>
                    <p>Displayce, a subsidiary of JCDecaux, serves as the intermediary between JCDecaux, agencies, and advertisers. Their role is critical in advising clients on optimal assets and marketing campaigns. Faced with the challenge of scaling their data operations and lacking a unified system for monitoring and orchestration, Displayce sought a robust solution to streamline their processes. Their search led them to Kestra.</p>
                </div>
                <div class="mt-5">
                    <h1>Technology Stack</h1>
                    <p>Displayce employs a multifaceted technology stack, each component serving a distinct purpose, yet all integrated to function as a cohesive unit.</p>
                    <ul>
                        <li><h6 class="d-inline">AWS S3:</h6> Utilized as the primary data lake, AWS S3 stores raw and processed data, acting as the foundation for all data operations.</li>
                        <li><h6 class="d-inline">AWS Athena:</h6> Athena is employed for ad-hoc querying and analysis. It enables Displayce to pull insights directly from their S3 data lake without requiring a separate data warehouse.</li>
                        <li><h6 class="d-inline">Clickhouse:</h6> This columnar database serves as their analytical data store, optimized for query performance. It allows them to run complex analytics queries quickly and efficiently.</li>
                        <li><h6 class="d-inline">PostgreSQL:</h6> Used for transactional data and to maintain relational data structures, PostgreSQL supports application-level data requirements.</li>
                        <li><h6 class="d-inline">dbt:</h6> As their transformation engine, dbt is employed to clean, enrich, and prepare data for analytics. It provides a robust layer of transformation logic that feeds into Clickhouse.</li>
                        <li><h6 class="d-inline">Kestra:</h6> Kestra comes in as the orchestrator, ensuring seamless data flow between these components. It manages workflow dependencies, error handling, and scheduling, thus providing the robust backbone needed for their operations.</li>
                    </ul>
                </div>
                <div class="mt-5">
                    <h1>The Challenge</h1>
                    <p>Displayce faced several significant hurdles in their journey:</p>
                    <ul>
                        <li>Scalability: They began with CLI-based tools for data ingestion, which proved unscalable as their operations grew.</li>
                        <li>Monitoring and Orchestration: The absence of a centralized system for monitoring and orchestration was glaring.</li>
                        <li>Migration: Adding to the complexity was their ongoing migration from DigDag (a Java-based scheduler) and Nomad (a container orchestration platform).</li>
                    </ul>
                </div>
                <div class="mt-5">
                    <h1>Why Kestra?</h1>
                    <p>After rigorous evaluation, Displayce chose Kestra for several compelling reasons:</p>
                    <ul>
                        <li>Robust Plugin Ecosystem: Kestra's rich suite of plugins facilitated easy integrations with AWS S3, Athena, and Clickhouse.</li>
                        <li>Transformation: Leveraging dbt, they created a reliable data transformation layer that could feed refined data into Clickhouse for analytics.</li>
                        <li>Expanding Workflows: Since adopting Kestra, Displayce's operations have grown exponentially; they now maintain over 50 active workflows.</li>
                    </ul>
                </div>
                <div class="mt-5">
                    <h1>Outcome</h1>
                    <p>With Kestra, Displayce has efficiently addressed their challenges, achieving not just scalability but also setting up a centralized platform for meticulous monitoring and orchestration. They've transitioned smoothly from their legacy systems of DigDag and Nomad, ultimately streamlining their operations and enhancing the quality of service to their clients.</p>
                </div>
                <LayoutSection title="Similar Kestra Stories">
                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-4" v-for="(story, index) in stories.slice(0, 3)" :key="index">
                            <StoriesCard :story="story" :icons="icons"/>
                        </div>
                    </div>
                </LayoutSection>
            </div>
        </div>
        <StoriesFooter/>
    </div>
</template>
<script setup>
    const route = useRoute()
    const slug = "/stories/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const stories = ref([
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
        {
            img : '/stories/blogs/displayce.svg',
            name : 'DESIPLAYCE',
            title : 'Scaling Data Operations with Kestra'},
        {
            img : '/stories/blogs/reglo.svg',
            name : 'RELGO',
            title : 'Unified Control Panel and Simplified Orchestration with kestra',
        },
        {
            img : '/stories/blogs/lm.svg',
            name : 'LEROY MERLIN',
            title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
        },
    ])

    const icons = [
        {
            "name": "DateTimeBetweenCondition",
            "icon": "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTUuMjUzMiAxNS44MjcyTDE1LjI3OTkgMTUuNzgzOEwxNS4yMzYxIDE1Ljc1OEwxMi40MDA2IDE0LjA4MjVWOS44NjEwMVY5LjgxMTAxSDEyLjM1MDZIMTAuODUwNkgxMC44MDA2VjkuODYxMDFWMTQuODYxVjE0Ljg4OTRMMTAuODI1IDE0LjkwMzlMMTQuNDM1IDE3LjA2MzlMMTQuNDc3NCAxNy4wODkzTDE0LjUwMzIgMTcuMDQ3MkwxNS4yNTMyIDE1LjgyNzJaTTkuMzQzOTIgMTguOTVIOS4yOTA0TDkuMjk0MDMgMTkuMDAzNEM5LjMwMTIxIDE5LjEwODggOS4zMDQ4NiAxOS4yMTUyIDkuMzA0ODYgMTkuMzIyNEM5LjMwNDg2IDE5LjkwNzQgOS4xOTYzMyAyMC40NjcgOC45OTgzNiAyMC45ODIxTDguOTcyMjUgMjEuMDVIOS4wNDUwM0gxOUMxOS41NDM3IDIxLjA1IDIwLjA2NTEgMjAuODM0IDIwLjQ0OTYgMjAuNDQ5NkMyMC44MzQgMjAuMDY1MSAyMS4wNSAxOS41NDM3IDIxLjA1IDE5VjVDMjEuMDUgMy44NjIyMiAyMC4xMjc1IDIuOTUgMTkgMi45NUgxOC4wNVYxVjAuOTVIMThIMTZIMTUuOTVWMVYyLjk1SDguMDVWMVYwLjk1SDhINkg1Ljk1VjFWMi45NUg1QzMuODYyMzkgMi45NSAyLjk1IDMuODYyMzkgMi45NSA1VjE0Ljk1NDhWMTUuMDI3NkwzLjAxNzk0IDE1LjAwMTVDMy41MzMwMSAxNC44MDM1IDQuMDkyNDkgMTQuNjk1IDQuNjc3NDMgMTQuNjk1QzQuNzg0NzIgMTQuNjk1IDQuODkxMTUgMTQuNjk4NyA0Ljk5NjYgMTQuNzA1OUw1LjA1IDE0LjcwOTVWMTQuNjU2VjguMDVIMTguOTVWMTguOTVIOS4zNDM5MlpNNS4wNjk5MiAyMS43MTk2VjIxLjY2OTZINS4wMTk5MkgzLjk5MjQ4SDMuOTQyNDhWMjEuNzE5NlYyMi43NDcxVjIyLjc5NzFIMy45OTI0OEg1LjAxOTkySDUuMDY5OTJWMjIuNzQ3MVYyMS43MTk2Wk0zLjY1IDE4LjM0NDhIMy43VjE4LjI5NDhWMTcuOTUyM0MzLjcgMTcuNjkzMSAzLjgwMjk4IDE3LjQ0NDUgMy45ODYyOSAxNy4yNjEyQzQuMTY5NTkgMTcuMDc3OSA0LjQxODIxIDE2Ljk3NDkgNC42Nzc0NCAxNi45NzQ5QzQuOTM2NjcgMTYuOTc0OSA1LjE4NTI5IDE3LjA3NzkgNS4zNjg2IDE3LjI2MTJDNS41NTE5IDE3LjQ0NDUgNS42NTQ4OCAxNy42OTMxIDUuNjU0ODggMTcuOTUyM0M1LjY1NDg4IDE4LjI1NzYgNS41MDU2OSAxOC41MzY1IDUuMjUyNTMgMTguNzA1M0M1LjI1MjUxIDE4LjcwNTMgNS4yNTI0OSAxOC43MDUzIDUuMjUyNDcgMTguNzA1M0w1LjA1NDE3IDE4LjgzNTJMNS4wNTQxMyAxOC44MzUyQzQuMzYxOTIgMTkuMjg5NyAzLjk0MjQ4IDIwLjA2NTcgMy45NDI0OCAyMC44OTc3VjIxLjAzNDdWMjEuMDg0N0gzLjk5MjQ4SDUuMDE5OTJINS4wNjk5MlYyMS4wMzQ3VjIwLjg5NzdDNS4wNjk5MiAyMC40NDMgNS4yOTM0NiAyMC4wNDAyIDUuNjcxMDEgMTkuNzc0OEw1Ljg3NTQ4IDE5LjY0NTNMNS44NzU0OSAxOS42NDU0TDUuODc2NTggMTkuNjQ0NkM2LjQzMTI1IDE5LjI3MjUgNi43ODIzMiAxOC42MzM4IDYuNzgyMzIgMTcuOTUyM0M2Ljc4MjMyIDE3LjM5NDEgNi41NjA1NiAxNi44NTg3IDYuMTY1ODIgMTYuNDY0QzUuNzcxMDggMTYuMDY5MiA1LjIzNTY5IDE1Ljg0NzUgNC42Nzc0NCAxNS44NDc1QzQuMTE5MTkgMTUuODQ3NSAzLjU4MzgxIDE2LjA2OTIgMy4xODkwNiAxNi40NjRDMi43OTQzMiAxNi44NTg3IDIuNTcyNTYgMTcuMzk0MSAyLjU3MjU2IDE3Ljk1MjNWMTguMjk0OFYxOC4zNDQ4SDIuNjIyNTZIMy42NVoiIGZpbGw9ImN1cnJlbnRDb2xvciIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC4xIi8+Cjwvc3ZnPgo="
        },
        {
            "name": "DayWeekCondition",
            "icon": "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNOS4zNDM5MiAxOC45NUg5LjI5MDRMOS4yOTQwMyAxOS4wMDM0QzkuMzAxMjEgMTkuMTA4OCA5LjMwNDg2IDE5LjIxNTIgOS4zMDQ4NiAxOS4zMjI0QzkuMzA0ODYgMTkuOTA3NCA5LjE5NjMzIDIwLjQ2NyA4Ljk5ODM2IDIwLjk4MjFMOC45NzIyNSAyMS4wNUg5LjA0NTAzSDE5QzE5LjU0MzcgMjEuMDUgMjAuMDY1MSAyMC44MzQgMjAuNDQ5NiAyMC40NDk2QzIwLjgzNCAyMC4wNjUxIDIxLjA1IDE5LjU0MzcgMjEuMDUgMTlWNUMyMS4wNSAzLjg2MjIyIDIwLjEyNzUgMi45NSAxOSAyLjk1SDE4LjA1VjFWMC45NUgxOEgxNkgxNS45NVYxVjIuOTVIOC4wNVYxVjAuOTVIOEg2SDUuOTVWMVYyLjk1SDVDMy44NjIzOSAyLjk1IDIuOTUgMy44NjIzOSAyLjk1IDVWMTQuOTU0OFYxNS4wMjc2TDMuMDE3OTQgMTUuMDAxNUMzLjUzMzAxIDE0LjgwMzUgNC4wOTI0OSAxNC42OTUgNC42Nzc0MyAxNC42OTVDNC43ODQ3MiAxNC42OTUgNC44OTExNSAxNC42OTg3IDQuOTk2NiAxNC43MDU5TDUuMDUgMTQuNzA5NVYxNC42NTZWOC4wNUgxOC45NVYxOC45NUg5LjM0MzkyWk0xMiAxMC4wNDNIMTEuOTVWMTAuMDkzVjE1LjA5M1YxNS4xNDNIMTJIMTdIMTcuMDVWMTUuMDkzVjEwLjA5M1YxMC4wNDNIMTdIMTJaTTUuMDY5OTIgMjEuNzE5NlYyMS42Njk2SDUuMDE5OTJIMy45OTI0OEgzLjk0MjQ4VjIxLjcxOTZWMjIuNzQ3MVYyMi43OTcxSDMuOTkyNDhINS4wMTk5Mkg1LjA2OTkyVjIyLjc0NzFWMjEuNzE5NlpNMy42NSAxOC4zNDQ4SDMuN1YxOC4yOTQ4VjE3Ljk1MjNDMy43IDE3LjY5MzEgMy44MDI5OCAxNy40NDQ1IDMuOTg2MjkgMTcuMjYxMkM0LjE2OTU5IDE3LjA3NzkgNC40MTgyMSAxNi45NzQ5IDQuNjc3NDQgMTYuOTc0OUM0LjkzNjY3IDE2Ljk3NDkgNS4xODUyOSAxNy4wNzc5IDUuMzY4NiAxNy4yNjEyQzUuNTUxOSAxNy40NDQ1IDUuNjU0ODggMTcuNjkzMSA1LjY1NDg4IDE3Ljk1MjNDNS42NTQ4OCAxOC4yNTc2IDUuNTA1NjkgMTguNTM2NSA1LjI1MjUzIDE4LjcwNTNDNS4yNTI1MSAxOC43MDUzIDUuMjUyNDkgMTguNzA1MyA1LjI1MjQ3IDE4LjcwNTNMNS4wNTQxNyAxOC44MzUyTDUuMDU0MTMgMTguODM1MkM0LjM2MTkyIDE5LjI4OTcgMy45NDI0OCAyMC4wNjU3IDMuOTQyNDggMjAuODk3N1YyMS4wMzQ3VjIxLjA4NDdIMy45OTI0OEg1LjAxOTkySDUuMDY5OTJWMjEuMDM0N1YyMC44OTc3QzUuMDY5OTIgMjAuNDQzIDUuMjkzNDYgMjAuMDQwMiA1LjY3MTAxIDE5Ljc3NDhMNS44NzU0OCAxOS42NDUzTDUuODc1NDkgMTkuNjQ1NEw1Ljg3NjU4IDE5LjY0NDZDNi40MzEyNSAxOS4yNzI1IDYuNzgyMzIgMTguNjMzOCA2Ljc4MjMyIDE3Ljk1MjNDNi43ODIzMiAxNy4zOTQxIDYuNTYwNTYgMTYuODU4NyA2LjE2NTgyIDE2LjQ2NEM1Ljc3MTA4IDE2LjA2OTIgNS4yMzU2OSAxNS44NDc1IDQuNjc3NDQgMTUuODQ3NUM0LjExOTE5IDE1Ljg0NzUgMy41ODM4MSAxNi4wNjkyIDMuMTg5MDYgMTYuNDY0QzIuNzk0MzIgMTYuODU4NyAyLjU3MjU2IDE3LjM5NDEgMi41NzI1NiAxNy45NTIzVjE4LjI5NDhWMTguMzQ0OEgyLjYyMjU2SDMuNjVaIiBmaWxsPSJjdXJyZW50Q29sb3IiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuMSIvPgo8L3N2Zz4K"
        },
        {
            "name": "ExecutionFlowCondition",
            "icon": "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNS4wMTk5NSAyMS43MTk2VjIyLjc0NzFIMy45OTI1VjIxLjcxOTZINS4wMTk5NVpNMy42NTAwMiAxOC4yOTQ4SDIuNjIyNThWMTcuOTUyM0MyLjYyMjU4IDE3LjQwNzQgMi44MzkwOCAxNi44ODQ3IDMuMjI0NDQgMTYuNDk5M0MzLjYwOTgxIDE2LjExNCA0LjEzMjQ4IDE1Ljg5NzUgNC42Nzc0NyAxNS44OTc1QzUuMjIyNDUgMTUuODk3NSA1Ljc0NTEyIDE2LjExNCA2LjEzMDQ5IDE2LjQ5OTNDNi41MTU4NSAxNi44ODQ3IDYuNzMyMzUgMTcuNDA3NCA2LjczMjM1IDE3Ljk1MjNDNi43MzIzNSAxOC42MTY4IDYuMzg5ODcgMTkuMjQwMSA1Ljg0ODc1IDE5LjYwMzFMNS42NDMyNiAxOS43MzMyQzUuMjUyODMgMjAuMDA3MiA1LjAxOTk1IDIwLjQyNTEgNS4wMTk5NSAyMC44OTc3VjIxLjAzNDdIMy45OTI1VjIwLjg5NzdDMy45OTI1IDIwLjA4MjYgNC40MDM0OCAxOS4zMjIzIDUuMDgxNTkgMTguODc3TDUuMjgwMjMgMTguNzQ2OUM1LjU0NzM3IDE4LjU2ODggNS43MDQ5MSAxOC4yNzQzIDUuNzA0OTEgMTcuOTUyM0M1LjcwNDkxIDE3LjY3OTggNS41OTY2NiAxNy40MTg1IDUuNDAzOTggMTcuMjI1OEM1LjIxMTI5IDE3LjAzMzIgNC45NDk5NiAxNi45MjQ5IDQuNjc3NDcgMTYuOTI0OUM0LjQwNDk3IDE2LjkyNDkgNC4xNDM2NCAxNy4wMzMyIDMuOTUwOTYgMTcuMjI1OEMzLjc1ODI3IDE3LjQxODUgMy42NTAwMiAxNy42Nzk4IDMuNjUwMDIgMTcuOTUyM1YxOC4yOTQ4WiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS4xMTk5NSAyMS42MTk2VjIyLjg0NzFIMy44OTI1VjIxLjYxOTZINS4xMTk5NVpNMy43NTAwMiAxOC4zOTQ4SDIuNTIyNThWMTcuOTUyM0MyLjUyMjU4IDE3LjM4MDggMi43NDk2MSAxNi44MzI3IDMuMTUzNzMgMTYuNDI4NkMzLjU1Nzg1IDE2LjAyNDUgNC4xMDU5NiAxNS43OTc1IDQuNjc3NDcgMTUuNzk3NUM1LjI0ODk4IDE1Ljc5NzUgNS43OTcwOCAxNi4wMjQ1IDYuMjAxMiAxNi40Mjg2QzYuNjA1MzIgMTYuODMyNyA2LjgzMjM1IDE3LjM4MDggNi44MzIzNSAxNy45NTIzQzYuODMyMzUgMTguNjUwOCA2LjQ3MjY5IDE5LjMwNDkgNS45MDQ0NiAxOS42ODYxTDUuOTAyMjcgMTkuNjg3Nkw1LjY5ODc5IDE5LjgxNjRDNS4zMzQxNCAyMC4wNzMyIDUuMTE5OTUgMjAuNDYwOSA1LjExOTk1IDIwLjg5NzdWMjEuMTM0N0gzLjg5MjVWMjAuODk3N0MzLjg5MjUgMjAuMDQ4OSA0LjMyMDQxIDE5LjI1NzIgNS4wMjY3MSAxOC43OTM0TDUuMjI0NzYgMTguNjYzN0M1LjIyNDY2IDE4LjY2MzggNS4yMjQ4NiAxOC42NjM2IDUuMjI0NzYgMTguNjYzN0M1LjQ2MzgzIDE4LjUwNDIgNS42MDQ5MSAxOC4yNDA4IDUuNjA0OTEgMTcuOTUyM0M1LjYwNDkxIDE3LjcwNjQgNS41MDcxOSAxNy40NzA1IDUuMzMzMjcgMTcuMjk2NUM1LjE1OTM0IDE3LjEyMjYgNC45MjM0NCAxNy4wMjQ5IDQuNjc3NDcgMTcuMDI0OUM0LjQzMTQ5IDE3LjAyNDkgNC4xOTU2IDE3LjEyMjYgNC4wMjE2NyAxNy4yOTY1QzMuODQ3NzQgMTcuNDcwNSAzLjc1MDAyIDE3LjcwNjQgMy43NTAwMiAxNy45NTIzVjE4LjM5NDhaTTUuMDgxNTkgMTguODc3TDUuMjgwMjMgMTguNzQ2OUM1LjU0NzM3IDE4LjU2ODggNS43MDQ5MSAxOC4yNzQzIDUuNzA0OTEgMTcuOTUyM0M1LjcwNDkxIDE3LjY3OTggNS41OTY2NiAxNy40MTg1IDUuNDAzOTggMTcuMjI1OEM1LjIxMTI5IDE3LjAzMzIgNC45NDk5NiAxNi45MjQ5IDQuNjc3NDcgMTYuOTI0OUM0LjQwNDk3IDE2LjkyNDkgNC4xNDM2NCAxNy4wMzMyIDMuOTUwOTYgMTcuMjI1OEMzLjc1ODI3IDE3LjQxODUgMy42NTAwMiAxNy42Nzk4IDMuNjUwMDIgMTcuOTUyM1YxOC4yOTQ4SDIuNjIyNThWMTcuOTUyM0MyLjYyMjU4IDE3LjQwNzQgMi44MzkwOCAxNi44ODQ3IDMuMjI0NDQgMTYuNDk5M0MzLjYwOTgxIDE2LjExNCA0LjEzMjQ4IDE1Ljg5NzUgNC42Nzc0NyAxNS44OTc1QzUuMjIyNDUgMTUuODk3NSA1Ljc0NTEyIDE2LjExNCA2LjEzMDQ5IDE2LjQ5OTNDNi41MTU4NSAxNi44ODQ3IDYuNzMyMzUgMTcuNDA3NCA2LjczMjM1IDE3Ljk1MjNDNi43MzIzNSAxOC42MTY4IDYuMzg5ODcgMTkuMjQwMSA1Ljg0ODc1IDE5LjYwMzFMNS42NDMyNiAxOS43MzMyQzUuMjUyODMgMjAuMDA3MiA1LjAxOTk1IDIwLjQyNTEgNS4wMTk5NSAyMC44OTc3VjIxLjAzNDdIMy45OTI1VjIwLjg5NzdDMy45OTI1IDIwLjA4MjYgNC40MDM0OCAxOS4zMjIzIDUuMDgxNTkgMTguODc3Wk01LjAxOTk1IDIxLjcxOTZIMy45OTI1VjIyLjc0NzFINS4wMTk5NVYyMS43MTk2WiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMuMDY4NSA0SDExLjA2ODVWNkgxMy4wNjg1VjRaTTkuMDY4NTEgMlY4SDE1LjA2ODVWMkg5LjA2ODUxWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMuMDY4NSAxOEgxMS4wNjg1VjIwSDEzLjA2ODVWMThaTTkuMDY4NTEgMTZWMjJIMTUuMDY4NVYxNkg5LjA2ODUxWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjEgMThIMTlWMjBIMjFWMThaTTE3IDE2VjIySDIzVjE2SDE3WiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGQ9Ik0xMC45ODAxIDhIMTIuOTgwMVYxMEgxMC45ODAxVjhaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHBhdGggZD0iTTEwLjk4MDEgMTFIMTIuOTgwMVYxM0gxMC45ODAxVjExWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGQ9Ik0xNS4wNjg1IDExSDE3LjA2ODVWMTNIMTUuMDY4NVYxMVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cGF0aCBkPSJNNi44OTIxMSAxMUg4Ljg5MjExVjEzSDYuODkyMTFWMTFaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHBhdGggZD0iTTIuOTYwMTEgMTFINC45NjAxMVYxM0gyLjk2MDExVjExWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGQ9Ik0xOSAxMUgyMVYxM0gxOVYxMVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cGF0aCBkPSJNMTkgMTRIMjFWMTZIMTlWMTRaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHBhdGggZD0iTTEwLjk4MDEgMTRIMTIuOTgwMVYxNkgxMC45ODAxVjE0WiIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo="
        },
        {
            "name": "FlowNamespaceCondition",
            "icon": "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMy4yIDE0Ljg2NjhWMTQuOTM1M0wzLjI2NTI0IDE0LjkxNDRDMy43MTAzNiAxNC43NzIgNC4xODQ4NiAxNC42OTUgNC42Nzc0MyAxNC42OTVDNy4yMzMwOSAxNC42OTUgOS4zMDQ4NiAxNi43NjY4IDkuMzA0ODYgMTkuMzIyNEM5LjMwNDg2IDE5LjkwNzQgOS4xOTYzMyAyMC40NjcgOC45OTgzNiAyMC45ODIxTDguOTcyMjUgMjEuMDVIOS4wNDUwM0gxOS4yNUMxOS43OTM3IDIxLjA1IDIwLjMxNTEgMjAuODM0IDIwLjY5OTYgMjAuNDQ5NkMyMS4wODQgMjAuMDY1MSAyMS4zIDE5LjU0MzcgMjEuMyAxOVY1QzIxLjMgMy44NjIyMiAyMC4zNzc1IDIuOTUgMTkuMjUgMi45NUg1LjI1QzQuMTEyMzkgMi45NSAzLjIgMy44NjIzOSAzLjIgNVYxNC44NjY4Wk0xMy45NTU5IDEwLjcxMjdWMTIuNjk3MUgxMi41NjU5VjYuNDAyMDVIMTQuNjM2MUwxNi4zNTQgMTEuMDU5NEwxNi4zNjYxIDExLjA5MjFIMTYuNDAwOUgxNi40NzA5SDE2LjUyMjJMMTYuNTIwOSAxMS4wNDA4TDE2LjQ1MDkgOC4zNDE0MlY2LjQwMjA1SDE3Ljg0MDlWMTIuNjk3MUgxNS44MzA2TDE0LjA0NzcgNy45MzQ1MkwxNC4wMzU2IDcuOTAyMDVIMTQuMDAwOUgxMy45MzU5SDEzLjg4NDZMMTMuODg1OSA3Ljk1MzMyTDEzLjk1NTkgMTAuNzEyN1pNOC4xMTU4NCAxMC41MjIxVjEyLjY5NzFINi42NjA4NFY2LjQwNzA1SDEwLjg0NThWNy42MjIwNUg4LjE2NTg0SDguMTE1ODRWNy42NzIwNVY5LjIwNzA1VjkuMjU3MDVIOC4xNjU4NEgxMC43NzA4VjEwLjQ3MjFIOC4xNjU4NEg4LjExNTg0VjEwLjUyMjFaTTUuMDY5OTIgMjEuNzE5NlYyMS42Njk2SDUuMDE5OTJIMy45OTI0OEgzLjk0MjQ4VjIxLjcxOTZWMjIuNzQ3MVYyMi43OTcxSDMuOTkyNDhINS4wMTk5Mkg1LjA2OTkyVjIyLjc0NzFWMjEuNzE5NlpNMy42NSAxOC4zNDQ4SDMuN1YxOC4yOTQ4VjE3Ljk1MjNDMy43IDE3LjY5MzEgMy44MDI5OCAxNy40NDQ1IDMuOTg2MjkgMTcuMjYxMkM0LjE2OTU5IDE3LjA3NzkgNC40MTgyMSAxNi45NzQ5IDQuNjc3NDQgMTYuOTc0OUM0LjkzNjY3IDE2Ljk3NDkgNS4xODUyOSAxNy4wNzc5IDUuMzY4NiAxNy4yNjEyQzUuNTUxOSAxNy40NDQ1IDUuNjU0ODggMTcuNjkzMSA1LjY1NDg4IDE3Ljk1MjNDNS42NTQ4OCAxOC4yNTc1IDUuNTA1NzYgMTguNTM2MyA1LjI1MjcgMTguNzA1MUM1LjI1MjYzIDE4LjcwNTIgNS4yNTI1NSAxOC43MDUyIDUuMjUyNDcgMTguNzA1M0w1LjA1NDE3IDE4LjgzNTJMNS4wNTQxMyAxOC44MzUyQzQuMzYxOTIgMTkuMjg5NyAzLjk0MjQ4IDIwLjA2NTcgMy45NDI0OCAyMC44OTc3VjIxLjAzNDdWMjEuMDg0N0gzLjk5MjQ4SDUuMDE5OTJINS4wNjk5MlYyMS4wMzQ3VjIwLjg5NzdDNS4wNjk5MiAyMC40NDMgNS4yOTM0NiAyMC4wNDAyIDUuNjcxMDEgMTkuNzc0OEw1Ljg3NTQ4IDE5LjY0NTNMNS44NzU0OSAxOS42NDU0TDUuODc2NTggMTkuNjQ0NkM2LjQzMTI1IDE5LjI3MjUgNi43ODIzMiAxOC42MzM4IDYuNzgyMzIgMTcuOTUyM0M2Ljc4MjMyIDE3LjM5NDEgNi41NjA1NiAxNi44NTg3IDYuMTY1ODIgMTYuNDY0QzUuNzcxMDggMTYuMDY5MiA1LjIzNTY5IDE1Ljg0NzUgNC42Nzc0NCAxNS44NDc1QzQuMTE5MTkgMTUuODQ3NSAzLjU4MzgxIDE2LjA2OTIgMy4xODkwNiAxNi40NjRDMi43OTQzMiAxNi44NTg3IDIuNTcyNTYgMTcuMzk0MSAyLjU3MjU2IDE3Ljk1MjNWMTguMjk0OFYxOC4zNDQ4SDIuNjIyNTZIMy42NVoiIGZpbGw9ImN1cnJlbnRDb2xvciIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC4xIi8+Cjwvc3ZnPgo="
        }
    ]

    const storyName = slug.replace('/stories/', '').toUpperCase().split('-').join(' ')

    const { name, title } = slug != '/stories/' ? stories.value.find(story => story.name === storyName) : {}
</script>
<style scoped lang="scss">
p, ul > li {
    line-height: 1.5rem;
}
</style>