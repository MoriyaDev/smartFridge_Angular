import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-project-overview',
  imports: [],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.css',
  encapsulation: ViewEncapsulation.None

})
export class ProjectOverviewComponent implements OnInit {
  
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.loadCSS();
  }

  loadCSS() {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/project-overview.component.css'; // נתיב נכון ל-CSS
    this.renderer.appendChild(document.head, link);
  }
}