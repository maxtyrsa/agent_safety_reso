/**
 * Простая валидация номеров телефонов для России и Казахстана
 * Без внешних зависимостей
 */

export function validatePhoneNumber(phone: string): { valid: boolean; formatted?: string; error?: string } {
  // Удаляем все нецифровые символы кроме +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Проверяем наличие плюса в начале
  const hasPlus = cleaned.startsWith('+');
  
  // Получаем только цифры
  const digits = cleaned.replace(/\D/g, '');
  
  // Проверка длины (международный формат 10-15 цифр)
  if (digits.length < 10 || digits.length > 15) {
    return { 
      valid: false, 
      error: 'Номер телефона должен содержать от 10 до 15 цифр' 
    };
  }
  
  // Проверка кодов стран (Россия, Казахстан)
  const ruCodes = ['7'];
  const kzCodes = ['7'];
  
  // Если номер начинается с 8, заменяем на +7
  let normalized = digits;
  if (digits.startsWith('8') && digits.length === 11) {
    normalized = '7' + digits.slice(1);
  }
  
  // Проверяем код страны
  if (!ruCodes.includes(normalized[0]) && !kzCodes.includes(normalized[0])) {
    // Разрешаем любые международные номера
    if (normalized.length < 10) {
      return { 
        valid: false, 
        error: 'Неверный формат номера телефона' 
      };
    }
  }
  
  // Форматирование в красивый вид
  let formatted = '';
  if (normalized.startsWith('7')) {
    // Россия/Казахстан: +7 (XXX) XXX-XX-XX
    if (normalized.length === 11) {
      formatted = `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9)}`;
    } else {
      formatted = `+${normalized.slice(0, 1)} (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
    }
  } else {
    // Другие страны: просто добавляем плюс
    formatted = hasPlus ? cleaned : '+' + cleaned;
  }
  
  return {
    valid: true,
    formatted
  };
}

export function formatPhoneForDisplay(phone: string): string {
  const result = validatePhoneNumber(phone);
  return result.formatted || phone;
}
