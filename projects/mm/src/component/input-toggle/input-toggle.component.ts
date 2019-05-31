import { Component,OnInit,EventEmitter,Input,Output} from '@angular/core';

@Component({
  selector: 'cm-input-toggle',
  template:`
 <span class="cm-inputToggle-item font-sm center">
    <ng-content select="[slotLeft]"></ng-content>
  </span>
  <span class="cm-inputToggle-item font-sm center">
   <ng-content select="[slotRight]"></ng-content>  
  </span>
  <div [style.left]="cmSelect?'50%':'0%'" class="cm-inputToggle-bar">
  </div>
  `,
  host:{
    class:'cm-inputToggle color-secondary',
    '(click)':'toggle()'
  }
})
export class InputToggleComponent implements OnInit {
  @Input()cmSelect:any;
  @Output('cmSelectChange')cmSelectChange:EventEmitter<any>=new EventEmitter<any>();
  constructor(){}

  ngOnInit(){}

  toggle(){
    this.cmSelectChange.emit(this.cmSelect=!this.cmSelect);
  }
}
