/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.uploaderModalHTML = document.querySelector('.file-uploader-modal');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    this.uploaderModalHTML.querySelector('.icon').addEventListener('click', () => {
      this.close();
    });

    this.uploaderModalHTML.querySelector('.close').addEventListener('click', () => {
      this.close();
    });

    this.uploaderModalHTML.querySelector('.send-all').addEventListener('click', () => {
      this.sendAllImages();
    });

    this.uploaderModalHTML.querySelector('.content').addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') {
        e.target.closest('.input').classList.remove('error');
      } else if (e.target.className === 'upload icon' || e.target.className === 'ui button') {
        this.sendImage(e.target.closest('.image-preview-container'));
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    let imagesHTML = [];
    for (const image of images.reverse()) {
      imagesHTML.push(this.getImageHTML(image));
    }
    imagesHTML = imagesHTML.join('');
    this.uploaderModalHTML.querySelector('.content').innerHTML = imagesHTML;
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src="${item.src}" />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>
    `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    for (const imagePreviewContainer of this.uploaderModalHTML.querySelectorAll('.image-preview-container')) {
      this.sendImage(imagePreviewContainer);
    }
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    if (imageContainer.querySelector('input').value === '') {
      imageContainer.querySelector('.input').classList.add('error');
      return;
    } else {
      let path = imageContainer.querySelector('input').value;
      if (path.substring(path.length - 4) != '.jpg') {
        path += '.jpg';
      }
      const url = imageContainer.querySelector('img').src;
      imageContainer.querySelector('.input').classList.add('disabled');
      Yandex.uploadFile(path, url, () => {
        imageContainer.remove();
        if (this.uploaderModalHTML.querySelectorAll('.image-preview-container').length === 0) {
          this.close();
        }
      });
    }
  }
}