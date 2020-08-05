# Sample Progressive Web App for Testing Progressive Web Apps Pluralsight Course

## Getting Started

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

The tests will run against the Netlify sample application I have set up for the course, which is accessible publicly at https://carved-rock-order-tracker-pwa.netlify.app/

### Building the Sample

You may build the sample locally, though it requires some extra dependencies due to some customized packages and shared modules.

#### Prerequisites

- Node 12.16.3

#### Install Global Dependencies

This project uses Ionic Framework with React.

```bash
npm install -g @ionic/cli
```

## Patched Packages

- `react-scripts` at `4d9fe49e71233fc1e8f05a26eb6e25755637375e`
  - Uses workbox v5 pre-release

These packages are in `.yalc` which can be managed by [yalc](https://npmjs.com/package/yalc).
