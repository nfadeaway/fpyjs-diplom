/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.imagesBlock = element.querySelector('.row');
    this.previewImage = element.querySelector('.fluid');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.imagesBlock.addEventListener('dblclick', (e) => {
      if (e.target.tagName === 'IMG') {
        this.previewImage.src = e.target.src;
      }
    });

    this.imagesBlock.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      }
    });

    this.element.querySelector('.select-all').addEventListener('click', () => {
      const allImages = Array.from(this.imagesBlock.querySelectorAll('img'));
      if (allImages.filter(element => element.classList.contains('selected')).length > 0) {
        allImages.forEach(element => element.classList.remove('selected'));
      } else {
        allImages.forEach(element => element.classList.add('selected'));
      }
      this.checkButtonText();
    });
    
    this.element.querySelector('.send').addEventListener('click', () => {
      const allImages = Array.from(this.imagesBlock.querySelectorAll('img'));
      const selectedImages = allImages.filter(element => element.classList.contains('selected'));
      const fileUploaderWindow = App.getModal('fileUploader');
      App.getModal('fileUploader').open();
      App.getModal('fileUploader').showImages(selectedImages);
    });
  
    this.element.querySelector('.show-uploaded-files').addEventListener('click', () => {
      Yandex.getUploadedFiles((response) => {
        App.getModal('filePreviewer').open();
        App.getModal('filePreviewer').showImages(response);
      });
    });
  
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesBlock.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const btnSelectAll = document.querySelector('.select-all');
    images ? btnSelectAll.classList.remove('disabled') : btnSelectAll.classList.add('disabled');
    let imagesToSiteHTML = '';
    for (const image of images) {
      imagesToSiteHTML += `<div class="four wide column ui medium image-wrapper"><img src="${image}" /></div>`;
    }
    this.imagesBlock.innerHTML += imagesToSiteHTML;
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const allImages = Array.from(this.imagesBlock.querySelectorAll('img'));
    const btnSelectAll = this.element.querySelector('.select-all');
    const btnSend = this.element.querySelector('.send');
    
    if (allImages.every(element => element.classList.contains('selected'))) {
      btnSelectAll.textContent = 'Снять выделение';
    } else {
      btnSelectAll.textContent = 'Выбрать всё';
    }

    if (allImages.filter(element => element.classList.contains('selected')).length > 0) {
      btnSend.classList.remove('disabled');
    } else {
      btnSend.classList.add('disabled');
    }
  }
}