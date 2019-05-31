import { Component, Input,OnInit,Output,EventEmitter,HostBinding} from '@angular/core';
import {fade} from '../../animate/animate';

@Component({
  selector: 'cm-error',
  template:`
<div (click)="refresh.emit()" [ngClass]="!top?'abs-center':'abs-center-top'" class="center-column none-tap">
   <div class="cm2-page-err-block cm-an_popMin">
    <img src="assets/image/cm-err.png" />
  </div>
  <p class="align-center cm2-page-err-text">{{errMessage||defaultErr}}</p>
  <div>
  
  </div>
</div>
  `,
  host:{
    class:'cm-error-block'
  },
  animations:[fade]
})
export class CmErr2Component implements OnInit {
  @HostBinding('@Fade')fade:boolean;
  @Output('refresh')refresh:EventEmitter<any>=new EventEmitter<any>();
  constructor() { }
  defaultErr='网络不小心出错啦!';
  @Input()errMessage:string='';
  @Input()top:boolean;
    @Input()err:string;
  ngOnInit(){

  }

}
