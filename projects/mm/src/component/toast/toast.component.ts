import {ChangeDetectionStrategy, Component, OnInit,ChangeDetectorRef,OnDestroy} from '@angular/core';
import {toast} from '../../animate/animate';
import {ToolService} from '../../service/tool.service';


const toastAutoTime=300;

export interface State{
  status:'loading'|'completed';
  content:string;
}


@Component({
  selector: 'cm-toast',
  template:`
<div [@Toast]="show?'show':'hidden'" class="cm-modalBg-toast center">
  <div [class.cm-an_popMin]="show" class="cm-modalToast">
    <div class="cm-toast-status" [class.cm-an_LeftEnter]="show">
      <ztw-load2 *ngIf="status==='loading'"></ztw-load2>
      <i *ngIf="status==='error'" class="cm-toast-icon cm-an_pop fa fa-error2">error_outline</i>
      <i *ngIf="status==='completed'" class="cm-toast-icon cm-an_pop fa fa-done">done_outline</i>
    </div>
    <span [class.cm-an_RightEnter]="show" class="mt-2 cm-toast-content">{{content}}</span>
   </div>
</div>
  `,
  animations:[toast],
  styleUrls: ['./toast.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnInit,OnDestroy{
  show:boolean=false;
  open(state:State){
    this.clearClose();
    this.show=true;
    this.setState(state);
    this._cdr.markForCheck();
  }
  close(){
    this.show=false;
    this._cdr.markForCheck();
  }

  status:string='loading';
  routerSub:any;
  constructor(
    private _cdr:ChangeDetectorRef,
    private _tool:ToolService
  ) {
    this.routerSub=this._tool.routerChange.subscribe(()=>{
      if(this.show)this.close();
    })

  }
  content:string;
  ngOnInit() {}
  ngOnDestroy(){
    this.routerSub.unsubscribe();
  }
  clearClose=()=>{
    if(this.nextClose){
      clearTimeout(this.nextClose);
      this.nextClose=null;
    }
  };
  nextClose:any;

  setState(state:State){
    this.status=state.status;
    this.content=state.content;

    if(this.status==='completed'||this.status==='error'){
      this.nextClose=setTimeout(()=>{
        this.close();
        this.nextClose=null;
        this._cdr.markForCheck();
      },toastAutoTime)
    }
  }
}
