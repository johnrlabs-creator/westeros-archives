# WesterosArchives

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## State Management with NgRx

This project uses [NgRx](https://ngrx.io/) for state management.

### Installing NgRx

To install NgRx store and store-devtools, run the following commands:

```bash
ng add @ngrx/store@latest
npm install @ngrx/store-devtools --save
```

The first command sets up the NgRx store with the necessary configuration. The second command adds the Redux DevTools integration for debugging.

### Using Redux DevTools

Once installed, you can use the Redux DevTools browser extension to inspect and debug your application state:

1. Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension) browser extension
2. Start your development server with `ng serve`
3. Open your browser's DevTools (F12 or right-click → Inspect)
4. Look for the "Redux" tab in the DevTools
5. You can now:
   - Inspect the current state
   - View dispatched actions and their payloads
   - Time-travel debug by stepping through actions
   - Export/import state snapshots

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Notes
Note: A meta reducer is added to save the last state in session to avoid loosing data if page is accidentally refreshed.

Note: Search Query should be case sensitive and match the exact name of character, book or house. This is a limitation to the api (https://anapioficeandfire.com/)

## Backend
An ExpressJS backend is required to run locally to enable login and to access the app: https://github.com/johnrlabs-creator/westeros-arch-backend