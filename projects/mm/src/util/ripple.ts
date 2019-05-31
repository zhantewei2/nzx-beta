export interface RippleOpts{
  fontSize?:number;
  noneAppend?:any;
  noneBg?:any;
  light?:boolean;
  circle?:boolean;
}

export const ripple=(nz:any)=>(node:HTMLElement,opts:RippleOpts)=>{
  if(!opts.fontSize)opts.fontSize=14;
  nz.runOutsideAngular(()=>{
    let childs:Array<any>=[];
    node.classList.add('cm-ripple-container',(opts.light?'light':'empty'));
    let nextTime:any,clearNextTime=()=>{
      clearTimeout(nextTime);
      nextTime=null;
    };
    const removeChilds=()=>{
      if(nextTime)clearNextTime();
      nextTime=setTimeout(()=>{

        childs.forEach((child:any)=>{
          node.removeChild(child);
          child=null;
        });
        childs=[];
      },500);
    };

    const appendChild=(x:number,y:number)=>{
      const child:any=document.createElement('div');
      child.className='cm-ripple-one';

      child.style.cssText=`top:${y}px;left:${x}px;font-size:${opts.fontSize}px`;
  
      node.appendChild(child);
      childs.push(child);
      removeChilds();
    };
    let rect:any;
    let touch:any,y:any,x:any;
    let removeTimeout:any;

    node.addEventListener('touchstart',(e:any)=>{
      if(!removeTimeout&&opts.noneBg!==''&&!opts.noneBg)node.classList.add('rippleActive');
      if(removeTimeout){
        clearTimeout(removeTimeout);
        removeTimeout=null;
      }
      if(opts.noneAppend||opts.noneAppend==='')return;
      rect=node.getBoundingClientRect();
      touch=e.touches[0];

      if(opts.circle){
        y=rect.height/2;
        x=rect.width/2;
      }else{
        y=touch.pageY-rect.top+window.pageYOffset-opts.fontSize/2;
        x=touch.pageX-rect.left-opts.fontSize/2;
      }
      appendChild(x,y);

    });

    if(opts.noneBg!==''&&!opts.noneBg)node.addEventListener('touchend',()=> {

      removeTimeout=setTimeout(()=>{
        node.classList.add('rippleLeave');
        setTimeout(()=>{
          node.classList.remove('rippleActive','rippleLeave');
          removeTimeout=null;
        },300)
      },300);

    });
  })
};
