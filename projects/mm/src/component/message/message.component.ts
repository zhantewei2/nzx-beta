import {ChangeDetectionStrategy, Component, OnInit,ChangeDetectorRef} from '@angular/core';
import {slideDown} from '../../animate/animate';

export interface MessageItem{
  content:string;
  type?:string;
  index?:number;
}


@Component({
  selector: 'cm-message',
  template:`
<div [@SlideDown] *ngFor="let i of arr" class="cm-message center ">
    <div class="cm-message-wrapper cm-message-{{i.type}}">
        <span class="align-center flex-1"> {{i.content}}</span>
     </div>
</div> 
  `,
  animations:[slideDown],
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit{
  arr:Array<MessageItem>=[];
  constructor(
      private _cdr:ChangeDetectorRef
  ){}
  ngOnInit(){}
  index:number=0;
  icons:any={
    'primary':'info',
    'success':'done',
    'warn':'warning'
  };
  show(type,content){
    type=type||'primary';
    const item={
      type:type,
      content,
      icon:this.icons[type]
    };
    this.arr.push(item);
    this._cdr.markForCheck();
    setTimeout(()=>{
      this.arr.splice(this.arr.indexOf(item),1);
      this._cdr.markForCheck();
    },1400)
  }
}
