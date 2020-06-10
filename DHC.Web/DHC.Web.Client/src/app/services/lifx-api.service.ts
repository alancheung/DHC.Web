import { Injectable } from '@angular/core';
import { DhcApiService } from './dhc-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LifxApiService extends DhcApiService {
  protected _serviceAddress: string;
  private _sequenceEndpoint: string;

  constructor(private http: HttpClient) {
    super(http);
    this._serviceAddress = this._apiRoot + 'api/lifx';
    this._sequenceEndpoint = this._apiRoot + 'api/lifx/sequence';
  }

  public getDiscoveredLights(): string[] {
    this._http.get(this._serviceAddress);

    return [];
  }
}
