/**
 * Convert English digits to Persian/Farsi digits
 */
export const toPersianDigits = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * Convert Persian/Farsi digits to English digits
 */
export const toEnglishDigits = (num: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = num;
  persianDigits.forEach((persianDigit, index) => {
    result = result.replace(new RegExp(persianDigit, 'g'), String(index));
  });
  return result;
};

/**
 * Format number based on locale
 * If locale is 'fa', convert to Persian digits
 * Otherwise, keep English digits
 */
export const formatNumber = (num: string | number, locale: string = 'en'): string => {
  if (locale === 'fa') {
    return toPersianDigits(num);
  }
  return String(num);
};
