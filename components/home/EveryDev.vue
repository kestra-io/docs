<template>
    <div class="wrapper-every-dev">
        <div class="center-block">
            <div class="line-top"/>
            <h2>For <span>Every</span><br/> Developer</h2>
            <div class="line-left"/>
            <div class="line-right"/>
            <div class="line-bottom"/>
            <p>Kestra unify all engineers, breaking down silos.</p>
        </div>
        <div class="container">
            <div class="left-card card-block">
                <h3>Software Engineers</h3>
                <p class="description">Version control all your resources, from workflows to users and permissions with CI/CD and Terraform Provider.</p>
            </div>

            <div class="right-card card-block">
                <h3>Platform Engineers</h3>
                <p class="description">Automate infrastructure tasks, manage dependencies, and ensure operational consistency.</p>
            </div>

            <div class="bottom-card card-block">
                <h3>Data Engineers</h3>
                <p class="description">Build reliable  data pipelines with on-demand infrastructure that scales on-demand whether in Cloud or on-prem.</p>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .wrapper-every-dev {
        background-image: url(@/assets/images/homepage/every-bg-dots.svg), radial-gradient(ellipse at center, #000 0%, rgba(70, 69, 100, 0) 100%);
        background-blend-mode: luminosity, normal;
        background-repeat: no-repeat, no-repeat;
        background-position: center bottom, center bottom;
        background-size: cover, cover;
        padding: 2rem;
        margin-top: -4rem;
        color: white;
        .container{
            position: relative;
            height: 300px;
        }
    }

    .center-block {
        text-align: center;
        padding-top: 240px;
        height: 500px;
        width: 500px;
        margin: 0 auto;
        position: relative;
        text-align: center;
        h2 {
            font-size: 2.2rem;
            line-height: 2.5rem;
            color: white;
            font-weight: 600;
            span {
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 100px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p{
            color: #B9B9BA;
            max-width: 250px;
            margin: auto;
        }
        .line-top{
            content: '';
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: 150px;
            background: linear-gradient(to bottom, transparent 50%, #191e27 50%), linear-gradient(to bottom, #190930 0%, #658AF9 100%);
            background-size: 4px 4px, 1px 100%;
        }
        .line-left{
            content: '';
            position: absolute;
            top: 50%;
            right: 50%;
            width: 150px;
            transform: translate(-150px, 30px);
            height: 1px;
            background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to right, #190930 0%, #658AF9 100%);
            background-size: 4px 4px, 100% 1px;
        }
        .line-right{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150px;
            transform: translate(150px, 30px);
            height: 1px;
            background: linear-gradient(to right, transparent 50%, #191e27 50%), linear-gradient(to left, #190930 0%, #658AF9 100%);
            background-size: 4px 4px, 100% 1px;
        }
        .line-bottom{
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: 100px;
            background: linear-gradient(to bottom, transparent 50%, #191e27 50%), linear-gradient(to top, #190930 0%, #658AF9 100%);
            background-size: 4px 4px, 1px 100%;
        }
    }

    .card-block{
        position: absolute;
        bottom: 400px;
        border-radius: 2rem;
        width: 300px;
        padding: 2rem;
        text-align: center;
        background-color: rgb(26, 28, 35);
        background-image: linear-gradient(to bottom, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(to right,#1A1C24 0%, #373a44 80%, #1A1C24 100%);
        background-clip: padding-box;
        h3{
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: .5rem;
        }
        .description{
            color: #B9B9BA;
            font-size: .8rem;
            margin-top: .5em;
            margin-bottom: 0;
        }
        &:before {
            content: '';
            position: absolute;
            border-radius: inherit;
            top: 0; right: 0; bottom: 0; left: 0;
            z-index: -1;
            margin: -1px;
            background-image: linear-gradient(to bottom, #9C90D350 0%, #AC82D6 100%);
        }
    }
    .left-card{
        left: 0;
    }
    .right-card{
        right: 0;
    }
    .bottom-card{
        left: 39%;
        bottom: 30px;
    }
</style>