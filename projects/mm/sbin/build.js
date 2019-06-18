const sass=require('node-sass');
const {BUILDER,join,ICON,root_path} =require('./config.js');
const path=require('path');
const fs=require('fs');
const {run_promise}=require('./tool');
const {copyFile}=require('./tool/fs');
const autoprefixer=require('autoprefixer');
const postcss=require('postcss');
const postclean=require('postcss-clean');
const output_static=path.join(BUILDER.outputDir,BUILDER.staticDirName);
const source_static_css=ICON.css_files;
const source_static_font=ICON.font_files;
const sass_input_file=join(BUILDER.sassInput);
const css_output_file=path.join(source_static_css,BUILDER.cssOutputName);
const cssall_output_file=path.join(source_static_css,BUILDER.cssAllOutputName);

const font_css_file=path.join(source_static_css,`${ICON.templateFontName}.css`);


const compilerSass=async()=>{
  const {css}=await run_promise(sass.render,{file:sass_input_file});
  const result=await postcss([autoprefixer,postclean()]).process(css.toString());
  const content=result.css;
  await run_promise(fs.writeFile,css_output_file,content);

  //font
  let font_css=await run_promise(fs.readFile,font_css_file,'utf8');
  font_css=(await postcss([autoprefixer,postclean()]).process(font_css)).css;
  await run_promise(fs.writeFile,cssall_output_file,font_css+content);
};

const copyAll=async()=>{
  try {
    fs.mkdirSync(output_static);
  }catch(e){}
  try{
    await run_promise(copyFile,source_static_css,path.join(output_static,'css'));
    await run_promise(copyFile,source_static_font,path.join(output_static,'font'));
  }catch(e){
    console.error(e);
  }
};

const run=async()=>{
  await compilerSass();
  await copyAll();
};

run();