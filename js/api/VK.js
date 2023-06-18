/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '';
  static lastCallback;

  /**
   * Получает изображения
   */
  static get(id = '', callback) {
    const script = document.createElement('SCRIPT');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&photo_sizes=1&access_token=${this.ACCESS_TOKEN}&callback=callback&v=5.131`;
    script.id = 'photos_get';
    document.body.appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    try {
      document.querySelector('#photos_get').remove();
    } catch(err) {
      alert(`Ошибка ${err.name}: ${err.message}\n${err.stack}`);
      return false;
    }
    const objPhotos = JSON.parse(result);
    if (objPhotos['error']) {
      alert(`Ошибка: ${objPhotos['error']['error_msg']}`);
      return false;
    }
    let biggestPhotoArr = [];
    for (let i = 0; i < objPhotos['response']['count']; i++) {
      let photoSizes = objPhotos['response']['items'][i]['sizes'];
      biggestPhotoArr.push(photoSizes.sort((a, b) => b['height'] - a['height'])[0]['url']);
    }
    return biggestPhotoArr;
  }
}