 const basea:number=1,maxSpeed:number=80;

export const Inertance=(wrapper:any,_nz:any)=>{
  let isIOS:boolean=(window as any)._ztwIsIOS;
  if(isIOS===undefined){
    isIOS=(window as any)._ztwIsIOS=!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }
  if(!isIOS)return;
  _nz.runOutsideAngular(()=>{
    let
      beginTime:number,
      durationCount:number,
      distance:number=0,
      recordDistance:any,
      _recordDistance:number,
      stopScroll:boolean,
      clearRecord=()=>{
        if(recordDistance){
          clearInterval(recordDistance);
          recordDistance=null;
        }
      };
    wrapper.addEventListener('touchstart',(e)=>{
      beginTime=isUp=undefined;
      distance=0;
      stopScroll=true;
      clearRecord();
      recordDistance=setInterval(()=>_recordDistance=distance,150);
    });

    let
      moveY:number,
      preY:number,
      isUp:boolean,
      perDis:number;


    wrapper.addEventListener('touchmove',e=>{

      moveY=e.touches[0].pageY;
      if(preY!==undefined){
        if((perDis=moveY-preY)> 0){

          if(!isUp||isUp===undefined){
            isUp=true;
            distance=0;
            beginTime=new Date().getTime();
          }
          distance-=perDis;

        }else{
          if(isUp||isUp===undefined){
            isUp=false;
            distance=0;
            beginTime=new Date().getTime();
          }
          distance-=perDis;
        }
      }
      preY=moveY;
    })

    wrapper.addEventListener('touchend',e=>{
      clearRecord();
      if(beginTime){
        if(_recordDistance==distance)return;
        durationCount=Math.ceil((new Date().getTime()-beginTime)/16);
        let speed:number=Math.round(distance/durationCount);
        if(speed==0)return;
        let
          top:number=wrapper.scrollTop,
          height:number=wrapper.scrollHeight,
          a:number=isUp?basea:0-basea,
          offsetH:number=wrapper.offsetHeight,
          scrollTop:number=top;

        if(isUp){
          a=basea;
          speed=speed<0-maxSpeed?0-maxSpeed:speed;
        }else{
          a=0-basea;
          speed=speed>maxSpeed?maxSpeed:speed;
        }
        stopScroll=false;
        const run=()=>{
          if(speed==0||scrollTop<=0||scrollTop+offsetH>=height||stopScroll)return;
          speed+=a;
          scrollTop+=speed;
          wrapper.scrollTop=scrollTop;
          requestAnimationFrame(run);
        }
        requestAnimationFrame(run);
      }
    })

  })
}
