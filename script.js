const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('#catalog-grid .card');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('catalog-empty');

let currentFilter = 'todos';

function filterCatalog() {
  const query = (searchInput?.value || '').toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category || '';
    const name = card.dataset.name || '';

    const matchCategory = currentFilter === 'todos' || category === currentFilter;
    const matchQuery = !query || name.includes(query);
    const show = matchCategory && matchQuery;

    card.hidden = !show;
    if (show) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter || 'todos';
    filterCatalog();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', filterCatalog);
}

const quoteButtons = document.querySelectorAll('.quote-btn');
const productSelect = document.getElementById('produto-select');
const hiddenProduct = document.getElementById('produto-selecionado');

quoteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product || '';

    if (productSelect) productSelect.value = product;
    if (hiddenProduct) hiddenProduct.value = product;

    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  });
});

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedProduct = productSelect?.value || hiddenProduct?.value || 'produto não especificado';

    alert(`Obrigado! Recebemos seu pedido para: ${selectedProduct}. Retornaremos em breve.`);
    form.reset();
    if (hiddenProduct) hiddenProduct.value = '';
  });
}

filterCatalog();
