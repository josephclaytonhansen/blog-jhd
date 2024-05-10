import{c as p}from"./createLucideIcon-CApzF2ct.js";import{r as _,o as x,c as u,e,q as t,j as r,z as a,b as l,d as i,g as f,h as c,k as n}from"./index-Cj3NP1es.js";/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=p("TerminalIcon",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=p("UserIcon",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),h={class:"w-screen overflow-hidden colorblock py-3 px-16 absolute border-b-2 border-backdrop-2",style:{"z-index":"999"}},k={class:"flex justify-between items-center"},y={class:"flex items-center flex-nowrap"},v=e("a",{href:"https://josephhansen.dev",class:"text-accent-500 cursor-pointer font-mono"},"josephhansen.dev",-1),g={class:"flex items-center"},b={class:"flex items-center flex-nowrap"},N={__name:"Header",setup(w){const o=_(!1);return x(()=>{localStorage.getItem("token")&&(o.value=!0)}),(B,I)=>{const s=f("router-link");return c(),u("header",h,[e("nav",k,[e("div",y,[t(r(m),{class:"text-accent-500 w-8 h-8"}),v]),e("div",g,[t(s,{to:"/",class:"text-text-0 cursor-pointer"},{default:a(()=>[n("Blog")]),_:1})]),e("div",b,[o.value?i("",!0):(c(),l(s,{key:0,to:"/login",class:"text-text-0 cursor-pointer flex gap-2 items-center"},{default:a(()=>[t(r(d)),n("Login")]),_:1})),o.value?(c(),l(s,{key:1,to:"/me",class:"text-text-0 cursor-pointer flex gap-2 items-center"},{default:a(()=>[t(r(d)),n("Me")]),_:1})):i("",!0)])])])}}};export{N as default};
