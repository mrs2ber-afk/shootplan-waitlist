// Waitlist demo: stores in localStorage only. No server, nothing is sent anywhere.
(function(root){
  var RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(v){v=(v||'').trim().toLowerCase();return RE.test(v)?v:null;}
  function load(){try{return JSON.parse(localStorage.getItem('waitlist')||'[]')}catch(e){return[]}}
  var FORM='https://docs.google.com/forms/d/e/1FAIpQLSe2TNeCDCL1Co_DHd19wGuez9dNRW3m2uoYjwzw-OFmcG056g/formResponse';
  function send(v){
    var h=location.hostname;
    if(!h||h==='localhost'||h==='127.0.0.1')return;
    var b=new URLSearchParams();b.append('entry.1384813942',v);
    try{fetch(FORM,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()});}catch(e){}
  }
  function add(raw){
    var v=validate(raw);
    if(!v)return {status:'invalid'};
    var l=load();
    if(l.indexOf(v)>-1)return {status:'duplicate'};
    l.push(v);localStorage.setItem('waitlist',JSON.stringify(l));
    send(v);
    return {status:'ok'};
  }
  var T={invalid:['err','البريد غير صالح. اكتبه بالشكل name@example.com'],
         duplicate:['info','البريد ده مسجّل عندنا بالفعل، مفيش حاجة تانية مطلوبة.'],
         ok:['ok','تم التسجيل. شكرًا، هنراسلك مرة واحدة لما التجربة تفتح.']};
  root.Waitlist={validate:validate,add:add,load:load};
  if(typeof document==='undefined')return;
  document.addEventListener('DOMContentLoaded',function(){
    var f=document.getElementById('wl');if(!f)return;
    var m=document.getElementById('msg');
    document.getElementById('cta').addEventListener('click',function(){
      var c=(JSON.parse(localStorage.getItem('clicks')||'0'))+1;localStorage.setItem('clicks',c);});
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var r=add(document.getElementById('email').value);
      m.className=T[r.status][0];m.textContent=T[r.status][1];
      m.setAttribute('data-status',r.status);
      if(r.status==='ok')f.reset();
    });
  });
})(window);
