/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.previewModalHTML = document.querySelector('.uploaded-previewer-modal');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.previewModalHTML.querySelector('.x.icon').addEventListener('click', () => {
      this.close();
    });

    this.previewModalHTML.querySelector('.content').addEventListener('click', (e) => {
      if (e.target.classList.contains('delete') || e.target.classList.contains('trash')) {
        e.target.closest('.image-preview-container').querySelector('.trash.icon').className = 'icon spinner loading';
        e.target.closest('.image-preview-container').querySelector('.button.delete').classList.add('disabled');
        Yandex.removeFile(e.target.closest('.image-preview-container').querySelector('.button.delete').dataset.path.substring(6), () => {
          e.target.closest('.image-preview-container').remove();
          if (this.previewModalHTML.querySelectorAll('.image-preview-container').length === 0) {
            this.close();
          }
        });
      } else if (e.target.classList.contains('download')) {
        Yandex.downloadFileByUrl(e.target.closest('.image-preview-container').querySelector('.button.download').dataset.file);
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    let imagesHTML = [];
    for (const item of data.items.reverse()) {
      imagesHTML.push(this.getImageInfo(item));
    }
    imagesHTML = imagesHTML.join('');
    this.previewModalHTML.querySelector('.content').innerHTML = imagesHTML;
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const day = new Date(Date.parse(date));
    const dateOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
    }
    return `${day.toLocaleString('ru', dateOptions)} в ${day.toLocaleString('ru', timeOptions)}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src="${item.preview}" />
        <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${(item.size / 1024).toFixed(2)} Кб</td></tr>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path="${item.path}">
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file="${item.file}">
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `;
  }
}