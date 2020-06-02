import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { InformationLoaderComponent } from '../information-loader';
import { nameof } from '../../../common/nameof';
import { AccessLog } from '../../../SQLite/tables/AccessLog';
import { DhcPortalApiService } from '../../services/dhc-log-portal.service';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.css']
})
export class DoorsComponent extends InformationLoaderComponent implements OnInit {
  public displayAll: boolean = false;
  public loading: boolean = true;
  public logs: any[];

  public latestRecord: any;

  constructor(private api: DhcPortalApiService) {
    super();
    this.logs = [];
  }

  ngOnInit(): void {
    this.loadLogs('OfficeDoor')
  };

  private loadLogs(portalName: string): void {
    this.loading = true;
    this.api.getLogForPortal(portalName)
      .subscribe((data: any[]) => {
      this.loading = false;
      this.logs = data.map(d => new AccessLog(d));
      this.latestRecord = portalName == '' ? undefined : this.logs[0];
    }, err => {
      this.loading = false;
      console.error(err);
    });
  }

  public onShowAllClick() {
    this.loadLogs('');
  }
}
