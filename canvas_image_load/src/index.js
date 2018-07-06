import "normalize.css";
import './css/main.css'
import ImageRender from './js/ImageRender'

const file = document.createElement('input');
file.type = 'file';
file.accept = 'image/*'

file.addEventListener('change', event => {
  const input = event.target;
  const fileName = input.value;
  if (fileName) {
    //remove`
    if (window.__clear) window.clearTimeout(window.__clear);
    document.getElementById('app').innerHTML = '';
    let imageFile = input.files[0];
    loadImage(imageFile, ImageRender);
  }
})

const button = document.querySelector('.btn');
button.addEventListener('click', event => {
  file.click();
});

function loadImage(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    let img = document.createElement('img');
    img.src = e.target.result;
    img.onload = function () {
      typeof callback === 'function' && callback(img)
    }
  }

  reader.readAsDataURL(file);


}
