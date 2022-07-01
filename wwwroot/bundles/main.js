"use strict";var b=(e,t,n)=>{if(!t.has(e))throw TypeError("Cannot "+n)};var l=(e,t,n)=>(b(e,t,"read from private field"),n?n.call(e):t.get(e)),f=(e,t,n)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,n)};var r;class m{constructor(){f(this,r,{})}on(t,n){l(this,r)[t]?l(this,r)[t].push(n):l(this,r)[t]=[n]}off(t){l(this,r)[t]&&(l(this,r)[t].pop(),l(this,r)[t].length===0&&delete l(this,r)[t])}offAll(t){l(this,r)[t]&&delete l(this,r)[t]}emit(t,...n){l(this,r)[t]&&l(this,r)[t].forEach(a=>{a(...n)})}hasListeners(t){return typeof l(this,r)[t]!="undefined"}}r=new WeakMap;window.addEventListener("load",()=>{let e={};e.logo=document.querySelector("header > .header__logo"),e.stream=document.querySelector("#stream-window"),e.status=document.querySelector("#status-bar"),e.heading=document.querySelector(".main-wrapper > h1"),e.form__hint=document.getElementById("form__hint"),e.form_login=document.querySelector(".form--login"),e.form_register=document.querySelector(".form--register"),e["checkbox-modal-register"]=document.getElementById("checkbox-modal-register"),e["checkbox-modal-login"]=document.getElementById("checkbox-modal-login"),e.form_login.addEventListener("submit",u),e.form_register.addEventListener("submit",x);let t=new m,n=new m,a=new m,s;a.on("ws_open",()=>{s=new WebSocket("ws://localhost:9999/ws"),s.addEventListener("message",o=>{console.log(o.data)}),s.addEventListener("open",o=>{setInterval(()=>{s.send("<< hello from client >>")},2e3)}),s.onclose=o=>s.close()}),n.on("json",o=>{e.status.innerText=`hello, ${o.name}`,e.heading.innerText=`hello, ${o.name}`,e.form__hint.innerText=o.token.belongsTo,localStorage.setItem("name",o.name),localStorage.setItem("token",JSON.stringify(o.token)),a.emit("ws_open")}),t.on("json",o=>{e.status.innerText=`hello, ${o.name}`,e.heading.innerText=`hello, ${o.name}`,e.form__hint.innerText=o.token.belongsTo,localStorage.setItem("name",o.name),localStorage.setItem("token",JSON.stringify(o.token)),a.emit("ws_open")});function u(o){o.preventDefault();let d=e.form_login.elements,c=e.form_login.getAttribute("action"),h=d.uuid.value,g=d.password.value,p=JSON.stringify({id:h,password:g});console.log([c,p]),fetch(c,{method:"post",body:p}).then(i=>(console.log(i.status),i.json())).then(i=>{console.log(i),e["checkbox-modal-login"].checked=!1,t.emit("json",i)}).catch(i=>{console.log(i)})}function x(o){o.preventDefault();let d=e.form_register.elements,c=e.form_register.getAttribute("action"),h=d.name.value,g=d.password.value,p=JSON.stringify({name:h,password:g});console.log([c,p]),fetch(c,{method:"post",body:p}).then(i=>(console.log(i.status),i.json())).then(i=>{console.log(i),e["checkbox-modal-register"].checked=!1,n.emit("json",i)}).catch(i=>{console.log(i)})}});