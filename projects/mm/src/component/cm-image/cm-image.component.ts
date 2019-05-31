import {Directive, ElementRef,OnInit,Input,ChangeDetectionStrategy} from '@angular/core';

@Directive({
  selector:'[cm-img]',
  host:{
    class:'cm-cover-image'
  },
})
export class CmImageComponent implements OnInit {
  @Input()imgLoad:boolean;
  @Input('cm-img')set src(val:any){

    if(!val)return;

    const img=new Image();
    if(this.imgLoad){
      this.el.classList.add('loading');
      this.el.innerHTML=`<span><i class="fa fa-loading cm-an-circle"></i></span>`;
    }
    const end=()=>{

      if(this.imgLoad){
        this.el.classList.remove('loading');
        this.el.innerHTML='';
      }

      this.el.style.backgroundImage=`url("${val}")`;

    };
    img.onload=end;
    img.src=val;

  };
  el:HTMLElement;
  constructor(
      private _el:ElementRef
  ){
      this.el=_el.nativeElement;
  }

  ngOnInit(){}

}
