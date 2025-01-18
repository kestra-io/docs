<template>
    <div :class="'doc-alert d-flex align-items-baseline alert alert-' + type " role="alert">
        <div class="me-3">
            <svg class="bi flex-shrink-0" role="img" width="20" height="20" viewBox="0 0 16 16">
                <use :xlink:href="Icon"></use>
            </svg>
        </div>
        <div class="d-flex flex-column">
            <slot />
        </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
            <path fill="currentColor" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
        </symbol>
        <symbol id="info-fill" viewBox="0 0 16 16">
            <path fill="currentColor" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
            <path fill="currentColor" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
        </symbol>
        <symbol id="x-circle-fill" viewBox="0 0 16 16">
            <path fill="currentColor" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
        </symbol>
    </svg>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true
        },
    },
    computed: {
        Icon() {
            switch (this.type) {
                case 'success':
                    return '#check-circle-fill';
                case 'info':
                    return '#info-fill';
                case 'warning':
                    return '#exclamation-triangle-fill';
                case 'danger':
                    return '#x-circle-fill';
                default:
                    return '#info-fill';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.doc-alert {
    --bs-alert-padding-x: var(--spacer);
    --bs-alert-margin-bottom: var(--spacer);

    border-left-width: 5px !important;
    border-style: solid;
    padding: 0 var(--bs-alert-padding-x);
    margin-bottom: var(--bs-alert-margin-bottom);

    > * {
        margin: 0;
    }
}

.alert {

    $success-bg: rgba(5, 27, 17, .5);
    $success-border: rgba(15, 81, 50, 1);
    $success-color: rgba(117, 183, 152, 1);

    $info-bg: rgba(3, 40, 48, .5);
    $info-border: rgba(8, 121, 144, 1);
    $info-color: rgba(110, 223, 246, 1);

    $warning-bg: rgba(51, 39, 1, .5);
    $warning-border: rgba(153, 116, 4, 1);
    $warning-color: rgba(255, 218, 106, 1);

    $danger-bg: rgba(44, 11, 14, .5);
    $danger-border: rgba(132, 32, 41, 1);
    $danger-color: rgba(234, 134, 143, 1);

    &-success {
        background-color: $success-bg;
        border-color: $success-border;
        color: $success-color;
    }

    &-info {
        background-color: $info-bg;
        border-color: $info-border;
        color: $info-color;
    }

    &-warning {
        background-color: $warning-bg;
        border-color: $warning-border;
        color: $warning-color;
    }

    &-danger {
        background-color: $danger-bg;
        border-color: $danger-border;
        color: $danger-color;
    }
}
</style>