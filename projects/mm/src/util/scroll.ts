import {bezier} from './math';
const perTime=10;
const defaultTime=500;
export const scrollToMethod=(interval?:any)=>(top,targetTop,cb,time=defaultTime,endCb?:Function)=>{
  const begin=[0,0];
  const len=targetTop-top;
  const end=[time,len];
  const target=[0,len];
  const run=bezier(begin,target,end);
  let x=0,y=top;
  let result;

  if(interval){
    clearInterval(interval);
    interval=null;
  }
  interval=setInterval(()=>{
    x+=perTime;
    result=run(x/defaultTime);
    cb(Math.round(top+result.y));
    if(x>=defaultTime){
      clearInterval(interval);
      interval=null;
      endCb&&endCb();
    }
  },perTime);
  return interval;
};
