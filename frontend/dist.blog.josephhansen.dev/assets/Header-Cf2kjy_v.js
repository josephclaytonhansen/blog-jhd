import{r as u,o as m,c as p,e,q as t,j as c,z as a,b as l,d as i,i as x,g as f,h as r,k as n}from"./index-DL2eGZtB.js";import{c as _}from"./createLucideIcon-CYzOKntu.js";/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=_("TerminalIcon",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=_("UserIcon",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),k={class:"w-screen overflow-hidden colorblock_dark p-5"},v={class:"flex justify-between items-center"},y={class:"flex items-center"},g=e("a",{href:"josephhansen.dev",class:"text-accent-500 cursor-pointer"},"josephhansen.dev",-1),w={class:"flex items-center"},B={class:"flex items-center"},V={__name:"Header",setup(I){x();const s=u(!1);return m(()=>{localStorage.getItem("token")&&(s.value=!0)}),(b,j)=>{const o=f("router-link");return r(),p("header",k,[e("nav",v,[e("div",y,[t(c(h),{class:"text-accent-500 w-8 h-8"}),g]),e("div",w,[t(o,{to:"/blog",class:"text-text-0 cursor-pointer"},{default:a(()=>[n("Blog")]),_:1})]),e("div",B,[s.value?i("",!0):(r(),l(o,{key:0,to:"/login",class:"text-text-0 cursor-pointer"},{default:a(()=>[t(c(d)),n("Login")]),_:1})),s.value?(r(),l(o,{key:1,to:"/me",class:"text-text-0 cursor-pointer"},{default:a(()=>[t(c(d)),n("Me")]),_:1})):i("",!0)])])])}}};export{V as default};
