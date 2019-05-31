import { Directive,Input,ElementRef} from '@angular/core';

@Directive({
  selector: '[ztw-avatar-header]'
})
export class AvatarHeaderDirective {
    hasInner:boolean;
    @Input('ztw-avatar-header') set bg(val:any){
        if(!val){
            this.node.classList.add('cm-none-avatar');
            this.node.innerHTML=`<i class="fa fa-head"></i>`;
            this.hasInner=true;
        }else{
            if(this.hasInner){
                this.node.innerHTML='';
                this.node.classList.remove('quick-none-avatar');
                this.hasInner=false;
            }
            this.node.style.backgroundImage=`url(${val})`;
        }
    }
  node:any;
  constructor(
      private el:ElementRef
  ){
      this.node=el.nativeElement;
  }
}
