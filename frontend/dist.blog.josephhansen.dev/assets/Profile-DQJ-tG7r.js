import{r as m,o as g,c as n,e,q as h,t as l,F as x,x as p,j as u,i as w,h as d}from"./index-DPMTugpr.js";import{_ as v}from"./avatar-DIoSywSq.js";import{E as y}from"./eye-CDbSbdub.js";import{H as b}from"./home-Bv6PGvAR.js";const k={class:"flex bg-backdrop-3 h-[100vh] overflow-hidden w-full p-3 lg:p-0"},j={class:"bg-backdrop-2 text-text-0 p-8 m-w-[500px] w-full lg:w-1/2 h-auto m-auto rounded-xl"},E=e("h1",{class:"text-4xl font-normal text-left"},"Profile",-1),N=e("hr",{class:"border-backdrop-1 my-4"},null,-1),B={class:"flex flex-row items-stretch gap-12 justify-start h-auto flex-wrap"},C={class:"flex items-center gap-2 shrink flex-wrap max-w-[50%]"},$={class:"max-w-[100%] flex flex-col gap-2 border-r-2 pr-5 border-backdrop-1"},T={class:"text-2xl"},S={class:"text-md italic text-text-1"},A={class:"text-md italic text-text-2"},D={class:"flex flex-row items-start justify-start grow"},P={class:"text-lg text-text-1"},R=e("hr",{class:"border-backdrop-1 my-4"},null,-1),U={class:"flex flex-row items-center gap-4 justify-start h-auto flex-wrap"},F={class:"flex flex-col gap-2"},L=e("h3",{class:"text-2xl"},"Posts",-1),z={class:"flex flex-row items-center gap-2 justify-start h-auto flex-wrap"},G={class:"flex gap-2"},H={class:"flex flex-col items-center gap-2 justify-start h-auto flex-wrap p-3 colorblock_dark rounded"},I={class:"text-lg"},V={class:"text-md italic text-text-1"},q={class:"flex"},M={class:"text-md text-text-1"},J=e("hr",{class:"border-backdrop-1 my-4"},null,-1),K={class:"flex flex-row items-center gap-4 justify-start h-auto flex-wrap"},O={class:"flex flex-col gap-2"},Q=e("h3",{class:"text-2xl"},"Comments",-1),W={class:"flex flex-row items-center gap-2 justify-start h-auto flex-wrap"},X={class:"flex flex-col gap-2"},Y={class:"text-lg"},Z=e("div",{class:"flex items-center gap-2 justify-start h-auto flex-wrap"},null,-1),ae={__name:"Profile",setup(ee){const i=w(),t=m({}),_=async()=>{let c=i.currentRoute.value.params.id;if(c){let s="https://seabass.josephhansen.dev/user/id/"+c,o={headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json",Authorization:"Bearer "+localStorage.token},withCredentials:!0};try{await fetch(s,{method:"GET",headers:o.headers,credentials:"include"}).then(async r=>{if(r.status!==200)throw new Error("Network error- could not get user");t.value=await r.json(),console.log(t.value)}).catch(r=>{throw new Error(r.message||r.error||"Error getting user")})}catch(r){throw new Error(r.message||r.error||"Error getting user")}}else{let s=i.currentRoute.value.params.displayName;if(s){let o=`https://seabass.josephhansen.dev/user/displayname/${encodeURIComponent(s)}`,r={headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json",Authorization:"Bearer "+localStorage.token},withCredentials:!0};try{await fetch(o,{method:"GET",headers:r.headers,credentials:"include"}).then(async a=>{if(a.status!==200)throw new Error("Network error- could not get user");t.value=await a.json(),console.log(t.value)}).catch(a=>{throw new Error(a.message||a.error||"Error getting user")})}catch(a){throw new Error(a.message||a.error||"Error getting user")}}else i.push("/login")}};g(async()=>{await _()});const f=c=>{const s=new Date(c);return isNaN(s.getTime())?"Invalid date":`${s.toLocaleDateString()} ${s.toLocaleTimeString()}`};return(c,s)=>(d(),n("div",k,[e("div",j,[E,N,e("div",B,[e("div",C,[h(v,{image:t.value.picture,classes:"w-20 h-20"},null,8,["image"]),e("div",$,[e("h3",T,l(t.value.displayName),1),e("h4",S,l(t.value.shortBio),1),e("h5",A,l(t.value.website),1)])]),e("div",D,[e("p",P,l(t.value.longBio),1)])]),R,e("div",U,[e("div",F,[L,e("div",z,[(d(!0),n(x,null,p(t.value.posts,o=>(d(),n("div",G,[e("div",H,[e("h4",I,l(o.title),1),e("h5",V,l(f(o.date)),1),e("div",q,[h(u(y)),e("p",M,l(o.views),1)])])]))),256))])])]),J,e("div",K,[e("div",O,[Q,e("div",W,[(d(!0),n(x,null,p(t.value.comments,o=>(d(),n("div",X,[e("h4",Y,l(o.text),1),Z]))),256))])])])]),e("div",{class:"fixed top-0 left-0 p-4",onClick:s[0]||(s[0]=o=>u(i).push("/"))},[h(u(b),{class:"w-10 h-10 cursor-pointer bg-accent-600 p-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300"})])]))}};export{ae as default};
