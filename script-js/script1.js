const openModul = document.getElementById('openModul');
const openVideo = document.getElementById('openVideo');
const contentArea = document.getElementById('contentArea');

openModul.addEventListener('click', () => {
  contentArea.style.display = 'block';
  contentArea.innerHTML = `
    <iframe src="modul-etika.pdf" width="100%" height="500px" style="border:none;border-radius:10px;background:#fff;"></iframe>
  `;
});

openVideo.addEventListener('click', () => {
  contentArea.style.display = 'block';
  contentArea.innerHTML = `
    <iframe width="100%" height="400" src="https://www.youtube.com/embed/tgbNymZ7vqY" 
      title="Video Etika Digital"
      frameborder="0" allowfullscreen style="border-radius:10px;"></iframe>
  `;
});
