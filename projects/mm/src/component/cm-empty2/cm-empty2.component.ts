import { HostBinding,Component, OnInit,Output,EventEmitter,Input} from '@angular/core';
import {fade} from '../../animate/animate';
@Component({
  selector: 'cm-empty',
  template:`
<div class="abs-center none-tap"
[ngClass]="top?'abs-center-top':'abs-center'"
(click)="refresh.emit()">
 <div class="cm2-page-err-block cm-an_popMin">
    <img src="assets/image/cm-empty.png"/>
  </div>
  <p class="align-center cm2-page-err-text">{{emptyMessage||defaultMsg}}</p>
 
</div>
  `,
  host:{
    class:'cm-empty-block'
  },
  animations:[fade]
})
export class CmEmpty2Component implements OnInit {
  defaultMsg:string='太低调了,一条数据都没有';
  @Input()emptyMessage:string='暂无数据';
  @Input()top:boolean;
  @HostBinding('@Fade')fade:any;
  @Output('refresh')refresh:EventEmitter<any>=new EventEmitter<any>();
  constructor() {

  }
  ngOnInit() {}
}
