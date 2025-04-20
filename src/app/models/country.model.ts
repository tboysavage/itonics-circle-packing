// Represents a single country and its relevant data fields
export interface Country {
  country: string;           // Name of the country
  population: number;        // Population count
  wikipedia: string;         // Link to the country's wikipedi
  flag: string;              // URL to the country’s flag image
  land_area_km2: number;     // Land area in square kilometers
}

//Region
export interface Region {
  [regionName: string]: Country[];
}

// Structure of the JSON file
export interface EuropeData {
  Europe: {
    [region: string]: Country[];
  };
}
