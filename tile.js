class Tile {
  constructor(img, edges) {
    this.img = img;
    this.edges = edges;
  }

  rotate(n) {
    push();
    let rotatedImage = createGraphics(IMG_SIZE, IMG_SIZE);
    rotatedImage.imageMode(CENTER);
    rotatedImage.translate(IMG_SIZE / 2, IMG_SIZE / 2);
    rotatedImage.rotate((PI / 2) * n);
    rotatedImage.image(this.img, 0, 0, IMG_SIZE, IMG_SIZE);
    pop();

    let rotatedEdges = [...this.edges];
    for (let i = 0; i < n; i++) {
      const leftover = rotatedEdges.pop();
      rotatedEdges.unshift(leftover);
    }

    return new Tile(rotatedImage, rotatedEdges);
  }
}
