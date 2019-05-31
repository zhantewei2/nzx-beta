import {Injectable,NgZone} from '@angular/core';
import {bezier} from '../util/math';
import {Inertance} from './inertance';
import {loadJs} from '../util/loadJs';
import {isIOS} from "../config";
import {ripple} from '../util/ripple';
import {Router,NavigationStart} from '@angular/router';
import {Subject} from 'rxjs';

declare var sld:any;
declare var webkit:any;

const animationKey:number=16.5;

export interface LinearOption{
  distance:number;
  durationTime?:number;
  vt?:number;
}


@Injectable()
export class ToolService{
  routerChange:Subject<any>=new Subject<any>();

  constructor(
    private _nz:NgZone,
    private _router:Router  
  ){
    this.viewHeight=window.innerHeight||document.documentElement.clientHeight;
    this._router.events.subscribe(e=>{
      if(e instanceof NavigationStart)this.routerChange.next();
    })
  }
  viewHeight:number;
  cosLoading:boolean;
  isIOS:boolean=!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  //水波特效
  ripple=ripple(this._nz);
  //路由变化
  
  blurContainer=class {
    constructor(){
      this.body=document.body;
    }
    scaleName:string='cm-bgScale';
    blurName:string='cm-bgBlur';
    body:HTMLElement;
    timeout:any;
    add(){
      this.body.classList.add(this.scaleName);
      this.timeout=setTimeout(()=>{
        this.body.classList.add(this.blurName);
        this.timeout=null;
      },250)
    }
    remove(){
      this.body.classList.remove(this.scaleName,this.blurName);
      if(this.timeout){
        clearTimeout(this.timeout);
        this.timeout=null;
      }
    }
  }


  //加载cos
  loadCos(cb:Function){
    if(this.cosLoading)return;
    this.cosLoading=true;
    loadJs('assets/js/cos-js-sdk-v5.min.js')
      .then(()=>{
        this.cosLoading=false;
        cb();
      })
      .catch(()=>{
        this.cosLoading=false;
        cb('error')
      });
  }

  //request linear animation
  linear(
    {distance,durationTime=300,vt}:LinearOption,
    cb:Function,
    end?:Function
  ){
    const reqAnimation=requestAnimationFrame||window.webkitRequestAnimationFrame||(window as any).msRequestAnimationFrame;

    const b:any=bezier([0,100],[0,100],[distance,100]);
    if(vt)durationTime=distance/vt*100;
    const total=Math.ceil(durationTime/animationKey);
    let
      isPause:boolean,
      count=0;
    const run=()=>{
      this._nz.runOutsideAngular(()=>{
        const step=()=>{
          if(count<total){
            if(!isPause){
              const pos:any=b(++count/total);
              cb(pos.x);
              reqAnimation(step)
            }
          }else{end&&end()}
        }
        step();
      })
    };
    run();
    return {
      pause:()=>{isPause=true},
      resume:()=>{
        isPause=false;
        run()
      }
    }
  }


  // disabled cross  bound
  disCrossBound(node:any){
    let bodyRun=e=>{};
    let bodyListener=e=>bodyRun(e);
    const destroy=()=>document.body.removeEventListener('touchmove',bodyListener);


    this._nz.runOutsideAngular(()=>{
      let preY:number=0,y:number,_y:number,scrollTop:number,boundBottom:number;
      document.body.addEventListener('touchmove',bodyListener,{passive:false});

      const stop=()=>bodyRun=e=>e.preventDefault();

      const restore=()=>bodyRun=e=>{};

      node.addEventListener('touchmove',e=>{
        scrollTop=node.scrollTop;
        boundBottom=node.scrollHeight-node.offsetHeight;

        y=e.touches[0].pageY;
        if(preY!==undefined){
          _y=y-preY;

          if(scrollTop<=0){
            _y>0?stop():restore();
          }else if(scrollTop>=boundBottom){
            _y<0?stop():restore();
          }else{
            restore();
          }
        }else if(scrollTop==0){
          stop();
        }else if(scrollTop>=boundBottom){
          stop();
        }
        preY=y;
        //  e.preventDefault();
      });
      node.addEventListener('touchend',()=>preY=undefined);
    });
    return destroy;
  }

  //safari inertance
  iosInertance(wrapper:any){
    Inertance(wrapper,this._nz);
  }
  //class
  toggleCss(node,className,exist){
    exist?node.classList.add(className):node.classList.remove(className);
  }
}
