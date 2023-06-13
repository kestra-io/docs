# Kestra documentation

<p align="center">
  <img width="460" src="https://kestra.io/logo-white.svg"  alt="Kestra workflow orchestrator" />
</p>


> Event-driven declarative orchestrator that simplifies data operations.

![gif](https://kestra.io/video.gif)


## Documentation

The official Kestra documentation can be found at [kestra.io/docs](https://kestra.io/docs).


## Local development of the Kestra UI

To run the UI locally, you must have Node.js and NPM installed. Then, run the following commands:

```bash
npm install
npm run dev
```

You can access the UI from http://localhost:8080/.

## Troubleshooting tips

Depending on your Node.js and OS version, you may encounter the following error: `Error message "error:0308010C:digital envelope routines::unsupported"`.

In this case, you must switch to the OpenSSL legacy provider via `export NODE_OPTIONS=--openssl-legacy-provider`.


## License
Apache 2.0 © [Kestra Technologies](https://kestra.io)