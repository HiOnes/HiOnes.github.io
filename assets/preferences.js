(() => {
  const layout = new URLSearchParams(window.location.search).get('layout');
  document.documentElement.dataset.layout = layout === 'sidebar' ? 'sidebar' : 'classic';
})();
