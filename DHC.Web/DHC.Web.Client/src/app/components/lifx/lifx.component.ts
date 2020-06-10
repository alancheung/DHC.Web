import { Component, OnInit } from '@angular/core';
import { InformationLoaderComponent } from '../information-loader';
import { LifxApiService } from '../../services/lifx-api.service';
import { LightInfo } from '../../../../../DHC.Web.Common/models/models';

@Component({
  selector: 'app-lifx',
  templateUrl: './lifx.component.html',
  styleUrls: ['./lifx.component.css']
})
export class LifxComponent extends InformationLoaderComponent implements OnInit {
  public KnownLights: LightInfo[];

  constructor(private api: LifxApiService) { super(); }

  ngOnInit(): void {
    this.api.getDiscoveredLights()
      .subscribe(lights => {
        this.loading = false;
        this.KnownLights = lights.sort((a, b) => a.LightName.localeCompare(b.LightName));
      });
  }

  discover(): void {
    this.loading = true;

    this.api.discover()
      .subscribe(lights => {
        this.loading = false;
        this.KnownLights = lights.sort((a, b) => a.LightName.localeCompare(b.LightName));
      });
  }
 
}
