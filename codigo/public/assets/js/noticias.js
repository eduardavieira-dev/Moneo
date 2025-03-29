const API_URL = 'http://localhost:3000/noticias';
async function fetchNoticias() {
  try {
    const response = await fetch(API_URL);
    const noticias = await response.json();
    renderCarousel(noticias);
    renderRelatedNews(noticias);
    setupFilters(noticias);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
  }
}

function renderCarousel(noticias) {
  const carouselContent = document.getElementById('carouselContent');
  carouselContent.innerHTML = '';

  noticias.forEach((noticia, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselContent.innerHTML += `
      <div class="carousel-item ${activeClass}">
        <img src="${noticia.imagem}" class="d-block w-100" alt="${noticia.titulo}">
        <div class="carousel-caption">
          <h5>${noticia.titulo}</h5>
          <p>${noticia.descricao}</p>
        </div>
      </div>`;
  });
}

function renderRelatedNews(noticias) {
  const relatedNewsContainer = document.getElementById('related-news');
  relatedNewsContainer.innerHTML = '';

  noticias.forEach(noticia => {
    relatedNewsContainer.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card">
          <a href="#" target="_blank">
            <img src="${noticia.imagem}" class="card-img-top" alt="${noticia.titulo}">
          </a>
          <div class="card-body">
            <h5 class="card-title">${noticia.titulo}</h5>
            <p class="card-text">${noticia.descricao}</p>
            <small class="text-muted">Por ${noticia.autor} - ${noticia.data}</small>
          </div>
        </div>
      </div>`;
  });
}

function setupFilters(noticias) {
  const categoryFilters = document.querySelectorAll('.category-filter');
  const searchInput = document.getElementById('searchBar');

  categoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.getAttribute('data-category');
      const filteredNoticias = category === 'todas' ? noticias : noticias.filter(n => n.categoria === category);
      renderRelatedNews(filteredNoticias);
    });
  });

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNoticias = noticias.filter(n => n.titulo.toLowerCase().includes(searchTerm));
    renderRelatedNews(filteredNoticias);
  });
}

document.getElementById('noticiaForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const noticia = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    imagem: document.getElementById('imagem').value,
    autor: document.getElementById('autor').value,
    categoria: document.getElementById('categoria').value,
    data: new Date().toLocaleDateString(),
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticia),
    });
    fetchNoticias();
    event.target.reset();
  } catch (error) {
    console.error('Erro ao cadastrar notícia:', error);
  }
});

fetchNoticias();


document.addEventListener("DOMContentLoaded", function(){
  preencherCampos();
})
function preencherCampos() {
const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

if (usuario) {
  document.getElementById('headerNomeUsuario').innerText = usuario.nome;
  document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100';
} else {
  alert("Usuário não encontrado.");
}
}