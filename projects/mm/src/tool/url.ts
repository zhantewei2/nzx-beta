export const getQueryParams=(url:string)=>{
  try{
  let str:string= url.match(/\?[^#?]*/).toString();
  str=str.slice(1);
  const result={};
  const arr=str.split('&');
  arr.forEach(i=>{
    const [key,value]=i.split('=');
    result[key]=decodeURIComponent(value);
  });
  return result;
  }catch(e){
    return {};
  }
};

export const toStringify=obj=>{
  let str:string='';
  if(!obj)return str;
  let value:any;
  for(let i in obj){
    value=obj[i];
    if(value||value===0)str+=i+'='+value+'&';
  }
  return str.slice(0,-1);
};

export const getPureUrl=(url:string)=>url?url.match(/^[^\?#]*/).toString():url;