// ---- Data structure: singly linked list ----
class Patient{constructor(id,name,age,gender,disease,phone,doctor){Object.assign(this,{id,name,age,gender,disease,phone,doctor});}}
class Node{constructor(data){this.data=data;this.next=null;}}
class LinkedList{
  constructor(){this.head=null;this.tail=null;this.size=0;}
  addLast(d){const n=new Node(d);if(!this.head){this.head=this.tail=n;}else{this.tail.next=n;this.tail=n;}this.size++;}
  removeFirst(){if(!this.head)return null;const d=this.head.data;this.head=this.head.next;if(!this.head)this.tail=null;this.size--;return d;}
  find(fn){let c=this.head;while(c){if(fn(c.data))return c;c=c.next;}return null;}
  removeWhere(fn){let c=this.head,p=null;while(c){if(fn(c.data)){if(p)p.next=c.next;else this.head=c.next;if(c===this.tail)this.tail=p;this.size--;return true;}p=c;c=c.next;}return false;}
  toArray(){const a=[];let c=this.head;while(c){a.push(c.data);c=c.next;}return a;}
}
const patients=new LinkedList(), queue=new LinkedList();

// ---- UI helpers ----
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function say(el,t,ok){$(el).textContent=t;$(el).className='msg '+(ok?'ok':'err');}
function readForm(){
  const v=k=>$(k).value.trim();
  const id=parseInt(v('id'),10), age=parseInt(v('age'),10);
  if(!Number.isInteger(id)||id<1) throw new Error('Enter a valid patient ID.');
  if(!v('name')) throw new Error('Name is required.');
  if(!Number.isInteger(age)||age<0||age>120) throw new Error('Enter a valid age (0–120).');
  if(!v('disease')) throw new Error('Disease is required.');
  if(!/^\d{10}$/.test(v('phone'))) throw new Error('Phone number must be 10 digits.');
  if(!v('doctor')) throw new Error('Doctor name is required.');
  return new Patient(id,v('name'),age,$('gender').value,v('disease'),v('phone'),v('doctor'));
}
function fillForm(p){for(const k of ['id','name','age','gender','disease','phone','doctor'])$(k).value=p[k];}
function chainHTML(list,label){
  const a=list.toArray();
  if(!a.length)return '<span class="empty">Empty list</span>';
  return '<span class="tag">'+label+'</span>'+a.map(p=>'<div class="node"><b>#'+esc(p.id)+' '+esc(p.name)+'</b><i>next</i></div><span class="arrow">→</span>').join('')+'<span class="tag">null</span>';
}
function render(){
  const a=patients.toArray();
  $('cnt').textContent=a.length;
  $('rows').innerHTML=a.length?a.map(p=>'<tr><td>'+esc(p.id)+'</td><td>'+esc(p.name)+'</td><td>'+esc(p.age)+'</td><td>'+esc(p.gender)+'</td><td>'+esc(p.disease)+'</td><td>'+esc(p.phone)+'</td><td>'+esc(p.doctor)+'</td></tr>').join(''):'<tr><td colspan="7" class="empty">No patient records yet.</td></tr>';
  $('chain').innerHTML=chainHTML(patients,'head');
  $('queue').innerHTML=chainHTML(queue,'front');
}

// ---- Operations ----
$('add').onclick=()=>{try{const p=readForm();if(patients.find(x=>x.id===p.id))throw new Error('Patient ID '+p.id+' already exists.');patients.addLast(p);say('msg','Patient added.',true);render();}catch(e){say('msg',e.message,false);}};
$('upd').onclick=()=>{try{const p=readForm();const n=patients.find(x=>x.id===p.id);if(!n)throw new Error('No patient with ID '+p.id+'.');n.data=p;say('msg','Patient updated.',true);render();}catch(e){say('msg',e.message,false);}};
$('clr').onclick=()=>{document.querySelectorAll('.card input').forEach(i=>{if(i.id!=='sid')i.value='';});say('msg','',true);};
function sid(){const n=parseInt($('sid').value,10);if(!Number.isInteger(n))throw new Error('Enter a patient ID.');return n;}
$('find').onclick=()=>{try{const n=patients.find(x=>x.id===sid());if(!n)throw new Error('Patient not found.');fillForm(n.data);say('smsg','Found: '+n.data.name+'. Details loaded in the form for editing.',true);}catch(e){say('smsg',e.message,false);}};
$('del').onclick=()=>{try{const id=sid();if(!patients.removeWhere(x=>x.id===id))throw new Error('Patient not found.');queue.removeWhere(x=>x.id===id);say('smsg','Record deleted.',true);render();}catch(e){say('smsg',e.message,false);}};
$('q').onclick=()=>{try{const id=sid();const n=patients.find(x=>x.id===id);if(!n)throw new Error('Patient not found.');if(queue.find(x=>x.id===id))throw new Error('Already in the queue.');queue.addLast(n.data);say('smsg',n.data.name+' added to the waiting queue.',true);render();}catch(e){say('smsg',e.message,false);}};
$('next').onclick=()=>{const p=queue.removeFirst();if(!p)return say('qmsg','The waiting queue is empty.',false);say('qmsg','Now calling: '+p.name+' (ID '+p.id+') for Dr. '+p.doctor.replace(/^Dr\.?\s*/i,'')+'.',true);render();};
render();
