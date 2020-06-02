import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DhcApiService } from './dhc-api.service';

@Injectable({
  providedIn: 'root'
})
export class DhcPortalApiService extends DhcApiService {
  /** Endpoint for Logs */
  protected _serviceAddress: string;

  constructor(private http: HttpClient) {
    super(http);
    this._serviceAddress = this._apiRoot + environment.portalEndpoint;
  }

  /**
   * Get all AccessLog records from the API.
   */
  public getLogs(): Observable<any> {
    return this._http.get<any>(this._serviceAddress);
  }

  /**
   * Look up all AccessLog records from the API for a specific door.
   * @param portalName Name of access portal argument
   */
  public getLogForPortal(portalName: string): Observable<any> {
    // User requested specific portal name so get that one
    return this._http.get<any>(`${this._serviceAddress}/${portalName}`);
  }
}
