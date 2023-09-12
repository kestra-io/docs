<template>
<div class="mt-5">
    <p class="top-breadcrumb" data-aos="fade-right">
        Solutions
    </p>
    <h1 data-aos="fade-left">Blueprints</h1>
    <h5 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h5>
    <div class="grid gap-3 mt-5" data-aos="fade-left">
        <button
            v-for="cat in categories"
            :key="cat"
            :class="{ 'active': filter === cat.name }"
            @click="setFilterBlueprints(cat.name)"
            class="m-1 rounded-button"
        >
            {{ cat.name }}
        </button>
    </div>
    <div class="row my-5">
        <div class="row mb-4 justify-content-center">
            <div class="col-12 col-md-6 col-lg-4">
                <input type="text" class="form-control form-control-lg" id="search-input" placeholder="Search blueprints">
            </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in blueprints" :key="blueprint.id">
            <BlueprintsBlueprintCard :blueprint="blueprint" data-aos="zoom-in" />
        </div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      filter: 'All tags',
      categories: [
          {
              name: 'All tags'
          },
          {
              name: 'Kestra'
          },
          {
              name: 'Database'
          },
          {
              name: 'Trigger'
          },
          {
              name: 'AWS'
          },
          {
              name: 'GCP'
          },
          {
              name: 'Azure'
          },
          {
              name: 'Ingest'
          },
          {
              name: 'Transform'
          },
          {
              name: 'Analyze'
          },
          {
              name: 'SaaS'
          },
          {
              name: 'Python'
          },
          {
              name: 'Files'
          },
          {
              name: 'Snowflake'
          },
          {
              name: 'Pip'
          },
          {
              name: 'CLI'
          },
          {
              name: 'R'
          },
          {
              name: 'Metrics'
          },
          {
              name: 'Outputs'
          },
          {
              name: 'Databricks'
          },
          {
              name: 'SQL'
          },
          {
              name: 'Container Registries'
          },
          {
              name: 'S3'
          },
          {
              name: 'BigQuery'
          },
          {
              name: 'DuckDB'
          },
          {
              name: 'dbt'
          },
      ],
      blueprints: [
        {
            id: 1,
            category: "GIT TRANSFORM DBT DUCKDB SAAS",
            title: "Git workflow for dbt with MotherDuck"
        },
        {
            id: 2,
            category: "S3 TRIGGER DUCKDB NOTIFICATIONS",
            title: "Anomaly detection using DuckDB SQL query and S3 file event trigger, sending a CSV file attachment..."
        },
        {
            id: 3,
            category: "ANALYZE NOTIFICATIONS AWS S3 DUCKDB SAAS TRIGGER",
            title: "Upload data to S3 in Python using boto3, transform it in a SQL query with DuckDB and send..."
        },
        {
            id: 4,
            category: "FILES TRANSFORM GCP BIGQUERY DUCKDB",
            title: "Extract data, mask sensitive columns using DuckDB and load it to BigQuery"
        },
        {
            id: 5,
            category: "KESTRA FILES",
            title: "Process files in parallel"
        },
        {
            id: 6,
            category: "TRANSFORM GIT",
            title: "Run dbt CLI commands in one container: dbt deps & dbt build"
        },
        {
            id: 7,
            category: "AI",
            title: "Create an image using OpenAI's DALL-E"
        },
        {
            id: 8,
            category: "S3 INGEST TRANSFORM DATABASE",
            title: "Extract data, transform it, and load it in parallel to S3 and Postgres — all in less than 7 seconds!"
        },
        {
            id: 9,
            category: "AI",
            title: "Send a prompt to OpenAI's ChatCompletion API"
        },
        {
            id: 10,
            category: "AI",
            title: "Create an image using OpenAI's DALL-E"
        },
        {
            id: 11,
            category: "AI",
            title: "Send a prompt to OpenAI's ChatCompletion API"
        },
        {
            id: 12,
            category: "S3 INGEST TRANSFORM DATABASE",
            title: "Extract data, transform it, and load it in parallel to S3 and Postgres — all in less than 7 seconds!"
        },
        {
            id: 13,
            category: "S3 INGEST TRANSFORM DATABASE",
            title: "Extract data, transform it, and load it in parallel to S3 and Postgres — all in less than 7 seconds!"
        },
        {
            id: 14,
            category: "AI",
            title: "Create an image using OpenAI's DALL-E"
        },
        {
            id: 15,
            category: "AI",
            title: "Send a prompt to OpenAI's ChatCompletion API"
        },
        {
            id: 16,
            category: "AI",
            title: "Create an image using OpenAI's DALL-E"
        },
        {
            id: 17,
            category: "AI",
            title: "Send a prompt to OpenAI's ChatCompletion API"
        },
        {
            id: 18,
            category: "S3 INGEST TRANSFORM DATABASE",
            title: "Extract data, transform it, and load it in parallel to S3 and Postgres — all in less than 7 seconds!"
        },
      ]
    }
  },
  methods: {
    setFilterBlueprints(id) {
        this.filter = id;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

h5 {
    font-weight: normal;
}
.form-control {
    background: url('/search.svg') no-repeat 13px;
    padding-left: 2.5rem;
}

.top-breadcrumb {
    &:after {
        width: 13px;
    }
}

.rounded-button {
    border-radius: 0.25rem;
    padding: calc($spacer / 2) calc($spacer / 1);
    margin-right: calc($spacer / 2);
    background-color: var(--bs-white);
    border: 0.063rem solid #E5E4F7;
    font-weight: bold;
    font-size: $font-size-sm;
    line-height: 1.375rem;

    &.active {
        background-color: var(--bs-primary);
        color: var(--bs-white);
    }
}
</style>