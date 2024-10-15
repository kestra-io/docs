## Code of conduct

This project and everyone participating in it is governed by the
[Kestra Code of Conduct](https://github.com/kestra-io/docs/blob/main/.github/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to [hello@kestra.io](mailto:hello@kestra.io)

## I want to contribute

> ### Legal notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.


### Submit issues

### Reporting bugs
Bug reports help us make Kestra better for everyone. We provide a preconfigured template for bugs to make it very clear what information we need.
Please search within our [already reported bugs](https://github.com/kestra-io/docs/issues?q=is%3Aissue+is%3Aopen+label%3Abug) before raising a new one to make sure you're not raising a duplicate.

### Reporting security issues
Please do not create a public GitHub issue. If you've found a security issue, please email us directly at hello@kestra.io instead of raising an issue.


### Requesting new features
To request new features, please create an issue on this project.
If you would like to suggest a new feature, we ask that you please use our issue template. It contains a few essential questions that help us understand the problem you are looking to solve and how you think your recommendation will address it.
To see what has already been proposed by the community, you can look [here](https://github.com/kestra-io/docs/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement).
Watch out for duplicates! If you are creating a new issue, please check existing open, or recently closed. Having a single voted for issue is far easier for us to prioritize.

### Your first code contribution

#### Requirements
The following dependencies are required to build Kestra docs locally:
- Node 14+ and npm
- an IDE (Webstorm or VS Code)

To start contributing:
- [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the repository
- Clone the fork on your workstation:

```bash
$ git clone git@github.com:{YOUR_USERNAME}/docs.git
$ cd docs
```


#### Develop

The frontend is made with [Nuxt JS](https://nuxt.com/).

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3001
# NOTE: the application start process presents itself with just the Nuxt logo
$ npm run dev

# to generate static pages
$ npm run generate

# making a production build
$ npm run build
```
