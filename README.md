<p align="center">
  <a href="https://www.kestra.io">
    <img src="https://kestra.io/banner.png"  alt="Kestra workflow orchestrator" />
  </a>
</p>

<h1 align="center" style="border-bottom: none">
    Event-Driven Declarative Orchestrator
</h1>

<div align="center">
 <a href="https://github.com/kestra-io/kestra/releases"><img src="https://img.shields.io/github/tag-pre/kestra-io/kestra.svg?color=blueviolet" alt="Last Version" /></a>
  <a href="https://github.com/kestra-io/kestra/blob/develop/LICENSE"><img src="https://img.shields.io/github/license/kestra-io/kestra?color=blueviolet" alt="License" /></a>
  <a href="https://github.com/kestra-io/kestra/stargazers"><img src="https://img.shields.io/github/stars/kestra-io/kestra?color=blueviolet&logo=github" alt="GitHub star" /></a> <br>
<a href="https://kestra.io"><img src="https://img.shields.io/badge/Website-kestra.io-192A4E?color=blueviolet" alt="Kestra infinitely scalable orchestration and scheduling platform"></a>
<a href="https://kestra.io/slack"><img src="https://img.shields.io/badge/Slack-Join%20Community-blueviolet?logo=slack" alt="Slack"></a>
</div>

<br />

<p align="center">
    <a href="https://twitter.com/kestra_io"><img height="25" src="https://kestra.io/twitter.svg" alt="twitter" /></a> &nbsp;
    <a href="https://www.linkedin.com/company/kestra/"><img height="25" src="https://kestra.io/linkedin.svg" alt="linkedin" /></a> &nbsp;
<a href="https://www.youtube.com/@kestra-io"><img height="25" src="https://kestra.io/youtube.svg" alt="youtube" /></a> &nbsp;
</p>


<p align="center">
    <a href="https://go.kestra.io/video/product-overview" target="_blank">
        <img src="https://kestra.io/startvideo.png" alt="Get started in 4 minutes with Kestra" width="640px" />
    </a>
</p>
<p align="center" style="color:#CF9FFF;"><strong>Get started with Kestra in 4 minutes.</strong></p>

# Kestra Documentation

Kestra is an open-source infinitely-scalable orchestration platform enabling all engineers to manage business-critical workflows declaratively in code.

![gif](https://kestra.io/video.gif)


## Documentation

The official Kestra documentation can be found under [kestra.io/docs](https://kestra.io/docs).


## Local development of the Kestra Docs

To run the docs locally, you must have Node.js and NPM installed. Then, run the following commands:

```bash
npm install
npm run dev
```

You can access the docs at [localhost:3001](http://localhost:3001/).

## Contributing Tips

Ensure that all links, including images, are relative.

## Troubleshooting tips

Depending on your Node.js and OS version, you may encounter the following error: `Error message "error:0308010C:digital envelope routines::unsupported"`.

To resolve this issue, you will need to switch to the OpenSSL legacy provider by executing the following command: `export NODE_OPTIONS=--openssl-legacy-provider`.

If you are using an Apple Silicon Mac, please ensure that you are using Node.js version 20 or higher.

## License
Apache 2.0 © [Kestra Technologies](https://kestra.io)


## Stay up to date

We release new versions on a monthly basis. To stay informed about the latest releases and receive notifications for future updates, please consider starring our [main repository](https://github.com/kestra-io/kestra).

![Star the repo](https://kestra.io/star.gif)
