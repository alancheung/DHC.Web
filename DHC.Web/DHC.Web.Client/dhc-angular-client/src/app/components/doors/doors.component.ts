import { Component, OnInit } from '@angular/core';
import { DhcApiService } from 'src/app/services/dhc-api.service';
import { Observable, Subject } from 'rxjs';
import { InformationLoader } from '../information-loader';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.css']
})
export class DoorsComponent  implements OnInit, InformationLoader {
  public loading: boolean = true;
  public logs: any[];

  public latestRecord: any;

  constructor(private api: DhcApiService) { }

  ngOnInit(): void {
    this.api.getLogs().subscribe((data: any[]) => {
      this.loading = false;

      let lastTime: Date;
      data.forEach(d => {
        d.datetime = new Date(d.eventtime);
        if (!lastTime || (d.datetime >= lastTime && d.name == 'Office')){
          this.latestRecord = d;
          lastTime = d.eventtime;
        }
      }, err => {
        console.error(err);
        this.loading = false;
      });

      this.logs = data;
    });
  }

}
