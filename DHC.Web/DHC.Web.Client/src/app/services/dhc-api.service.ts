import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class DhcApiService {
  /** Private HTTP Client */
  protected _http: HttpClient;

  /** Root address for API */
  protected _apiRoot: string;

  /** Address modifier for routing */
  protected abstract _serviceAddress: string;

  constructor(http: HttpClient) {
    this._http = http;
    this._apiRoot = environment.apiEndpoint;
  }
}
