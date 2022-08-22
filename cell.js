class Cell {
  constructor(i, x, y, tile = null, options = []) {
    this.index = i;
    this.tile = tile;
    this.options = tile ? [tile] : options;
    this.collapsed = tile ? true : false;
    this.x = x;
    this.y = y;
  }

  entropy = () => this.options.length;

  evaluate = (upTile, rightTile, downTile, leftTile) => {
    // Look up
    if (upTile) {
      this.options = this.options.filter(
        (tile) => upTile.edges[2] === tile.edges[0]
      );
    }
    // Look right
    if (rightTile) {
      this.options = this.options.filter(
        (tile) => rightTile.edges[3] === tile.edges[1]
      );
    }
    // Look down
    if (downTile) {
      this.options = this.options.filter(
        (tile) => downTile.edges[0] === tile.edges[2]
      );
    }
    // Look up
    if (leftTile) {
      this.options = this.options.filter(
        (tile) => leftTile.edges[1] === tile.edges[3]
      );
    }
  };

  collapse = () => {
    this.tile = random(this.options);
    this.options = [this.tile];
    this.collapsed = true;
  };

  setTile = (tile) => {
    this.tile = tile;
    this.options = [tile];
    this.collapsed = true;
  };
}
