/**
 * Валидация и форматирование номеров телефонов
 * Использует libphonenumber-js для точной проверки
 */

import {
  parsePhoneNumberWithError,
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

/**
 * Валидация номера телефона
 * @param phone - номер телефона в любом формате
 * @param defaultCountry - страна по умолчанию (RU для России/Казахстана)
 * @returns объект с результатом валидации
 */
export function validatePhone(
  phone: string,
  defaultCountry: string = 'RU'
): {
  valid: boolean;
  formatted?: string;
  error?: string;
  e164?: string;
} {
  // Удаляем всё кроме цифр и +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Если номер начинается с 8 (внутренний формат России/Казахстана), заменяем на +7
  let normalized = cleaned;
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    normalized = '+7' + cleaned.slice(1);
  }

  try {
    const phoneNumber = parsePhoneNumberWithError(normalized, {
      defaultCountry: defaultCountry as any,
    });

    if (!phoneNumber.isValid()) {
      return {
        valid: false,
        error: 'Неверный формат номера телефона',
      };
    }

    return {
      valid: true,
      formatted: phoneNumber.formatInternational(),
      e164: phoneNumber.format('E.164'),
    };
  } catch {
    // Если не удалось распознать — упрощённая валидация
    const digits = cleaned.replace(/\D/g, '');

    if (digits.length >= 10 && digits.length <= 15) {
      return {
        valid: true,
        formatted: phone,
      };
    }

    return {
      valid: false,
      error: 'Номер телефона должен содержать от 10 до 15 цифр',
    };
  }
}

/**
 * Форматирование номера телефона для отображения
 * @param phone - номер телефона
 * @param defaultCountry - страна по умолчанию
 */
export function formatPhone(phone: string, defaultCountry: string = 'RU'): string {
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Если номер начинается с 8, заменяем на +7
  let normalized = cleaned;
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    normalized = '+7' + cleaned.slice(1);
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(normalized, {
      defaultCountry: defaultCountry as any,
    });
    return phoneNumber ? phoneNumber.formatInternational() : phone;
  } catch {
    return phone;
  }
}

/**
 * Форматирование телефона в реальном времени (маска ввода)
 * Использует AsYouType для пошагового форматирования
 * @param value - текущее значение ввода
 * @param defaultCountry - страна по умолчанию
 */
export function formatPhoneAsYouType(value: string, defaultCountry: string = 'RU'): string {
  const formatter = new AsYouType(defaultCountry as any);
  return formatter.input(value);
}

/**
 * Быстрая проверка валидности без парсинга
 * @param phone - номер телефона
 * @param defaultCountry - страна по умолчанию
 */
export function isValidPhoneQuick(phone: string, defaultCountry: string = 'RU'): boolean {
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Если номер начинается с 8, заменяем на +7
  let normalized = cleaned;
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    normalized = '+7' + cleaned.slice(1);
  }

  return isValidPhoneNumber(normalized, defaultCountry as any);
}
