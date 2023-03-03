# Kestra documentation

<p align="center">
  <img width="460" src="https://kestra.io/logo-white.svg"  alt="Kestra workflow orchestrator" />
</p>


> Kestra is an orchestration & scheduler platform that helps you to build, run, schedule, and monitor complex pipelines.

![Kestra orchestrator](https://kestra.io/ui.gif)


## Documentation
* The official Kestra documentation can be found here: [kestra.io](https://kestra.io)


## Run locally

To run the website locally, you must have Node.js and NPM installed, then run the following commands:

```bash
npm install
npm run dev
```

The site will be accessible at http://localhost:8080/.

Depending on your Node.js and OS version, you may encounter the following error: `Error message "error:0308010C:digital envelope routines::unsupported"`.

In this case, you must switch to the OpenSSL legacy provider via `export NODE_OPTIONS=--openssl-legacy-provider`.


## License
Apache 2.0 © [Kestra Technologies](https://kestra.io)