const path=require('path');

const root_path=path.dirname(__dirname);
const join=(...args)=>path.join(root_path,...args);

const ICON={
  files:join('lib/static/icon'),
  fontName:"nzxFont_v1",
  formats:['woff2','woff'],
  templateClassName:"fa",
  template:'css',
  templateFontPath:'../font',
  templateFontName:'nzxFont_v1',
  templateCSSPath:'../css',
  css_files:join('lib/static/css'),
  font_files:join('lib/static/font')
};

const COMPILER={
  rootDir:'lib/src',
  outDir:'temp',
};


module.exports={
  root_path,
  ICON,
  join,
  COMPILER
};