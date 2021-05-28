import { Component, OnInit } from '@angular/core';
import { InformationLoaderComponent } from '../information-loader';
import { LifxApiService } from '../../services/lifx-api.service';
import { LightInfo, LightState, LifxCommand } from '../../../../../DHC.Web.Common/models/models';

import * as colorConverter from 'color-convert';

@Component({
  selector: 'app-lifx',
  templateUrl: './lifx.component.html',
  styleUrls: ['./lifx.component.css']
})
export class LifxComponent extends InformationLoaderComponent implements OnInit {
  public KnownLights: LightInfo[];
  public selectedColor: string;
  public get hsb() {
    return colorConverter.hex.hsv(this.selectedColor);
  }

  public loadingDetails: boolean = false;
  public focusOn: LightInfo;

  constructor(private api: LifxApiService) {
    super();
    this.KnownLights = [];
    this.selectedColor = '';
    this.focusOn = undefined;
  }

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

  public selectLight(light: LightInfo) {
    this.loadingDetails = true;
    console.log('Selected ' + light.LightName);

    this.focusOn = light;
    this.api.getLightState(light.LightName)
      .subscribe(detail => {
        this.loadingDetails = false;

        light.State = detail;
        let rgb = colorConverter.hsv.rgb(detail.Color.Hue, detail.Color.Saturation, detail.Color.Brightness);
        this.selectedColor = `#${colorConverter.rgb.hex(rgb)}`;

      }, err => this.loadingDetails = false);
  }

  public updateColor() {
    if (!this.focusOn) return;

    let command: LifxCommand = new LifxCommand();
    command.Lights = [this.focusOn.LightName];
    command.HsbColor = [this.hsb[0] / 1000, this.hsb[1] / 100, this.hsb[2] / 100, this.focusOn.State.Color.Kelvin];
    command.Duration = 1000;
    this.sendAndClearFocus(command);
  }

  public setPower() {
    if (!this.focusOn) return;

    let command: LifxCommand = new LifxCommand();
    command.Lights = [this.focusOn.LightName];
    command.Duration = 1000;

    if (this.focusOn.State.Power) {
      command.TurnOff = true;
    } else {
      command.TurnOn = true;
    }
    this.sendAndClearFocus(command);
  }

  /** Send the command to the API, but then clear the light from focus.
   * Quick workaround for not getting correct state until command finishes */
  private sendAndClearFocus(command: LifxCommand) {
    this.api.sendCommand(command).subscribe(() => this.focusOn = undefined, err => console.log(err));
  }
}
