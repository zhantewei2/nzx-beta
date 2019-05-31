const isIOS=!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const dragConfig={
  longTapTime:300,
  longTapClass:'hammer-allowDrag',
  //图片删除区域高
  deleteBlockHeight:50,
};

export {
  isIOS,
  dragConfig
}