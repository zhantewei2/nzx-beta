const {Server,Static,Router} =require('@ztwx/ztw-server');
const {join}=require('../config');
const getIconList =require('./getIconList');

const app=new Server();
const router=new Router();
router.get('allIcons.js',async(ctx)=>{
  const listContent=await getIconList();
  ctx.body=`var listContent=${listContent}`;
});

app.use(router.routes());
app.use(
  Static('',join('static'),{
    etag:true,
    callback:"www/showIcon.html"
  })
);
app.use(ctx=>{
  ctx.body='end';
});

app.listen(6600);