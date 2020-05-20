import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DoorsComponent } from '../components/doors/doors.component';
import { IndexComponent } from '../components/index/index.component';
import { ProjectComponent } from '../components/project/project.component';

/**
 * Application routes available.
 */
const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'doors', component: DoorsComponent },
  { path: 'projects', component: ProjectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
