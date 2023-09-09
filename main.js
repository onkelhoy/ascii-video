const canvas = document.querySelector('canvas');
const videoElement = document.querySelector('video');

canvas.width = 800;
canvas.height = 400;

const context = canvas.getContext("2d", { willReadFrequently: true });

context.font = "8px Courier New";

// based on widht 50
let videodimheight = 1;
const SVW = 250; // squeezed video width

const charactures = 'WM#8@B&%$*+=-:.                  '


async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;


  videoElement.addEventListener('play', update);
  videoElement.addEventListener( "loadedmetadata", (e) => {
    const height = e.target.videoHeight;
    const width = e.target.videoWidth;
    videodimheight = ~~(100 * (height / width));
  })
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Flip the context horizontally
  context.save();
  context.scale(-1, 1);
  context.translate(-SVW, 0);

  context.drawImage(videoElement, 0, 0, SVW, videodimheight);
   
  // Restore the context to its original state
  context.restore();

  const imageData = context.getImageData(0, 0, SVW, videodimheight);
  context.clearRect(0, 0, SVW, videodimheight);

  let string = "";
  let row = 0;
  for (let i = 0; i < imageData.data.length; i += 4)
  {
    const r = imageData.data[i] / 255;
    const g = imageData.data[i + 1] / 255;
    const b = imageData.data[i + 2] / 255;

    let luminance = ((0.2126 * r) + (0.7152 * g) + (0.0722 * b)) ** 2;
    let mapped = Math.floor(luminance * (charactures.length - 1));
    string += charactures[mapped];

    if ((i / 4) % SVW === SVW - 1) {
      context.fillText(string, 0, row * 6);
      string = "";
      row++;
    }
  }

  requestAnimationFrame(update);
}

init();