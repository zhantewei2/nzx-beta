import { Component, OnInit,ViewChild} from '@angular/core';
import {fade2} from '../../animate/animate';

@Component({
  selector: 'cm-side-right',
  template:`
  <div (click)="close()" [@Fade2]="isOpen?'show':'hid'" #content class="cm-sideRight">
    <div (click)="$event.stopPropagation()"
     [class.cm-right-toggle]="!isOpen"  class="cm-sideRight-content flex-column cm-an_RightEnter">
      <div class="cm-sideRight-header">
        <ng-content select="[slotHeader]"></ng-content>
      </div>
      <div class="flex-1 cm-sideRight-body">
        <ng-content select="[slotBody]"></ng-content>
      </div>
      <div class="cm-sideRight-bottom">
        <ng-content select="[slotBottom]"></ng-content>
      </div>
    </div>
  </div>
  `,
  animations:[fade2]
})
export class CmSideRightComponent implements OnInit {
  @ViewChild('content')content:any;
  body:any;
  cache:any;
  constructor() {
    this.body=document.body;
  }
  isOpen:boolean;
  ngOnInit() {
  }
  open(){
    if(this.isOpen)return;
    if(!this.cache)this.body.appendChild(this.content.nativeElement);
    this.isOpen=true;
  }
  close(){
    if(this.isOpen)this.isOpen=false;
  }
  toggle(){
    this.isOpen?this.close():this.open();
  }
}
