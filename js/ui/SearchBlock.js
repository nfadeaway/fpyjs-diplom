/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.element.querySelector('.add').addEventListener('click', () => {
      if (this.element.querySelector('input').value) {
        VK.get(this.element.querySelector('input').value, callback);
      }
    }); 
    
    this.element.querySelector('.replace').addEventListener('click', () => {
      if (this.element.querySelector('input').value) {
        App.imageViewer.clear();
        VK.get(this.element.querySelector('input').value, callback);
      }
    }); 
  }
}

function callback(result) {
  VK.lastCallback = result;
  let images = VK.processData(JSON.stringify(VK.lastCallback));
  VK.lastCallback = () => {};
  images !== false ? App.imageViewer.drawImages(images) : null;
}