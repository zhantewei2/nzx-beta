import {nowString} from './date';



export const dataURLtoBlob=(dataUrl:string)=>{
  let
    arr=dataUrl.split(','),
    mine=arr[0].match(/:(.*?);/)[1],
    bstr=atob(arr[1]),
    n=bstr.length,
    u8arr=new Uint8Array(n);
  while(n--){
    u8arr[n]=bstr.charCodeAt(n);
  }
  return new Blob([u8arr],{type:mine});

};

const minSize=30;
const switchQuality=size=>{
  size=size/1024;
  if(size>500)return 0.5;
  if(size>200)return 0.6;
  if(size>100)return 0.7;
  if(size>50)return 0.8;
  return undefined;
};


export const compressDataUrl=(dataUrl:string,size?:number)=>{
  return new Promise((resolve,reject)=>{
    const canvas:any=document.createElement('canvas');
    const ctx:any=canvas.getContext('2d');
    const img=new Image();
    img.onload=()=>{
      let
        h=img.height,
        w=img.width,
        percent=1;
      if(h>=4000&&w>=3000){
        percent=4;
      }else if(h>3000&&w>2000){
        percent=3;
      }else if(h>2000&&w>1000){
        percent=2;
      }else if(h>3000||w>3000){
        percent=3;
      }else if(w>2000||h>2000){
        percent=2;
      }else if(w>1500||h>1500){
        percent=1.5;
      }
      const scale=1/percent;
      const _h:number=canvas.height=h/percent;
      const _w:number=canvas.width=w/percent;
      // ctx.scale(scale,scale);
      ctx.drawImage(img,0,0,_w,_h);

      const dataUrl2=canvas.toDataURL('image/jpeg',switchQuality(size));
      const blob=dataURLtoBlob(dataUrl2);
      resolve({
        blob,
        dataUrl:dataUrl2
      });
    };
    img.src=dataUrl;
  })
};
