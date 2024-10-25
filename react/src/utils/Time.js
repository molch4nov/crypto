export function getTimeFromDate(dateString) {
    // Создаем объект Date из строки
    const date = new Date(dateString);

    // Получаем часы, минуты и секунды
    const hours = date.getUTCHours(); // Используем getUTCHours для получения времени в UTC
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Форматируем время в строку
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return timeString;
}