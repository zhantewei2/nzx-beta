import {modal} from '/www/modal.js';
import '/www/input.js';

listContent=listContent.map(i=>i.slice(0,i.lastIndexOf('.')));

class ShowIcon extends HTMLElement{
  constructor(props) {
    super(props);
    this.shadow=this.attachShadow({mode:'open'});
    const that=this;
    const icon=(name)=>`
      <div class="card" data-name="${name}">
        <div class="content">
          <i class="fa fa-${name}"></i>
        </div>
        <footer>${name}</footer>
      </div>
    `;

    const baseContent=`${listContent.map(i=>icon(i)).join('')}`;
    this.shadow.innerHTML=`
    <link href="/css/nzxFont_v1.css" rel="stylesheet" type="text/css"/>
    <style>
      main{
        display:flex;
        flex-flow:wrap;
        color:rgba(0,0,0,0.76)
      }
      i{
        font-size:20px;
      }
      p{color:red}
      .card{
          padding:1rem;
          margin:0.5rem;
          box-shadow:0 1px 12px -6px gainsboro;
          border-radius:10px;
          width:100px;
          transition:all .3s ease;
      }
      .card:hover{
        background-color:rgb(230,230,230);
        cursor: pointer;
      }
      .card .content{
        text-align: center;
        line-height: 30px;
        height:30px;
      }
      .card footer{
        text-align:center;
        font-size:14px;
      }
      .input-top{
        height:60px;
        padding:10px;
        box-sizing: border-box;
        padding-left:2rem;
      }
      .fixer-top{
        position:fixed;
        top:0;
        background:white;
        box-shadow:0 1px 12px -3px rgba(0,0,0,0.2);
        width:100%;
        left:0;
      }
    </style>
    <div class="input-top fixer-top">
      <nzx-input placeholder="search icon"></nzx-input>
    </div>
    <div class="input-top">
    </div>
    <main>
      ${baseContent}
    </main>
    `;
    const input=this.shadowRoot.querySelector('nzx-input');

    const main=this.shadowRoot.querySelector('main');

    let prevalue;
    input.onInput(value=>{
      value=(value||'').trim();
      if(value===prevalue)return;
      prevalue=value;
      if(!value)return main.innerHTML=baseContent;
      const showList=listContent.filter(i=>i.match(value));
      main.innerHTML=`${showList.map(i => icon(i)).join('')}`;
    });

    const findActive=(node,className,accent)=>{

      if(node===accent)return null;
      if(node.className===className)return node;
      return findActive(node.parentNode,className,accent);
    };
    let copyBoard;
    main.onclick=(e)=>{
      const node=findActive(e.target,'card',main);
      if(!node)return;
      const name=node.getAttribute('data-name');
      if(!copyBoard){
        copyBoard=document.createElement('input');
        copyBoard.style.cssText='opacity:0;position:fixed;top:0;left:0;transform:translate(-100%,-100%)';
        document.body.appendChild(copyBoard);
      }
      copyBoard.value=`<i class="fa fa-${name}"></i>`;
      copyBoard.select();
      document.execCommand('copy',null,null);
      modal.open(`
          <div style="">fa fa-${name}</div>
          <div style="margin-top:10px;color:gray;font-size:12px;">Copy success~</div>
        `);
    }

  }

};

window.customElements.define('nzx-showicon',ShowIcon);

