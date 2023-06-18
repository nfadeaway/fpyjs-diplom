/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    if (!localStorage.getItem('yaDiskOAuthToken') || localStorage.getItem('yaDiskOAuthToken') === 'null') {
      localStorage.setItem('yaDiskOAuthToken', prompt('Введите Я.Диск OAuth-токен'));
    }
    return localStorage.getItem('yaDiskOAuthToken');
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: this.HOST + '/resources/upload',
      headers: {
        authorization: `OAuth ${this.getToken()}`,
      },
      data: {
        path: path,
        url: url,
      },
      callback: callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({
      method: 'DELETE',
      url: this.HOST + '/resources',
      headers: {
        authorization: `OAuth ${this.getToken()}`,
      },
      params: {
        path: path,
      },
      callback: callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({
      method: 'GET',
      url: this.HOST + '/resources/files',
      headers: {
        authorization: `OAuth ${this.getToken()}`,
      },
      callback: callback,
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.click();
  }
}