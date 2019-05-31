import {Component, Input,Output,EventEmitter,forwardRef,ViewChild,TemplateRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {fade} from '../../animate/animate';
import {inputMaxLength} from '../component.config';

@Component({
  selector:'cm-search-input',
  template:`
<div (click)="stop($event)"
         [ngClass]="[
    size?'cm2-input-size-'+size:'',
    isFocus?'active':'',
    'input-'+type
  ]"
#containerRef
 class="cm-input-container center">
    <i *ngIf="prefixIcon" 
       class='cm-input-prefix fa'
      [ngClass]="['fa-'+prefixIcon]"
    ></i>
      <div class="input-wrapper">
        <input
          [maxLength]="maxLength"
          style="vertical-align: top;"
          [type]="inputType"
          #inputRef
          [disabled]="disabled||disabled===''"
          (focus)="_focus()" (blur)="_blur()" [(ngModel)]="value"
          (ngModelChange)="changeValue($event)"
          (keydown)="keydown($event)"
        />
        <div [@Fade] *ngIf="!value&&!isFocus" class="input-placeholder">{{placeholder}}</div>
      </div>
      <span class="input-close cm-an_pop" (click)="clear2()" *ngIf="(clearable||clearable==='')&&value">
          <i  class="fa fa-close-border"></i>
      </span>
      <i class='cm-input-suffix fa fa-{{suffixIcon}}' *ngIf='suffixIcon'></i>
      <span *ngIf="suffix" class="cm-input-suffix">
      <ng-container *ngTemplateOutlet="suffix"></ng-container>
  </span>
  <div *ngIf="disTouch" class="full abs-tl input-disTouch-cover">
    
  </div>
  </div>
  `,
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>CmSearchInputComponent),multi:true
    }
  ],
  animations:[fade],
  host:{
    class:'none-tap'
  }
})

export class CmSearchInputComponent{
  isFocus:boolean;
  value:any;
  toFocus(){

    this.inputRef&&this.inputRef.nativeElement.focus();
  }
  @Input()maxLength:number=inputMaxLength;
  @Input()inputType:string;
  @Input()disTouch:boolean;
  @Input()type:'primary'|'secondary'|'thirdly'='primary';
  @ViewChild('inputRef')inputRef:any;
  @ViewChild('containerRef')containerRef:any;
  parentNode:any;
  placeNode:any;
  @Input()disabled:any;
  @Input()size:'sm'|'lg';
  @Input()autoTop:any;
  @Input()autoComplete:boolean;
  @Input()prefixIcon:string;
  @Input()suffixIcon:string;
  @Input()disabledSuffix:any;
  @Input()clearable:any;
  @Input()placeholder:string;
  @Input()suffix:TemplateRef<any>;
  @Output()focus:EventEmitter<any>=new EventEmitter<any>();
  @Output()blur:EventEmitter<any>=new EventEmitter<any>();
  @Output()enter:EventEmitter<any>=new EventEmitter<any>();
  @Output()debounceChange:EventEmitter<any>=new EventEmitter<any>();
  @Input('autoFocus') set autoFocus(val:any){
    if(val||val==='')setTimeout(()=>this.inputRef.nativeElement.focus());
  }
  confirm(){
    this.enter.emit(this.value||'');
    this.blurClose();
  }
  blurClose=()=>{
    this.inputRef.nativeElement.blur();
    this.closeComplete();
  };
  stop(e:any){
    // this.autoComplete&&e.stopPropagation();
  }
  catchAutoBlock(){

    setTimeout(()=>this.closeComplete(),300);
  }

  showComplete:boolean;
  constructor(
  ){}
  autoSubject:Subject<any>;

  ngOnInit(){
    if(this.autoComplete){
      this.autoSubject=new Subject<any>();
      this.autoSubject.pipe(debounceTime(300)).subscribe((v:any)=>this.debounceChange.emit(v))

    }
  }
  destroyPlaceNode=()=>{
    this.showComplete=false;
    if(!this.placeNode)return;
    this.parentNode.removeChild(this.placeNode);
    this.placeNode=null;
    this.parentNode.style.overflowY='auto';
  };

  closeComplete(){

    if(this.showComplete){

      this.destroyPlaceNode();

    }

  }
  clear2(){

    this.changeValue(this.value='');
  }

  _focus(){
    this.focus.emit();
    this.isFocus=true;
    this.showComplete=this.autoComplete;
  }
  _blur(){
    this.blur.emit(this.value);
    this.isFocus=false;
    // this.autoComplete&&this.destroyPlaceNode();
  }
  emit:any;
  keydown(e:any){
    if(e.key==='Enter'){
      this.confirm();
    }
  }
  changeValue(value:any){
    this.emit&&this.emit(value);
    if(this.autoComplete)this.autoSubject.next(value);

  }

  writeValue(value:number){
    this.value=value;
  }
  registerOnTouched(){}
  registerOnChange(fn:any){
    this.emit=fn;
  }
  ngOnDestroy(){

  }
}
