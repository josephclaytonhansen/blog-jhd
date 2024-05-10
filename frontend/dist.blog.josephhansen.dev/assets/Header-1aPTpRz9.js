import{c as _}from"./eye-D8IoaIZ7.js";import{r as u,o as m,g as p,h as c,c as x,e,q as t,j as a,z as r,k as n,b as l,d as i}from"./index-BvYYOM6d.js";/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=_("TerminalIcon",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-vue-next v0.376.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=_("UserIcon",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),h={class:"w-screen overflow-hidden colorblock_dark p-5"},k={class:"flex justify-between items-center"},v={class:"flex items-center"},y=e("a",{href:"josephhansen.dev",class:"text-accent-500 cursor-pointer"},"josephhansen.dev",-1),g={class:"flex items-center"},w={class:"flex items-center"},N={__name:"Header",setup(B){const s=u(!1);return m(()=>{localStorage.getItem("token")&&(s.value=!0)}),(I,b)=>{const o=p("router-link");return c(),x("header",h,[e("nav",k,[e("div",v,[t(a(f),{class:"text-accent-500 w-8 h-8"}),y]),e("div",g,[t(o,{to:"/blog",class:"text-text-0 cursor-pointer"},{default:r(()=>[n("Blog")]),_:1})]),e("div",w,[s.value?i("",!0):(c(),l(o,{key:0,to:"/login",class:"text-text-0 cursor-pointer"},{default:r(()=>[t(a(d)),n("Login")]),_:1})),s.value?(c(),l(o,{key:1,to:"/me",class:"text-text-0 cursor-pointer"},{default:r(()=>[t(a(d)),n("Me")]),_:1})):i("",!0)])])])}}};export{N as default};
