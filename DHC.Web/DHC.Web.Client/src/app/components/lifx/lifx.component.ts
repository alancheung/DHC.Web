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
  public arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };

  public selectedColor: string = 'color1';
  public color1: string = '#2889e9';
  public color2: string = '#e920e9';
  public color3: string = '#fff500';
  public color4: string = 'rgb(236,64,64)';
  public color5: string = 'rgba(45,208,45,1)';
  public color6: string = '#1973c0';
  public color7: string = '#f200bd';
  public color8: string = '#a8ff00';
  public color9: string = '#278ce2';
  public color10: string = '#0a6211';
  public color11: string = '#f2ff00';
  public color12: string = '#f200bd';
  public color13: string = 'rgba(0,255,0,0.5)';
  public color14: string = 'rgb(0,255,255)';
  public color15: string = 'rgb(255,0,0)';
  public color16: string = '#a51ad633';
  public color17: string = '#666666';
  public color18: string = '#ff0000';

  public KnownLights: LightInfo[];

  constructor(private api: LifxApiService) { super(); }

  ngOnInit(): void {
    this.api.getDiscoveredLights()
      .subscribe(lights => {
        this.loading = false;
        this.KnownLights = lights.sort((a, b) => a.LightName.localeCompare(b.LightName));
      }, err => this.loading = false);
  }

  discover(): void {
    this.loading = true;

    this.api.discover()
      .subscribe(lights => {
        this.loading = false;
        this.KnownLights = lights.sort((a, b) => a.LightName.localeCompare(b.LightName));
      }, err => this.loading = false);
  }
 
}
