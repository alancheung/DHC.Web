import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DhcApiService {
  public apiRoot: string;
  public accessLogEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiEndpoint;
    this.accessLogEndpoint = environment.apiEndpoint + environment.accessEndpoint;
  }

  /**
   * Get all AccessLog records from the API.
   */
  public getLogs(): Observable<any>{
    return this.http.get<any>(this.accessLogEndpoint);
  }

  /**
   * Look up all AccessLog records from the API for a specific door.
   * @param portalName Name of access portal argument
   */
  public getLogForPortal(portalName: string): Observable<any> {
      // User requested specific portal name so get that one
      return this.http.get<any>(`${this.accessLogEndpoint}/${portalName}`);
  }
}
