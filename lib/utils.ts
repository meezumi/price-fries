export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if(priceText) return priceText.replace(/[^\d.]/g, '');
    // (/[^0-9]/g, '') or (/\D/gc, '') bith can be used.
    // to remove non-digit characters from it
  }

  return '';
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
}