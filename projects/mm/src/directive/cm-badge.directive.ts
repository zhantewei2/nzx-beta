import { Directive,Input,ElementRef} from '@angular/core';

@Directive({
  selector: '[cm-badge]',
  host:{
    class:'cm-badge-light mt-1 ellipsis2'
  }
})
export class CmBadgeDirective{
  el:HTMLElement;
  closeElement:any;
  closeExists:boolean;
  activeReg:RegExp=/cm-badge-[^-]*?-active/g;
  @Input()type='accent';
  @Input('cm-badge')set active(val:boolean){
    let className:string=this.el.className;
    if(val){
      className.replace(this.activeReg,'');
      this.el.classList.add(`cm-badge-${this.type}-active`);
      let closeEl:any;
      if(this.closeElement){
        closeEl=this.closeElement
      }else{
        closeEl=this.closeElement=document.createElement('span');
        closeEl.className='d-block cm-an_fadeIn';
        closeEl.innerHTML=`
          <span class="cm-badge-close"></span>
          <span class="cm-badge-close-icon material-icons">close</span>
        `;
      }
      this.el.appendChild(closeEl);
      this.closeExists=true;
    }else{
      if(this.closeExists&&this.closeElement){
        this.el.removeChild(this.closeElement);
        this.closeExists=false;
      }
      this.el.className=this.el.className.replace(this.activeReg,'');
    }
  }

  constructor(
    private elRef:ElementRef
  ){
    this.el=elRef.nativeElement;
  }
  ngOnInit(){}
}
