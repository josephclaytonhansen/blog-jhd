import{r as x,o as _,c as m,e as s,F as w,x as k,b as p,f as d,i as C,h as n,y as b,t as y}from"./index-D_G-YzZ9.js";import{_ as c,a as r,P as i,b as l,c as o,M as S,d as I,e as P,U as M}from"./comments-DIC_5S2U.js";import{P as B}from"./pen-line-s98tM0ZR.js";import{M as $}from"./_commonjsHelpers-ChYRfePt.js";import"./eye-BiAqFOlB.js";const A={class:"w-full h-full overflow-hidden flex flex-row min-h-[100vh]"},D={id:"sidebar",class:"h-full min-h-[100vh] overflow-hidden bg-backdrop-2 flex flex-col items-start justify-center min-w-[30px] md:min-w-[150px]"},L=["onClick"],T={class:"hidden sm:hidden md:block"},j={id:"center",class:"grow h-full min-h-[100vh] overflow-auto bg-backdrop-3"},q={__name:"Author",setup(F){const t=x(o),u=C(),v=[{icon:S,text:"Preview",component:o},{icon:I,text:"Posts",component:l},{icon:B,text:"Pages",component:i},{icon:P,text:"Tags",component:r},{icon:$,text:"Comments",component:c},{icon:M,text:"Logout",component:"logout"}],g=e=>{switch(e){case o:return"preview";case l:return"posts";case i:return"pages";case r:return"tags";case c:return"comments"}},h=e=>localStorage.getItem("activeComponent")===e,f=e=>{switch(t.value=e,e){case o:localStorage.setItem("activeComponent","preview");break;case l:localStorage.setItem("activeComponent","posts");break;case i:localStorage.setItem("activeComponent","pages");break;case r:localStorage.setItem("activeComponent","tags");break;case c:localStorage.setItem("activeComponent","comments");break}e=="logout"&&u.push("/logout")};return _(()=>{let e=localStorage.getItem("activeComponent");if(e)switch(e){case"preview":t.value=o;break;case"posts":t.value=l;break;case"pages":t.value=i;break;case"tags":t.value=r;break;case"comments":t.value=c;break}else t.value=o,localStorage.setItem("activeComponent",o)}),(e,U)=>(n(),m("div",A,[s("div",D,[(n(),m(w,null,k(v,a=>s("div",{class:b(["text-text-2 flex flex-row items-center justify-start h-12 px-1 py-0 sm:px-4 lg:py-8 xl:py-10 md:py-6 sm:py-10 cursor-pointer transition-all hover:bg-backdrop-1 w-full duration-300",h(g(a.component))?"bg-backdrop-0 text-text-0":""]),onClick:z=>f(a.component)},[(n(),p(d(a.icon),{class:"w-10 h-10 md:w-7 min-w-4 min-h-4 md:min-w-7 md:min-h-7 lg:w-5 md:mr-3"})),s("span",T,y(a.text),1)],10,L)),64))]),s("div",j,[(n(),p(d(t.value)))])]))}};export{q as default};
