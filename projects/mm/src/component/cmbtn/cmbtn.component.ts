import { Component,Input,Directive,ElementRef} from '@angular/core';
import {ToolService} from '../../service/tool.service';
import {ClassMethod} from '../../util/component';

@Directive({
  selector:'cm-btn,cm-pure-btn,cm-outline-btn,cm-border-btn',
})
export class CmBtnDirective{
  @Input()set disabled(val:any){
    this._tool.toggleCss(this.node,'disabled',val===''||val);
  }
  @Input()set block(val:any){
    this._tool.toggleCss(this.node,'btn-block',val===''||val);
    this.rippleOpts.fontSize=30;
  };
  @Input()set sm(val:any){
    this._tool.toggleCss(this.node,'btn-sm',val===''||val);
  }
  @Input()set md(val:any){
    this._tool.toggleCss(this.node,'btn-md',val===''||val);
  }
  @Input()set full(val:any){
    this._tool.toggleCss(this.node,'btn-full',val===''||val);
  };
  @Input()set round(val:any){
    this._tool.toggleCss(this.node,'btn-round',val===''||val);
  }

  node:any;
  rippleOpts:any={};
  constructor(
    private _el:ElementRef,
    private _tool:ToolService
    ){
    this.node=_el.nativeElement;
    this.node.classList.add('cm-btn');
    const nodeName:string=this.node.nodeName;
    if(nodeName=='CM-OUTLINE-BTN'){
      setTimeout(()=>{
        _tool.ripple(this.node.children[0],this.rippleOpts);
      })
    }else{
      if(nodeName=='CM-BTN')this.rippleOpts.light=true;
      _tool.ripple(this.node,this.rippleOpts);
  
    }
  }
  ngOnInit(){}
}

@Component({
  selector: 'cm-btn',
  template:`
<ng-content></ng-content>
  `,
})
export class CmbtnComponent extends ClassMethod{
  @Input()set color(val:string){
    this.replaceClass('color','solid-btn-'+val);
  }
  @Input()wm:any;
  @Input()set noShadow(val:any){

  }
  constructor(public el:ElementRef){
    super();
  }
  ngOnInit(){
    if(!this.store.color)this.color='wm';
  }

}
@Component({
  selector:'cm-pure-btn',
  template:`
<ng-content></ng-content>
  `,
  host:{
    class:'btn-pure'
  }
})
export class CmPureBtnComponent extends ClassMethod{
  @Input()disabled:any;

  @Input()set color(val:string){
    //this.el.nativeElement.classList.add(`pure-btn-${val}`);
    this.replaceClass('color',`pure-btn-${val}`);
  }
  constructor(
    public el:ElementRef
  ){super()};
  ngOnInit(){
    if(!this.store.color)this.color='p';
  }
}

@Component({
  selector:'cm-outline-btn',
  template:`
<div class='fineBorder'>
</div>
<ng-content></ng-content> 
`,
  host:{
    class:'btn-outline'
  }
})
export class CmOutlineComponent extends ClassMethod{
  @Input()disabled:any;
  @Input()set active(val:boolean){
    this.toggleClass('active',val);
  };
  @Input()set color(val:string){
    this.replaceClass('color',`outline-btn-${val}`);
  }
  constructor(
    public el:ElementRef
  ){
    super()
  }
}

@Component({
  selector:'cm-border-btn',
  template:`
<ng-content></ng-content>
  `,
  host:{
    class:'btn-border'
  }
})
export class CmBorderComponent extends ClassMethod{
  @Input()set color(val:string){
    this.replaceClass('color',`btn-border-${val}`);
  }
  constructor(
    public el:ElementRef
  ){
    super();
  }
  ngOnInit(){
    if(!this.store.color)this.color='darken';
  }
}