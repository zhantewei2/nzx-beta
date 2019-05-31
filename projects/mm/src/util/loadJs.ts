const load=(address,tag,rel?,remove?:boolean)=>{
  return new Promise((resolve,reject)=>{
    const script=document.createElement(tag);
    const body=document.querySelector('body');
    const id=address.match(/[^\/]*$/).toString();
    if(document.getElementById(id))return resolve();
    if(tag=='link'){
      script.href=address
    }else{
      script.src=address;
    }
    script.onload=()=>{
        if(remove)body.removeChild(script);
        resolve();
    }
    script.onerror=()=>{
        if(remove)body.removeChild(script);
      reject()
    };
    script.id=id;
    if(rel)script.rel=rel;
    body.appendChild(script);
  })
}

export const loadJs=(address:string,remove?:boolean)=>load(address,'script',null,remove);
export const loadCss=(address:string)=>load(address,'link','stylesheet');
