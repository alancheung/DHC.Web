import { Component, OnInit } from '@angular/core';
import { DhcProjectApiService } from '../../services/dhc-project-api.service';
import { InformationLoaderComponent } from '../information-loader';
import { Project, Todo } from '../../../../../DHC.Web.Common/SQLite/tables';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent extends InformationLoaderComponent implements OnInit {
  public activeProjects: Project[];

  constructor(private api: DhcProjectApiService) { super(); }

  ngOnInit(): void {
    this.api.getProjects()
      .subscribe(val => {
        this.activeProjects = val;
      });
  }

  public onExpandClick(project: Project): void {
    this.api.getDetails(project.ID)
      .subscribe(deets => {
        project.Tasks = deets;
      });
  }
}
