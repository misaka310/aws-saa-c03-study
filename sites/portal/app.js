(() => {
  'use strict';

  let payload = { documents: [], images: [] };
  let currentDocumentId = '';
  const elements = {};

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    Object.assign(elements, {
      materials: document.getElementById('materials-panel'),
      final: document.getElementById('final-panel'),
      list: document.getElementById('document-list'),
      search: document.getElementById('doc-search'),
      title: document.getElementById('document-title'),
      category: document.getElementById('document-category'),
      content: document.getElementById('document-content'),
      gallery: document.getElementById('image-gallery'),
      dialog: document.getElementById('image-dialog'),
      dialogImage: document.getElementById('dialog-image'),
      dialogCaption: document.getElementById('dialog-caption'),
      status: document.getElementById('status'),
    });
    setupPanels();
    setupDialog();
    try {
      const response = await fetch('./content.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`教材データの読み込みに失敗しました (${response.status})`);
      payload = await response.json();
      elements.search.addEventListener('input', renderDocumentList);
      document.querySelectorAll('[data-open-doc]').forEach((button) => {
        button.addEventListener('click', () => openDocument(button.dataset.openDoc));
      });
      renderGallery();
      const requested = new URLSearchParams(location.search).get('doc');
      openDocument(payload.documents.some((doc) => doc.id === requested) ? requested : '01-start-here');
    } catch (error) {
      elements.content.innerHTML = `<p>教材を読み込めませんでした。ページを再読み込みしてください。</p><pre>${escapeHtml(error.message)}</pre>`;
    }
  }

  function setupPanels() {
    document.querySelectorAll('[data-panel]').forEach((button) => {
      button.addEventListener('click', () => showPanel(button.dataset.panel));
    });
  }

  function showPanel(name) {
    elements.materials.hidden = name !== 'materials';
    elements.final.hidden = name !== 'final';
    document.querySelectorAll('[data-panel]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.panel === name);
    });
    (name === 'materials' ? elements.materials : elements.final).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderDocumentList() {
    const query = elements.search.value.trim().toLocaleLowerCase('ja-JP');
    const documents = payload.documents.filter((doc) => !query || `${doc.title}\n${doc.category}\n${doc.searchText}`.toLocaleLowerCase('ja-JP').includes(query));
    elements.list.innerHTML = documents.map((doc) => `
      <button type="button" data-doc-id="${escapeHtml(doc.id)}" class="${doc.id === currentDocumentId ? 'is-active' : ''}">
        ${escapeHtml(doc.title)}<span>${escapeHtml(doc.category)}</span>
      </button>`).join('') || '<p>一致する教材がありません。</p>';
    elements.list.querySelectorAll('[data-doc-id]').forEach((button) => {
      button.addEventListener('click', () => openDocument(button.dataset.docId));
    });
  }

  function openDocument(id) {
    const doc = payload.documents.find((item) => item.id === id);
    if (!doc) return;
    currentDocumentId = id;
    showPanel('materials');
    elements.title.textContent = doc.title;
    elements.category.textContent = doc.category;
    elements.content.innerHTML = doc.html;
    renderDocumentList();
    const url = new URL(location.href);
    url.searchParams.set('doc', id);
    history.replaceState(null, '', url);
    bindContentLinks();
    bindContentImages();
    elements.title.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bindContentLinks() {
    elements.content.querySelectorAll('[data-doc-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openDocument(link.dataset.docLink);
      });
    });
  }

  function bindContentImages() {
    elements.content.querySelectorAll('img').forEach((image) => {
      image.tabIndex = 0;
      image.addEventListener('click', () => openImage(image.src, image.alt || '教材図解'));
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') openImage(image.src, image.alt || '教材図解');
      });
    });
  }

  function renderGallery() {
    elements.gallery.innerHTML = payload.images.map((image) => `
      <figure class="image-card">
        <button type="button" data-image-src="./images/${encodeURI(image.file)}" data-image-label="${escapeHtml(image.label)}">
          <img src="./images/${encodeURI(image.file)}" alt="${escapeHtml(image.label)}" loading="lazy">
        </button>
        <figcaption>${escapeHtml(image.label)}</figcaption>
      </figure>`).join('');
    elements.gallery.querySelectorAll('[data-image-src]').forEach((button) => {
      button.addEventListener('click', () => openImage(button.dataset.imageSrc, button.dataset.imageLabel));
    });
  }

  function setupDialog() {
    document.getElementById('close-image-dialog').addEventListener('click', () => elements.dialog.close());
    elements.dialog.addEventListener('click', (event) => {
      if (event.target === elements.dialog) elements.dialog.close();
    });
  }

  function openImage(src, label) {
    elements.dialogImage.src = src;
    elements.dialogImage.alt = label;
    elements.dialogCaption.textContent = label;
    elements.dialog.showModal();
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }
})();
