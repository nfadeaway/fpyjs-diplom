/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  let url = new URL(options.url);
  
  if (options.method === 'POST') {
    url.searchParams.set('path', options.data.path);
    url.searchParams.set('url', options.data.url);
  } else if (options.method === 'DELETE') {
    url.searchParams.set('path', options.params.path);
  }

  try {
    xhr.open(options.method, url);
    xhr.setRequestHeader('Authorization', options.headers.authorization);
    xhr.responseType = 'json';
    xhr.send();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
  
  xhr.onload = function() {
    if (xhr.status !== 200 && xhr.status !== 202 && xhr.status !== 204) {
      alert( 'Ошибка: ' + xhr.status + '\n' + xhr.response.message);
      return;
    } else if (options.method === 'GET' || xhr.status === 204) {
      options.callback(xhr.response);
    } else {
      let interval = setTimeout(function requestStatus() {
        const responseStatusOperation = new XMLHttpRequest();
        responseStatusOperation.open('GET', xhr.response.href);
        responseStatusOperation.setRequestHeader('Authorization', options.headers.authorization);
        responseStatusOperation.responseType = 'json';
        responseStatusOperation.send();
        responseStatusOperation.onload = () => {
          if (responseStatusOperation.response.status === 'in-progress') {
            interval = setTimeout(requestStatus(), 1000);
          }
          if (responseStatusOperation.response.status === 'failed') {
            console.log(`Статус операции: ${responseStatusOperation.response.status}. Ошибка загрузки файла`);
            alert('Ошибка загрузки файла');
            return;
          } else {
            options.callback(xhr.response);
          }
        }
      }, 1000);
    }
  }
};