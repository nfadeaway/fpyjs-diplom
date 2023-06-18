/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.element = element;
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.element.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.element.modal('hide');
  }
}