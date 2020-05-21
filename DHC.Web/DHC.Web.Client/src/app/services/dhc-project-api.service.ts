import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DhcApiService } from './dhc-api.service';
import { Project } from '../../SQLite/tables/Project';
import { Todo } from '../../SQLite/tables/Todo';

@Injectable({
  providedIn: 'root'
})
export class DhcProjectApiService extends DhcApiService {
  /** Endpoint for Logs */
  protected _serviceAddress: string;

  constructor(private http: HttpClient) {
    super(http);
    this._serviceAddress = this._apiRoot + environment.projectEndpoint;
  }

  public getProjects(): Observable<Project[]> {
    return this._http.get<Project[]>(this._serviceAddress);
  }

  public getDetails(projectId: number): Observable<Todo[]> {
    let address = `${this._serviceAddress}/${projectId.toString()}`;
    return this._http.get<Todo[]>(address);
  }
}
