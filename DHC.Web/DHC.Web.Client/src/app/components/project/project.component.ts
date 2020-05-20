import { Component, OnInit } from '@angular/core';
import { Project } from '../../../SQLite/tables/Project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public activeProjects: Project;

  constructor() { }

  ngOnInit(): void {

  }
}
