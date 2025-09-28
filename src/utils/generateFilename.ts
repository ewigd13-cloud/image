export const generateFilename = (
  texts: string[],
  counterMap: Record<string, number>
): string => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${month}.${day}`;

  const text1 = texts[1] || ''; // 例：設備名
  const text2 = texts[3] || ''; // 例：対象

  const baseFilename = `${dateString}${text1}${text2}`;

  const currentCount = counterMap[baseFilename] || 0;
  const newCount = currentCount + 1;
  counterMap[baseFilename] = newCount;

  const counterString = String(newCount).padStart(3, '0');
  return `${baseFilename}${counterString}.png`.replace(/\s+/g, '_');
};