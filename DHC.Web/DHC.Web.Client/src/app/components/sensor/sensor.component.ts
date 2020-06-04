import { Component, OnInit } from '@angular/core';
import { InformationLoaderComponent } from '../information-loader';
import { DhcSensorApiService } from '../../services/dhc-sensor-api.service';
import { ISensorLocationByCount } from '../../../../../DHC.Web.Common/models/models';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent extends InformationLoaderComponent implements OnInit {
  public sensorLocations: ISensorLocationByCount[];

  constructor(private api: DhcSensorApiService) {
    super();
  }

  ngOnInit(): void {
    this.api.getSensorLocationsByNumberOfReadings().subscribe(locations => {
      this.sensorLocations = locations;
      this.loading = false;
    }, err => {
        console.log(err);
        this.loading = false;
    });
  }

  public loadReadingsFor(location: string) {
    this.api.getReadingsForLocation(location).subscribe(readings => {
      console.log(readings);
    })
  }

}
