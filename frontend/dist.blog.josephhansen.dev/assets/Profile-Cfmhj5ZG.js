import{r as _,o as m,c,e,q as h,t as l,F as p,x,j as u,i as g,h as n}from"./index-DgndfrZJ.js";import{_ as w}from"./avatar-DgILnect.js";import{E as v}from"./eye-CeJXxrMX.js";import{H as y}from"./home-iDtvGo_n.js";const b={class:"flex bg-backdrop-3 h-[100vh] overflow-hidden w-full p-3 lg:p-0"},j={class:"bg-backdrop-2 text-text-0 p-8 m-w-[500px] w-full lg:w-1/2 h-auto m-auto rounded-xl"},E=e("h1",{class:"text-4xl font-normal text-left"},"Profile",-1),k=e("hr",{class:"border-backdrop-1 my-4"},null,-1),B={class:"flex flex-row items-stretch gap-12 justify-start h-auto flex-wrap"},C={class:"flex items-center gap-2 shrink flex-wrap max-w-[50%]"},N={class:"max-w-[100%] flex flex-col gap-2 border-r-2 pr-5 border-backdrop-1"},$={class:"text-2xl"},A={class:"text-md italic text-text-1"},P={class:"text-md italic text-text-2"},R={class:"flex flex-row items-start justify-start grow"},T={class:"text-lg text-text-1"},U=e("hr",{class:"border-backdrop-1 my-4"},null,-1),F={class:"flex flex-row items-center gap-4 justify-start h-auto flex-wrap"},S={class:"flex flex-col gap-2"},z=e("h3",{class:"text-2xl"},"Posts",-1),G={class:"flex flex-row items-center gap-2 justify-start h-auto flex-wrap"},H={class:"flex flex-col gap-2"},V={class:"text-lg"},q={class:"flex items-center gap-2 justify-start h-auto flex-wrap"},D={class:"text-md text-text-1"},I=e("hr",{class:"border-backdrop-1 my-4"},null,-1),L={class:"flex flex-row items-center gap-4 justify-start h-auto flex-wrap"},M={class:"flex flex-col gap-2"},J=e("h3",{class:"text-2xl"},"Comments",-1),K={class:"flex flex-row items-center gap-2 justify-start h-auto flex-wrap"},O={class:"flex flex-col gap-2"},Q={class:"text-lg"},W=e("div",{class:"flex items-center gap-2 justify-start h-auto flex-wrap"},null,-1),se={__name:"Profile",setup(X){const i=g(),t=_({}),f=async()=>{let d=i.currentRoute.value.params.id;if(d){let a="https://seabass.josephhansen.dev/user/id/"+d,o={headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json",Authorization:"Bearer "+localStorage.token},withCredentials:!0};try{await fetch(a,{method:"GET",headers:o.headers,credentials:"include"}).then(async s=>{if(s.status!==200)throw new Error("Network error- could not get user");t.value=await s.json(),console.log(t.value)}).catch(s=>{throw new Error(s.message||s.error||"Error getting user")})}catch(s){throw new Error(s.message||s.error||"Error getting user")}}else{let a=i.currentRoute.value.params.displayName;if(a){let o=`https://seabass.josephhansen.dev/user/displayname/${encodeURIComponent(a)}`,s={headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json",Authorization:"Bearer "+localStorage.token},withCredentials:!0};try{await fetch(o,{method:"GET",headers:s.headers,credentials:"include"}).then(async r=>{if(r.status!==200)throw new Error("Network error- could not get user");t.value=await r.json(),console.log(t.value)}).catch(r=>{throw new Error(r.message||r.error||"Error getting user")})}catch(r){throw new Error(r.message||r.error||"Error getting user")}}else i.push("/login")}};return m(async()=>{await f()}),(d,a)=>(n(),c("div",b,[e("div",j,[E,k,e("div",B,[e("div",C,[h(w,{image:t.value.picture,classes:"w-20 h-20"},null,8,["image"]),e("div",N,[e("h3",$,l(t.value.displayName),1),e("h4",A,l(t.value.shortBio),1),e("h5",P,l(t.value.website),1)])]),e("div",R,[e("p",T,l(t.value.longBio),1)])]),U,e("div",F,[e("div",S,[z,e("div",G,[(n(!0),c(p,null,x(t.value.posts,o=>(n(),c("div",H,[e("h4",V,l(o.title),1),e("div",q,[e("div",null,[h(u(v)),e("p",D,l(o.views),1)])])]))),256))])])]),I,e("div",L,[e("div",M,[J,e("div",K,[(n(!0),c(p,null,x(t.value.comments,o=>(n(),c("div",O,[e("h4",Q,l(o.text),1),W]))),256))])])])]),e("div",{class:"fixed top-0 left-0 p-4",onClick:a[0]||(a[0]=o=>u(i).push("/"))},[h(u(y),{class:"w-10 h-10 cursor-pointer bg-accent-600 p-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300"})])]))}};export{se as default};
