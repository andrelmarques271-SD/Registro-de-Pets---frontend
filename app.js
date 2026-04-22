const API_URL = 'https://registro-de-pets-backend.onrender.com/animals';

const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const nome = document.getElementById('title');       // reaproveitando campo
const raca = document.getElementById('description'); // reaproveitando campo
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

function showMessage(text) {
  message.textContent = text;
}

function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo Pet';
  cancelEdit.classList.add('hidden');
}

async function loadEntries() {
  const response = await fetch(API_URL);
  const animals = await response.json();

  if (!animals.length) {
    entriesList.innerHTML = '<p>Nenhum pet encontrado.</p>';
    return;
  }

  entriesList.innerHTML = animals.map(animal => `
    <div class="entry-item">
      <h3>${animal.nome}</h3>
      <p>Raça: ${animal.raça}</p>

      <div class="entry-buttons">
        <button onclick="editEntry('${animal._id}')">Editar</button>
        <button onclick="deleteEntry('${animal._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {
  const response = await fetch(`${API_URL}/${id}`);
  const animal = await response.json();

  entryId.value = animal._id;
  nome.value = animal.nome;
  raca.value = animal.raça;

  formTitle.textContent = 'Editar Pet';
  cancelEdit.classList.remove('hidden');
  showMessage('Editando pet.');
};

window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este pet?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMessage('Pet excluído.');
  loadEntries();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: nome.value,
    raça: raca.value
  };

  await saveEntry(data);
  showMessage(entryId.value ? 'Pet atualizado.' : 'Pet criado.');
  clearForm();
  loadEntries();
});

cancelEdit.addEventListener('click', () => {
  clearForm();
  showMessage('Edição cancelada.');
});

reloadBtn.addEventListener('click', loadEntries);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
      console.log('Service Worker registrado com sucesso.');
    } catch (error) {
      console.log('Erro ao registrar Service Worker:', error);
    }
  });
}

clearForm();
loadEntries();