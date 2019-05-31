import { Component, OnInit ,Input,ElementRef} from '@angular/core';

@Component({
  selector: 'cm-line',
  template:`
<div class="cm-line-brand" *ngIf="brand||brand===''"></div>
<div 
  class="flex-1"
  [ngClass]="[
    bold||bold===''?'font-b':'',
    sm||sm===''?'font-sm':'',
    lg||lg===''?'font-lg':'',
    muted||muted===''?'color-muted':'',
    between||between===''?'between':''
  ]"
>
  <ng-content></ng-content>
</div>
  `,
  host:{
    'class':"cm-line"
  }
})
export class CmLineComponent implements OnInit {
  @Input()brand:any;
  @Input()between:any;
  @Input()set bottom(val:any){
    if(val||val===''){
      this._el.nativeElement.classList.add('cm-light-bottom');
    }
  }
  @Input()set light(val:any){
    if(val||val===''){
      this._el.nativeElement.classList.add('bg-bg')
    }
  }
  @Input()bold:any;
  @Input()sm:any;
  @Input()lg:any;
  @Input()muted:any;
  constructor(
    private _el:ElementRef
  ) { }

  ngOnInit() {
  }

}
