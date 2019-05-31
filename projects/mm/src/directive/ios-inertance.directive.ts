import { Directive ,ElementRef,Input} from '@angular/core';
import {ToolService} from '../service/tool.service';

const basea:number=1,maxSpeed:number=80;

@Directive({
  selector: '[ztw-ios-inertance]'
})
export class IosInertanceDirective {
  @Input('ztw-ios-inertance')set inertance(val:any){
    if(val!==false)this.tool.iosInertance(this._el.nativeElement);
  }
  constructor(
    private _el:ElementRef,
    private tool:ToolService
  ){}
}

