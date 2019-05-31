const lgMonth=[1,3,5,7,8,10,12];
export const genArr=(begin:number,end:number)=>{
  const arr=[];
  for(let i=begin;i<=end;i++){arr.push(i)}
  return arr;
};


export interface Opts{
  yearCollection?:Array<number>;
  monthCollection?:Array<number>;
  year?:number;
  month?:number;
  day?:number;
  keeyDays?:Function;
}


export class CmDate{
  isLeap:boolean;
  keepDays:Function;
  _year:number;
  _month:number;
  day:number;
  yearCollection:Array<number>;
  monthCollection:Array<number>;
  dayCollection:Array<number>;

  set year(val:number){
    if(!val)return;
    this.isLeap=val%4===0&&val%100!==0;
    if(this.month==2){
      const maxDay:number=this.changeFeb();
      if(this.day>maxDay)this.day=maxDay;
    }
    this._year=val;
  }
  get year(){return this._year}

  set month(val:number){
    if(val===this._month)return;
    let maxDay:number;
    this._month=val;

    if(val==2){
      maxDay=this.changeFeb();
    }else if(lgMonth.indexOf(val)!=-1){
      this.changeArrDay(maxDay=31)
    }else{
      this.changeArrDay(maxDay=30);
    }
    if(this.day>maxDay)this.day=maxDay;
  }
  get month(){
    return this._month;
  }
  changeFeb(){
    const max:number=this.isLeap?29:28;
    this.changeArrDay(max);
    return max;
  }
  changeArrDay(endIndex:number){
    if(this.dayCollection&&this.keepDays){
      let nowEnd=this.dayCollection.length;
      if(nowEnd<endIndex){
        for(let i=nowEnd+1;i<=endIndex;i++){this.dayCollection.push(i)}
        this.keepDays();
      }else if(nowEnd>endIndex){
        let dis=nowEnd-endIndex;
        while(dis--){this.dayCollection.pop()}
        this.keepDays();
      }
    }else{
      this.dayCollection=genArr(1,endIndex);
      this.keepDays&&this.keepDays();
    }
  }
  constructor({yearCollection,keeyDays,monthCollection,year,month,day}:Opts){
    const today=new Date();
    const fullYear:number=today.getFullYear();
    this.keepDays=keeyDays;
    this.yearCollection=yearCollection||genArr(fullYear-10,fullYear+10);
    this.monthCollection=monthCollection||genArr(1,12);
    this.year=year||fullYear;
    this.month=month||today.getMonth()+1;
    this.day=day||today.getDate();

  }
}

export const nowString=():string=>{
  const date:Date=new Date();
  const double=(s:any)=>{
    if(s<10)s='0'+s;
    return s;
  }
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${double(date.getHours())}:${double(date.getMinutes())}`;
};
