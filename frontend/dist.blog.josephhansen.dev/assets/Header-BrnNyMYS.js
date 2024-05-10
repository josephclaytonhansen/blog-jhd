import{c as _}from"./createLucideIcon-CnSeaROn.js";import{r as u,o as p,c as x,e,q as t,j as a,z as c,b as l,d as i,g as f,h as n,k as r}from"./index-6Q_0SX2E.js";/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=_("TerminalIcon",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=_("UserIcon",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),m={class:"w-screen overflow-hidden colorblock py-3 px-16 absolute",style:{"z-index":"999"}},k={class:"flex justify-between items-center"},y={class:"flex items-center flex-nowrap"},v=e("a",{href:"https://josephhansen.dev",class:"text-accent-500 cursor-pointer"},"josephhansen.dev",-1),g={class:"flex items-center"},w={class:"flex items-center flex-nowrap"},N={__name:"Header",setup(B){const s=u(!1);return p(()=>{localStorage.getItem("token")&&(s.value=!0)}),(I,b)=>{const o=f("router-link");return n(),x("header",m,[e("nav",k,[e("div",y,[t(a(h),{class:"text-accent-500 w-8 h-8"}),v]),e("div",g,[t(o,{to:"/",class:"text-text-0 cursor-pointer"},{default:c(()=>[r("Blog")]),_:1})]),e("div",w,[s.value?i("",!0):(n(),l(o,{key:0,to:"/login",class:"text-text-0 cursor-pointer"},{default:c(()=>[t(a(d)),r("Login")]),_:1})),s.value?(n(),l(o,{key:1,to:"/me",class:"text-text-0 cursor-pointer"},{default:c(()=>[t(a(d)),r("Me")]),_:1})):i("",!0)])])])}}};export{N as default};
