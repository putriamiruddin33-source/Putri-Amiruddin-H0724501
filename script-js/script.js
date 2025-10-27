
    // Fitur pencarian
    const input = document.getElementById('search');
    const cards = document.querySelectorAll('.card');

    input.addEventListener('input', () => {
      const keyword = input.value.toLowerCase();
      cards.forEach(card => {
        const title = card.dataset.title.toLowerCase();
        card.style.display = title.includes(keyword) ? 'flex' : 'none';
      });
    });
  