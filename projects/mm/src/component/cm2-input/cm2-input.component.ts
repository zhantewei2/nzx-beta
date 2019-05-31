import { Component,OnInit,Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';

@Component({
  selector: 'cm-input',
  templateUrl: './cm2-input.component.html',
  host:{
      class:'cm2-line-input-wrapper flex'
  }
})
export class Cm2InputComponent implements OnInit {
    value:any;
    @Input()color:'p'|'blue'|'accent'='p';
    @ViewChild('input')input:any;
    @Input()placeholder:string='';
    @Input()autoFocus:boolean;
    @Input()prefix:string;
    @Input()set cmValue(val:any){
        this.value=val;
    }
    @Output('cmValueChange')cmValueChange:any=new EventEmitter();

    valueChange(v:any){
        this.cmValueChange.emit(v);
    }
    node:HTMLElement;
  constructor(
      private _el:ElementRef,

  ){
      this.node=_el.nativeElement;
  }
  ngOnInit() {
        if(this.autoFocus)this.input.nativeElement.focus();

  }

}
