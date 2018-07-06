let windowHeight = document.body.clientHeight * 0.8;
let windowWidth = document.body.clientWidth * 0.8;
let windowScale = windowHeight / windowWidth;
export default img => {
  let height, width, canvas, ctx, dataArr, clearCount;
  let h = img.height;
  let w = img.width;
  let scale = h / w;
  if (windowScale > scale) {
    width = windowWidth > w ? w : windowWidth;
    height = width * scale;
  } else {
    height = windowHeight > h ? h : windowHeight;
    width = height / scale;
  }

  createCanvas();
  initMask();
  let step = ~~(width * height / 50000) + 1;
  dataArr = initArray(width, height, step);
  clearCount = dataArr.length / (15 * 1000) + 1;
  ctx.globalCompositeOperation = 'destination-out';
  startDraw();

  function createCanvas() {
    let sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    sourceCanvas.className = 'canvas'
    sourceCanvas.style.marginLeft = `-${width/2}px`;
    sourceCanvas.style.marginTop = `-${height/2}px`;
    let c = sourceCanvas.getContext('2d');
    c.drawImage(img, 0, 0, width, height);
    document.getElementById('app').appendChild(sourceCanvas);

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'canvas'
    canvas.style.marginLeft = `-${width/2}px`;
    canvas.style.marginTop = `-${height/2}px`;
    document.getElementById('app').appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  function initMask(color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height)

  }

  function startDraw(delay = 1) {
    for (let i = 0; i < clearCount; i++) {
      clearRect();
    }
    if (dataArr.length > 0) {
      window.__clear = setTimeout(() => {
        startDraw(delay)
      }, delay);
    }
  }

  function clearRect() {
    if (dataArr.length == 0) return;
    let z = randBetween(0, dataArr.length);
    let obj = dataArr.splice(z, 1)[0];
    ctx.fillRect(obj.x, obj.y, obj.step, obj.step);
  }

}

function randBetween(minNumber, maxNumber) {
  return ~~(Math.random() * (maxNumber - minNumber)) + minNumber;
}

function initArray(w, h, step = 1) {
  let list = [];
  for (let x = 0; x <= w; x += step) {
    for (let y = 0; y <= h; y += step) {
      const obj = {
        x,
        y,
        step
      }
      list.push(obj);
    }
  }
  return list;
}
