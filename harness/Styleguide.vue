<template>
    <div class="styleguide">
        <p><span class="badge" data-probe="badge">badge</span></p>

        <div class="real-breadcrumb">
            <Breadcrumb slug="docs/getting-started/quickstart" page-title="Quickstart" />
        </div>

        <div class="real-pagination">
            <Pagination :total-pages="5" current-url="/blogs?page=2" />
        </div>
        <div class="real-pagination-compact">
            <Pagination :total-pages="5" current-url="/blogs?page=2" compact />
        </div>

        <ul class="nav" data-probe="nav">
            <li class="nav-item" data-probe="nav-item"><a class="nav-link" data-probe="nav-link" href="#">Tab</a></li>
        </ul>

        <div class="card" data-probe="card">
            <div class="card-header" data-probe="card-header">Header</div>
            <div class="card-body" data-probe="card-body">
                <h5 class="card-title" data-probe="card-title">Title</h5>
                <p class="card-text" data-probe="card-text">Text</p>
            </div>
            <div class="card-footer" data-probe="card-footer">Footer</div>
        </div>

        <p>
            <button class="btn btn-primary" data-probe="btn-primary">Primary</button>
            <button class="btn btn-secondary" data-probe="btn-secondary">Secondary</button>
            <button class="btn btn-primary btn-lg" data-probe="btn-lg">Large</button>
            <button class="btn btn-secondary btn-sm" data-probe="btn-sm">Small</button>
            <button class="btn btn-dark" data-probe="btn-dark">Dark</button>
        </p>

        <label class="form-label" data-probe="form-label" for="probe-input">Label</label>
        <div class="input-group" data-probe="input-group">
            <span class="input-group-text" data-probe="input-group-text">@</span>
            <input id="probe-input" class="form-control" data-probe="form-control" value="x" />
        </div>
        <select class="form-select" data-probe="form-select"><option>a</option></select>

        <ul class="list-unstyled" data-probe="list-unstyled"><li>item</li></ul>
        <p class="lead" data-probe="lead">Lead</p>
        <figcaption class="figure-caption" data-probe="figure-caption">Caption</figcaption>
        <img class="img-fluid" data-probe="img-fluid" src="/stub.svg" alt="" />
        <span class="visually-hidden" data-probe="visually-hidden">hidden</span>

        <div class="container" data-probe="container">
            <div class="row g-3" data-probe="row">
                <div class="col-12 col-md-6" data-probe="col-md-6">a</div>
                <div class="col-12 col-lg-4" data-probe="col-lg-4">b</div>
            </div>
        </div>
        <div class="container-xxl" data-probe="container-xxl">xxl</div>

        <div class="d-flex align-items-center justify-content-between gap-2 mb-3 mt-4 p-0 px-2 py-1 w-100 text-center fw-bold rounded border"
             data-probe="utilities">utils</div>
        <div class="d-none d-lg-block" data-probe="d-none-d-lg-block">responsive</div>
        <div class="mx-auto text-white bg-transparent overflow-hidden" data-probe="utilities-2">more</div>
    </div>
</template>

<script setup lang="ts">
    import Breadcrumb from "~/components/layout/Breadcrumb.vue"
    import Pagination from "~/components/common/Pagination.vue"
</script>
