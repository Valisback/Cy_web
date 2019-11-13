# ![Panasonic | Cy](logo.png)
### Just try it: [Demo](http://18.219.188.25/)

Cy is a platform created in collaboration with Fahrenheit212, facilitating the management of fleets of Electric Vehicles through battery data visualization. 
This repository features the Angular web application, relying on the [Cy Server](https://github.com/Capgemini-AIE/Fleet-Electrification-server).

- [Getting started](#getting_started)
- [Running the app](#running)
- [Configuration](#configuration)
- [Author](#author)

<a name="getting_started"></a>
## Getting started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Before installing and using the app, make sure you have the [Angular CLI](https://github.com/angular/angular-cli#installation) installed globally, as well as [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/).

| Name | Version |
| ------------ | ------- |
| [Angular CLI](https://github.com/angular/angular-cli#installation) | 8.3.5 |
| [NodeJS](https://nodejs.org/en/) | 10.16.3 |
| [npm](https://www.npmjs.com/) | 6.9.0 |


### Installing

To install the server on your system, download the code using Github's interface. Once you've cloned the repository, open a terminal window at the root of the project folder and type the following command:

```bash
npm install
```

> This will install all the different dependencies.

<a name="running"></a>
## Running the app
### Development Mode

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


> Make sure you have the [Cy Server](https://github.com/Capgemini-AIE/Fleet-Electrification-server) running to be able to visualize data.

### Production Mode

Run `ng build --prod` to build the project in production. The build artifacts will be stored in the `dist/` directory. You can navigate in this directory to the foler `Fleet-Electrification-web` containing all the compiled files.


> Make sure you have the [Cy Server](https://github.com/Capgemini-AIE/Fleet-Electrification-server) running to be able to visualize data.

<a name="configuration"></a>
## Configuration

When deploying the app, you may need to configure it so that it can operate in a specific environment.

### Production / Development

The environment automatically switches from development to production when the flat `--production` is added to the `ng build`. However, you can also switch manually between the environment.

To do so, simply open and edit the ```config.json``` file at the root of the project folder.

```json
{
	"production": true
}
```

### Environments

To add or edit the different environments, add or edit the files in the ```environments``` folder at the root of the project folder. Here's an example of a production environment:

```json
export const environment = {
  production: true,
  api: {
    url: 'http://18.219.188.25:8080',
  }
};
}
```

<a name="author"></a>
## Author

* **Valentin Pereira** - *See also: [Cy Server](https://github.com/Capgemini-AIE/Fleet-Electrification-server)*
