const MainViewFactory = function () {
  const frag = document.createDocumentFragment();

  return {
    render: function() {
      const spanHello = document.createElement('span');
      spanHello.textContent = 'Hello wuurld';
      
      frag.appendChild(spanHello);
      return frag;
    }
  }
}

export { MainViewFactory };