import { Component, OnInit,ViewChild,Input,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import {snack} from '../../animate/animate';


@Component({
  selector: 'cm-snack',
  template:`
<div #bar [@Snack]='isOpen?"show":"hid"'  class='cm-snack-wrapper'>
  <div class='cm-snack flex'>
    <span class='center'>
      <i class='fa fa-i-{{type}} mr-4 fa-2x color-{{type}}'></i>
    </span>
    <div class='flex-1'>{{content}}</div>
    <div class='ml-4 color-muted' (click)='close()'>
      <i class='fa fa-close'></i>
    </div>
  </div>
</div>  
  `,
  animations:[snack],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CmSnackComponent implements OnInit {
  @ViewChild('bar')bar:any;
  constructor(
    private _cdr:ChangeDetectorRef
  ){}
  @Input()type:string='warn';
  content:string='content'
  ngOnInit(){
    document.body.appendChild(this.bar.nativeElement);
  }
  isOpen:boolean;
  closeTimeout:any;;
  open(msg:string,type:'warn'|'success'='warn',autoClose?:number){
    this.content=msg;
    this.type=type;
    this._cdr.markForCheck();
    if(!this.isOpen){
      this.isOpen=true;
      this.clearTimeout();
      if(autoClose){
        this.closeTimeout=setTimeout(()=>this.close(),autoClose);
      }
    }
  }
  clearTimeout(){
    if(this.closeTimeout)clearTimeout(this.closeTimeout);
    this.closeTimeout=null;
  }
  close(){
    this._cdr.markForCheck();
    this.clearTimeout();
    if(this.isOpen)this.isOpen=false;
  }
  ngOnDestroy(): void {
    document.body.removeChild(this.bar.nativeElement);
  }
}
