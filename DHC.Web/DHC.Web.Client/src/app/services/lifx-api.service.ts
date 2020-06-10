import { Injectable } from '@angular/core';
import { DhcApiService } from './dhc-api.service';
import { HttpClient } from '@angular/common/http';
import { LightInfo } from '../../../../DHC.Web.Common/models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LifxApiService extends DhcApiService {
  protected _serviceAddress: string;
  private _sequenceEndpoint: string;
  private _discoverEndpoint: string;

  constructor(private http: HttpClient) {
    super(http);
    this._serviceAddress = this._apiRoot + '/api/lifx';
    this._sequenceEndpoint = this._apiRoot + '/api/lifx/sequence';
    this._discoverEndpoint = this._apiRoot + '/api/lifx/discover';
  }

  public getDiscoveredLights(): Observable<LightInfo[]> {
    return this._http.get<LightInfo[]>(this._discoverEndpoint);
  }

  public discover(): Observable<LightInfo[]> {
    return this._http.post<LightInfo[]>(this._discoverEndpoint, { });
  }
}
