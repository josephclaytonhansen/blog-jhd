const __vite__fileDeps=["assets/NotFound-DfGhBDjk.js","assets/index-DgndfrZJ.js","assets/index-CmkacoTq.css","assets/NotFound-BE5ySaVN.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{_ as m,a as u,r as f,o as h,c as N,b as s,d as i,e as g,f as v,F as p,g as c,h as a}from"./index-DgndfrZJ.js";import{_ as P}from"./dynamic-import-helper-BheWnx7M.js";var C=["blog.josephhansen.dev","hansenstudios.art"];let F=C,t={};for(let e of F)t[`${e}NotFound`]=P(Object.assign({"./blog.josephhansen.dev/NotFound.vue":()=>m(()=>import("./NotFound-DfGhBDjk.js"),__vite__mapDeps([0,1,2])),"./hansenstudios.art/NotFound.vue":()=>m(()=>import("./NotFound-BE5ySaVN.js"),__vite__mapDeps([3,1,2]))}),`./${e}/NotFound.vue`,3);const E={props:{thisPageComponentName:String,header:{Boolean,default:!0},footer:{Boolean,default:!0}},setup(e){const r=f({});e.header===void 0&&(e.header=!0),e.footer===void 0&&(e.footer=!0),e.thisPageComponentName===void 0&&(e.thisPageComponentName="NotFound");const n=window.location.hostname;return console.log(n,e.thisPageComponentName),h(async()=>{for(let o in t){let d=await t[o];r.value[o]=d.default}console.log(Object.keys(t)),console.log(t[`${n}${e.thisPageComponentName}`])}),{components:r,site:n,thisPageComponentName:e.thisPageComponentName,header:e.header,footer:e.footer}}};function b(e,r,n,o,d,k){const l=c("Header"),_=c("Footer");return a(),N(p,null,[o.header?(a(),s(l,{key:0})):i("",!0),g("div",null,[(a(),s(v(o.components[`${o.site}${o.thisPageComponentName}`])))]),o.footer?(a(),s(_,{key:1})):i("",!0)],64)}const x=u(E,[["render",b]]);export{x as default};
