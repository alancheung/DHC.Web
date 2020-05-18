import { Component, OnInit } from '@angular/core';
import { DhcApiService } from 'src/app/services/dhc-api.service';
import { Observable, Subject } from 'rxjs';
import { InformationLoader } from '../information-loader';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.css']
})
export class DoorsComponent implements OnInit, InformationLoader {
  public displayAll: boolean = false;
  public loading: boolean = true;
  public logs: any[];

  public latestRecord: any;

  constructor(private api: DhcApiService) {
    this.logs = [];
  }

  ngOnInit(): void {
    this.loadLogs('OfficeDoor')
  };

  private loadLogs(portalName: string): void {
    this.loading = true;
    this.api.getLogForPortal(portalName).subscribe((data: any[]) => {
      this.loading = false;
      data.forEach(d => d.datetime = new Date(d.eventtime));
      this.logs = data;
      this.latestRecord = this.logs[0];
    }, err => {
      this.loading = false;
      console.error(err);
    });
  }

  public onShowAllClick() {
    this.loadLogs('');
  }
}
