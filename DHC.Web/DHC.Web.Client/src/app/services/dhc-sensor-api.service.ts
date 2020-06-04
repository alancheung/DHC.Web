import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DhcApiService } from './dhc-api.service';

@Injectable({
  providedIn: 'root'
})
export class DhcSensorApiService extends DhcApiService {
  /** Endpoint for Logs */
  protected _serviceAddress: string;

  constructor(private http: HttpClient) {
    super(http);
    this._serviceAddress = this._apiRoot + environment.sensorEndpoint;
  }

  public getSensorLocationsByNumberOfReadings(): Observable<any> {
    return this._http.get<any>(`${this._serviceAddress}/locations`);
  }

  public getReadingsForLocation(location: string): Observable<any> {
    return this._http.get<any>(`${this._serviceAddress}/locations/${location}`, { params: { "location": location }});
  }
}
