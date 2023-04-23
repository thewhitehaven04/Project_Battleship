/**
 * @returns {View} 
 */
const HeaderViewFactory = function() {
  const header = document.createElement('header');

  return {
    render: function() {
      return header;
    }
  }
}