import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cm-line-content',
  template:`
  <div class="center flex-1">
    <div class="cm-com-line"></div>
  </div>
    <div class="mx-2 color-muted font-sm">
      <ng-content></ng-content>
    </div>
  <div class="center flex-1">
     <div class="cm-com-line"></div>
  </div>
  `,
  styleUrls: ['./cm-line-content.component.css'],
  host:{
    class:'flex'
  }
})
export class CmLineContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
