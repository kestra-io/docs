<template>
    <div class="position-relative container-fluid d-flex justify-content-center">
        <div class="position-relative">
            <img src="/partners/Frame922.svg" alt="Frame 922">
            <div class="logo position-absolute start-50 translate-middle">
                <img src="/partners/Badge_Kestra_Technology_Partner.svg" alt="Badge_Kestra_Technology_Partner">
            </div>
        </div>
        <div class="description position-absolute start-50 translate-middle text-center w-50">
            <h2>Kestra Partner <br><span>Ecosystem</span></h2>
            <span>Whether you are building something new, upgrading the existing, or replatforming from the old, you can trust these partners to make your journey a successful one.</span><br>
            <button class="btn btn-primary mt-4">Become a partner</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    background: $purple-17;
    padding-bottom: 3rem;
    .logo {
        top: 245px;
    }
    .description {
        top: 75%;
    }
    
    h2 span {
        font-weight: 100;
    }
}
</style>