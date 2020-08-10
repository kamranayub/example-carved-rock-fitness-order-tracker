# Sample Progressive Web App for Testing Progressive Web Apps Pluralsight Course

This sample app was created for the Pluralsight course, Testing Progressive Web Apps by [Kamran Ayub](https://github.com/kamranayub). The app itself is a demo Progressive Web App written in React and TypeScript using the [Ionic Framework](https://ionicframework.com/).

The app is available publicly at https://carved-rock-order-tracker-pwa.netlify.app/

## Features

- Customized install prompt (Chrome/Edge)
- Service worker caching and bypass implementation
- Local notifications
- Responsive design for mobile, tablet, and desktop
- Continuous integration test suite using GitHub Actions
- Real device testing using [BrowserStack](https://browserstack.com)
- [WebdriverIO](https://webdriver.io/) and [Cypress](https://cypress.io) test examples

## Pull Request Documentation

Most of the major capabilities of the app and tests were done using Pull Requests where I kept notes and documentation as I worked through the course. You can [reference them for more details](https://github.com/kamranayub/example-carved-rock-fitness-order-tracker/pulls?q=is%3Apr+sort%3Aupdated-desc+is%3Aclosed).

## Tagged Course Releases

The sample app may evolve over time as new capabilities and features are available to test PWAs but if you need to reference specific code shown in the course, I've [tagged releases you can browse](https://github.com/kamranayub/example-carved-rock-fitness-order-tracker/releases).

## Getting Started

Clone or fork this repository to explore the code and tests.

### Running the Tests

The tests can be run without building / running the sample locally. They are in the `e2e` directory:

```bash
cd e2e

# Install dependencies (Cypress, wdio)
npm install

# Open Cypress test runner
npm run cypress

# Run Cypress tests
npm run cypress:run

# Run WebdriverIO tests
npm run wdio
```

The tests will run against the public URL of the sample app.

### Building the Sample

You may build the sample locally, though it requires some extra dependencies due to some customized packages and shared modules.

#### Prerequisites

- Node 12.16.3

#### Install Global Dependencies

This project uses Ionic Framework with React.

```bash
npm install -g @ionic/cli
```

### Running the Sample

You can use the `ionic serve --https` command:

```bash
ionic serve --https
```

This will launch the app on `https://localhost:8100/` with a self-signed development certificate.

## Patched Packages

- `react-scripts` at `4d9fe49e71233fc1e8f05a26eb6e25755637375e` ([#18](https://github.com/kamranayub/example-carved-rock-fitness-order-tracker/issues/18))
  - Uses workbox v5 pre-release

These packages are in `.yalc` which can be managed by [yalc](https://npmjs.com/package/yalc).
