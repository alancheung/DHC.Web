import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { DoorsComponent } from './components/doors/doors.component';
import { IndexComponent } from './components/index/index.component';
import { SensorComponent } from './components/sensor/sensor.component';
import { LoadingDirective } from './directives/loading/loading.directive';
import { LoadingComponent } from './directives/loading/loading.component';
import { LifxComponent } from './components/lifx/lifx.component';

@NgModule({
  declarations: [
    AppComponent,
    DoorsComponent,
    IndexComponent,
    SensorComponent,
    LoadingDirective,
    LoadingComponent,
    LifxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    ColorPickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
