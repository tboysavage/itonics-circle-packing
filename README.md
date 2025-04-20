# ItonicsCirclePacking
This project is a D3-based interactive circle packing visualization built with Angular. It displays countries in Europe grouped by region and sized based on either population or land area.

👤 Created by: Tanatswa Mapfumo

Itonics: Assignment for Frontend Developer 


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## To use the project do the following

### 📦 Install Dependencies

Run the following command from the project root:

```bash
npm install
```
This installs all necessary dependencies defined in package.json.

### Run the App Locally(Recommended)
To start the development server:

```bash
ng serve
```
Once the server starts, open your browser and navigate to: http://localhost:4200/
The application will automatically reload when you make code changes.
### OR
### Build the Project
To create a production-ready build:

```bash
ng build
```

### Structure
- src/app/components/circle-packing/
Contains the Angular component responsible for rendering the D3 chart.

- src/assets/europe_population_enriched.json
Local data file containing structured continent-region-country information.

- src/app/services/data.service.ts
Service that fetches the data from the assets folder using HttpClient.

- src/app/models/country.model.ts
Contains TypeScript interfaces for typing the data structure.
