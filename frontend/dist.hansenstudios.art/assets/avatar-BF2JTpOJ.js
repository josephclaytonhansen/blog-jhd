import{r,o as c,h as i,c as n,e as o,y as t}from"./index-CiGjwBAE.js";const u=["src","alt"],v={__name:"avatar",props:{image:String,classes:String,alt:{String,default:"user avatar"}},setup(a){const s=a,e=r(!1),l=()=>{e.value=!0};return c(()=>{(!s.image||s.image==="")&&(e.value=!1)}),(d,f)=>(i(),n("div",{class:t(["overflow-hidden avatar aspect-square",a.classes])},[o("img",{src:a.image,alt:a.alt,class:t(["w-full h-full object-cover avatar transition-opacity duration-300",e.value?"opacity-100":"opacity-0"]),onLoad:l},null,42,u),o("div",{class:t(["w-full h-full bg-backdrop-500 flex items-center justify-center avatar transition-opacity duration-300 relative",e.value?"opacity-0":"opacity-100 -top-[100%]"])},null,2)],2))}};export{v as _};