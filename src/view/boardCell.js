import {
  findIconDefinition,
  icon,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(far);

/**
 * @param {import("../service/gameboard").BoardCellDto} boardCell
 * @returns {UpdatableView<import("../service/gameboard").BoardCellDto>}
 */
const boardCellFactory = function (boardCell) {
  const div = document.createElement('div');

  /**
   * @param {import('../service/gameboard').BoardCellDto} boardCell
   */
  const _getIcon = (boardCell) => {
    if (boardCell.ship) {
      if (boardCell.isHit)
        return icon(findIconDefinition({ prefix: 'far', iconName: 'xmark' }));
      return icon(findIconDefinition({ prefix: 'far', iconName: 'ship' }));
    } else {
      if (boardCell.isHit)
        return icon(
          findIconDefinition({
            prefix: 'far',
            iconName: 'location-crosshairs-slash',
          }),
        );
      return icon(findIconDefinition({ prefix: 'far', iconName: 'water' }));
    }
  };

  return {
    render: function () {
      div.replaceChildren(_getIcon(boardCell));
      return div;
    },
    update: function (boardCell) {
      div.replaceChildren(_getIcon(boardCell));
    },
  };
};

export { boardCellFactory };
