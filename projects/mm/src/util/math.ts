const bezier=([x0,y0]:any,[x1,y1]:any,[x2,y2]:any)=>t=>{
  return {
    x:(1-t)*(1-t)*x0+2*t*(1-t)*x1+t*t*x2,
    y:(1-t)*(1-t)*y0+2*t*(1-t)*y1+t*t*y2
  }
};

export {bezier};
