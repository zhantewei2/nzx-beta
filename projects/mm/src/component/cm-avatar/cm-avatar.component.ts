import { Component, OnInit,Input,ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'cm-avatar',
  template:`
  <img *ngIf='!imgAddress;else img' src='assets/image/user.png' class='default'>
  <ng-template #img>
    <img class='full' [src]='imgAddress'/>
  </ng-template>
  <div *ngIf="badge" class="cm-avatar-badge"></div>
   <div *ngIf="badge" class="abs-br color-bg cm-avatar-brand">{{badge}}</div>
  `,
  host:{
    class:'inline-center cm-list-avatar'
  },
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CmAvatarComponent implements OnInit {
  @Input()badge:any;
  @Input()color:any='warn';
  @Input()icon:any='location2';
  @Input('img')imgAddress:string;
  ngDoCheck(){}
  constructor(){ }

  ngOnInit() {}

}
