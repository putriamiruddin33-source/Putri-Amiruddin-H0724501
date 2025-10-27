// Simple LMS interactions: module list, progress, content rendering, quiz modal, chat, theme toggle
const modules = [
  { id:1, title:"Pengenalan & Tujuan", minutes:8, summary:"Konsep dasar desain pembelajaran digital", video:"https://www.youtube.com/embed/fiuhu924--M", pdf:"modul/Pembelajaran Digital.pdf", resources:["Slide 1","Template RPP"] },
  { id:2, title:"Model ADDIE", minutes:12, summary:"Tahapan ADDIE dan contoh penerapan", video:"https://www.youtube.com/embed/L6zL1h9E1nQ", pdf:"modul/ADDIE.pdf", resources:["Contoh ADDIE","Checklist"] },
  { id:3, title:"UI/UX untuk e-Learning", minutes:10, summary:"Prinsip desain antarmuka untuk pembelajaran", video:"", pdf:"modul/UIUX.pdf", resources:["Panduan Warna","Tips Aksesibilitas"] },
];

const moduleListEl = document.getElementById('moduleList');
const miniProgressEl = document.getElementById('miniProgress');
const courseProgressEl = document.getElementById('courseProgress');
const coursePercentEl = document.getElementById('coursePercent');
const mediaCard = document.getElementById('mediaCard');
const videoFrame = document.getElementById('videoFrame');
const pdfEmbed = document.getElementById('pdfEmbed');
const pdfViewer = document.getElementById('pdfViewer');
const lessonTitle = document.getElementById('lessonTitle');
const lessonDesc = document.getElementById('lessonDesc');
const resourcesList = document.getElementById('resourcesList');
const lessonSummary = document.getElementById('lessonSummary');
const assignmentCard = document.getElementById('assignmentCard');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const quizModal = document.getElementById('quizModal');
const openQuizBtn = document.getElementById('openQuiz');
const closeQuiz = document.getElementById('closeQuiz');
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');
const startCourseBtn = document.getElementById('startCourseBtn');
const toggleTheme = document.getElementById('toggleTheme');
const chat = document.getElementById('chat');
const sendChat = document.getElementById('sendChat');
const chatInput = document.getElementById('chatInput');
const yearEl = document.getElementById('year');
const lastSync = document.getElementById('lastSync');
const coursePercentValue = () => {
  const done = modules.filter(m => localStorage.getItem('done_'+m.id) === '1').length;
  return Math.round((done/modules.length)*100);
};

// render modules in sidebar
function renderModules(){
  moduleListEl.innerHTML = '';
  modules.forEach(m=>{
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.className = localStorage.getItem('active')==m.id ? 'active' : '';
    li.innerHTML = `<div style="flex:1">
        <div class="m-title">${m.title}</div>
        <div class="m-meta">${m.minutes} menit • ${localStorage.getItem('done_'+m.id) ? 'Selesai' : 'Belum'}</div>
      </div>`;
    li.addEventListener('click', ()=>openModule(m.id));
    li.addEventListener('keydown', (e)=>{ if(e.key==='Enter') openModule(m.id) });
    moduleListEl.appendChild(li);
  });
  // mini progress
  miniProgressEl.innerHTML = '';
  modules.forEach(m=>{
    const li = document.createElement('li');
    li.textContent = `${m.title} — ${localStorage.getItem('done_'+m.id)?'✓':'—'}`;
    miniProgressEl.appendChild(li);
  });

  const percent = coursePercentValue();
  courseProgressEl.style.width = percent+'%';
  coursePercentEl.textContent = percent+'%';
}

// open a module
function openModule(id){
  localStorage.setItem('active', id);
  renderModules();
  const m = modules.find(x=>x.id==id);
  lessonSummary.textContent = '';
  mediaCard.hidden = false;
  assignmentCard.hidden = false;

  lessonTitle.textContent = m.title;
  lessonDesc.textContent = m.summary;
  // video or pdf
  videoFrame.innerHTML = '';
  if(m.video){
    const iframe = document.createElement('iframe');
    iframe.src = m.video;
    iframe.title = 'Video pembelajaran';
    iframe.allowFullscreen = true;
    videoFrame.appendChild(iframe);
    pdfEmbed.hidden = true;
  } else if(m.pdf){
    pdfViewer.src = m.pdf;
    pdfEmbed.hidden = false;
  } else {
    videoFrame.innerHTML = `<div style="color:#fff;padding:20px">Tidak ada video</div>`;
    pdfEmbed.hidden = true;
  }

  // resources
  resourcesList.innerHTML = '';
  m.resources.forEach(r=>{
    const li = document.createElement('li');
    li.textContent = r;
    resourcesList.appendChild(li);
  });

  // assignment example:
  assignmentCard.hidden = false;
  document.getElementById('assignmentDesc').textContent = `Kerjakan tugas singkat terkait "${m.title}". Unggah file PDF/ZIP.`;
}

// mark done
document.getElementById('markDone').addEventListener('click', ()=>{
  const id = localStorage.getItem('active');
  if(!id) return alert('Pilih modul terlebih dahulu.');
  localStorage.setItem('done_'+id, '1');
  renderModules();
});

// quiz modal
openQuizBtn.addEventListener('click', ()=>{ quizModal.setAttribute('aria-hidden','false') });
closeQuiz.addEventListener('click', ()=>{ quizModal.setAttribute('aria-hidden','true'); quizResult.textContent=''; quizForm.reset(); });
quizForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const form = new FormData(quizForm);
  const a = form.get('q1');
  quizResult.textContent = (a==='analysis') ? 'Jawaban benar — Analysis.' : 'Jawaban salah. Jawaban yang tepat: Analysis.';
});

// start course
startCourseBtn.addEventListener('click', ()=>{
  const firstId = modules[0].id;
  openModule(firstId);
  document.getElementById('content').focus();
});

// upload (simulasi)
uploadBtn.addEventListener('click', ()=>{
  const f = document.getElementById('fileUpload').files[0];
  if(!f) { uploadStatus.textContent = 'Pilih file dulu.'; return; }
  uploadStatus.textContent = 'Mengunggah...';
  setTimeout(()=>{ uploadStatus.textContent = 'Berhasil diunggah.'; }, 900);
});

// theme toggle
toggleTheme.addEventListener('click', ()=>{
  const on = document.body.classList.toggle('dark');
  toggleTheme.textContent = on ? '☀️ Mode Terang' : '🌙 Mode Gelap';
  toggleTheme.setAttribute('aria-pressed', String(on));
});

// chat
sendChat.addEventListener('click', sendMsgFromInput);
chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMsgFromInput(); });
function sendMsgFromInput(){
  const v = chatInput.value.trim(); if(!v) return;
  const div = document.createElement('div'); div.className='msg user'; div.innerHTML = `<strong>Kamu:</strong> ${v}`;
  chat.appendChild(div);
  chatInput.value='';
  chat.scrollTop = chat.scrollHeight;
  setTimeout(()=>{ const bot = document.createElement('div'); bot.className='msg bot'; bot.innerHTML = `<strong>Dosen:</strong> Terima kasih, nanti saya cek.`; chat.appendChild(bot); chat.scrollTop = chat.scrollHeight; },700);
}

// simple chart placeholder (bars representing time spent)
function drawChart(){
  try{
    const ctx = document.getElementById('progressChart').getContext('2d');
    // draw simple bars
    ctx.clearRect(0,0,250,120);
    const data = [1,2,1.5,3,2.5,0.5,2]; // jam per hari
    const w = 250; const h = 120; const pad = 12;
    const barW = (w - pad*2) / data.length - 6;
    ctx.fillStyle = 'rgba(37,99,235,0.8)';
    data.forEach((v,i)=>{
      const x = pad + i*(barW+6);
      const bh = (v/4)* (h - pad*2);
      ctx.fillRect(x, h - pad - bh, barW, bh);
    });
  }catch(e){ /* ignore on unsupported */ }
}

// init
(function init(){
  renderModules();
  yearEl.textContent = new Date().getFullYear();
  lastSync.textContent = new Date().toLocaleString();
  drawChart();
  // restore theme
  if(window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches){
    document.body.classList.add('dark');
    toggleTheme.textContent = '☀️ Mode Terang';
  }
})();
