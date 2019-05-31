import { Component, OnInit,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {ClassMethod} from '../../util/component';
import {closePop,fade2} from '../../animate/animate';

export class BaseFormComponent extends ClassMethod implements ClassMethod{
  constructor(){
    super();
  }
  @Input()cmSelect:boolean;
  @Input()disabledTap:boolean;
  @Input()set disabled(val:any){
    this._disabled=val===''||val;
  }
  _disabled:boolean;
  throttle:any;
  @Output('cmSelectChange')cmSelectChange:EventEmitter<any>=new EventEmitter<any>();
  toggle(){
    if(this.disabledTap||this._disabled||this.throttle)return;
    this.throttle=setTimeout(()=>this.throttle=null,300);
    this.cmSelectChange.emit(this.cmSelect=!this.cmSelect);
    this.appendEffect();
  }
  EFFECT_NAME:string='cm-form-effect';
  hasEffect:boolean;
  rmeoveEffect(){
    if(this.hasEffect){
      this.el.nativeElement.classList.remove(this.EFFECT_NAME);
      this.hasEffect=false;
    }
  }
  appendEffect(){
    this.rmeoveEffect();
    this.el.nativeElement.classList.add(this.EFFECT_NAME);
    this.hasEffect=true;
    setTimeout(()=>this.rmeoveEffect(),300);
  }
}


@Component({
  selector: 'cm-radio',
  template:`
  <i [@ClosePop]='cmSelect?"show":"hid"'  class='cm-radio-center'></i>
  
  `,
  host:{
    class:'cm-radio-wrapper',
    '(click)':'toggle()'
  },
  animations:[closePop]
})
export class CmRadioComponent extends BaseFormComponent{
  @Input()set color(val:string){
    this.replaceClass('color','cm-radio-theme-'+val);
  }
  constructor(public el:ElementRef) {
    super();
  }
  ngOnInit(){
    if(!this.store.color)this.color='light';
  }

}


@Component({
  selector:'cm-check',
  template:`
  <i [@ClosePop]='cmSelect?"show":"hid"' class='fa fa-done'></i>
  `,
  host:{
    class:'cm-check-wrapper',
    '(click)':'toggle()'
  },
  animations:[closePop]
})
export class CmCheckComponent extends BaseFormComponent{
  @Input()set color(val:string){
    this.replaceClass('color','cm-radio-theme-'+val);
  }
  constructor(public el:ElementRef){
    super();
  }
  ngOnInit(){
    if(!this.store.color)this.color='light';
  }
}

@Component({
  selector:'cm-slider',
  template:`
    <div [@Fade2]='cmSelect?"show":"hid"' class='cm-slider-bg'></div>
    <i class='cm-slider-center' [class.active]='cmSelect'></i>
  `,
  host:{
    class:'cm-slider-wrapper',
    '(click)':'toggle()'
  },
  animations:[
    fade2
  ]
})
export class CmSliderComponent extends BaseFormComponent{
  @Input()set color(val:string){
    this.replaceClass('color','cm-radio-theme-'+val);
  }
  constructor(public el:ElementRef){
    super();
  }
  ngOnInit(){
    if(!this.store.color)this.color='light';
  }
}
