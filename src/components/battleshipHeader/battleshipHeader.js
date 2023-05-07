import style from './battleshipHeader.css';
/**
 * @typedef {Object} HeaderDto
 * @property {String} iconPath path to icon asset
 */

/** @implements {Component<HeaderDto>} */
class BattleshipHeader {
  constructor({ iconPath }) {
    this.icon = iconPath;
  }

  render() {
    const header = document.createElement('header');
    header.classList.add('battleship-header');

    const icon = new Image();
    icon.src = this.icon;

    const titleContainer = document.createElement('div');
    const h = document.createElement('h1');
    h.textContent = 'Project Battleship';
    titleContainer.appendChild(h);

    header.append(icon, titleContainer);
    return header;
  }
}

export { BattleshipHeader };
