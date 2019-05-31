import { Component, ViewChild,OnInit,Input,Output,EventEmitter } from '@angular/core';
import {CmDate,genArr} from '../../util/date';

export interface SelectDate{
  year?:number;
  month?:number;
  day?:number;
  hour?:number;
  minutes?:number;
}


@Component({
  selector: 'cm-date-picker',
  template:`
<cm-bottom-sheet #bottomSheet></cm-bottom-sheet>
<ng-template #tp>
   <div class="between">
   <cm-pure-btn (click)="bottomSheet.close()">取消</cm-pure-btn>
   <cm-pure-btn (click)="confirm()">确定</cm-pure-btn>
</div>
  <div class="around px-2" [ngClass]="_useTime?'my-4 mb-7':'my-2'">
    <cm-picker [sm]="_useTime" title="年" [list]="date?.yearCollection" (cmSelectChange)="changeYear($event)"
      [cmSelect]="selectYear"
    ></cm-picker>
    
    <cm-picker [sm]="_useTime" title="月" [list]="date?.monthCollection" (cmSelectChange)="changeMonth($event)"
      [cmSelect]="date.month-1"
    ></cm-picker>
 
    <cm-picker [sm]="_useTime" #dayPicker title="日" [list]="date?.dayCollection" 
      [cmSelect]="date.day-1"
      (cmSelectChange)="changeDay($event)"></cm-picker>
   <div *ngIf="_useTime" class="cm-picker-vertical"></div>
    <cm-picker 
      *ngIf="_useTime" 
      [list]="hourCollection"
      [cmSelect]="hour"
      title="时"
      [sm]="_useTime"
      (cmSelectChange)="changeHour($event)"
    ></cm-picker>
    <cm-picker 
      *ngIf="_useTime" 
      [list]="minuteCollection"
      [cmSelect]="minutes"
      title="分"  
      [sm]="_useTime"
      (cmSelectChange)="changeMinutes($event)"
    ></cm-picker>
  </div>
</ng-template>
  `
})
export class CmDatePickerComponent implements OnInit {
  date:any;
  constructor() { }
  _cmSelect:any={};
  hourCollection:Array<number>;
  minuteCollection:Array<number>=[0,15,30,45];
  _useTime:boolean;
  hour:number;
  minutes:number;
  _hour:number;
  _minutes:number;
  @Input()set timeValue(val:any){
    if(val){
      this.hourCollection=genArr(0,23);
      this._useTime=true;
      const now=new Date();
      this.hour=val.hour||now.getHours();
      const minute:any=this.minuteCollection.indexOf(val.minutes);
      this.minutes=minute!=-1?minute:0;
    }
  }
  @Input()yearCollection:Array<number>;
  @Input()set cmValue(val:SelectDate){
    if(!val)return;
    if(!this.initCompleted){
      this._cmSelect=val||{};
    }else{
      const {year,day,month,hour,minutes}=val;
      this.date.year=year;
      this.date.month=month;
      this.date.day=day;
      this.catchSelectY();
      this.hour=hour;

      this.minutes=minutes;
    }
  };
  @Output('cmChange')cmChange:EventEmitter<any>=new EventEmitter<any>();
  @ViewChild('tp')tp:any;
  @ViewChild('bottomSheet')bottomSheet:any;
  @ViewChild('dayPicker')dayPicker:any;
  ngOnInit(){}
  initCompleted:boolean;
  catchSelectY=()=>this.selectYear=this.date.yearCollection.indexOf(this.date.year);

  open(){
    if(!this.date){
      this.date=new CmDate({
        year:this._cmSelect.year,
        month:this._cmSelect.month,
        day:this._cmSelect.day,
        yearCollection:this.yearCollection,
        keeyDays:()=>{

          if(this.dayPicker){
            setTimeout(()=>this.dayPicker.calLis());
          }
        }});
      this.catchSelectY();
      this.initCompleted=true;

    }
    this.bottomSheet.open(this.tp);
  }
  close(){
    this.bottomSheet.close();
  }
  selectYear:number;
  selectDay:number;
  changeYear(index:number){
    this.date.year=this.date.yearCollection[index];
  }
  changeMonth(index:number){
    this.date.month=index+1;
  }

  changeDay(index:number){
    this.selectDay=index+1;
    //this.date.day=this.date.dayCollection[index];
  }
  changeHour(index:number){
    this._hour=this.hourCollection[index];
  }
  changeMinutes(index:number){
    this._minutes=this.minuteCollection[index];
  }

  confirm(){

    this.cmChange.emit({
      year:this.date.year,
      month:this.date.month,
      day:this.selectDay,
      hour:this._hour,
      minutes:this._minutes
    });
    this.bottomSheet.close();
  }


}
