import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EuropeData } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}
  /**
   * Fetches continent-region-country data from local assets folder.
   * This method returns EuropeData.
   */
  getEuropeData(): Observable<EuropeData> {
    return this.http.get<EuropeData>('assets/europe_population_enriched.json');
  }
}
