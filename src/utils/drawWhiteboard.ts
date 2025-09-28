export const drawWhiteboard = (
  ctx: CanvasRenderingContext2D,
  boardWidth: number,
  boardHeight: number,
  texts: string[]
) => {
  const NUM_ROWS = 5;
  const NUM_COLS = 2;
  const borderPadding = boardWidth * 0.025;
  const textPadding = boardWidth * 0.015;

  const gridWidth = boardWidth - borderPadding * 2;
  const gridHeight = boardHeight - borderPadding * 2;

  const colWidths = [gridWidth * 0.3, gridWidth * 0.7];
  const cellHeight = gridHeight / NUM_ROWS;
  const effectiveCellHeight = cellHeight - textPadding * 2;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, boardWidth, boardHeight);
  ctx.strokeRect(borderPadding, borderPadding, gridWidth, gridHeight);

  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let i = 1; i < NUM_ROWS; i++) {
    const y = borderPadding + i * cellHeight;
    ctx.moveTo(borderPadding, y);
    ctx.lineTo(boardWidth - borderPadding, y);
  }

  const verticalLineX = borderPadding + colWidths[0];
  ctx.moveTo(verticalLineX, borderPadding);
  ctx.lineTo(verticalLineX, borderPadding + gridHeight);
  ctx.stroke();

  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      const index = row * NUM_COLS + col;
      const text = texts[index] || '';

      const currentCellWidth = colWidths[col];
      const effectiveCellWidth = currentCellWidth - textPadding * 2;

      const fontSize = Math.min(24, effectiveCellHeight / 2);
      const lineHeight = fontSize * 1.4;
      ctx.font = `900 ${fontSize}px 'Noto Serif JP', serif`;

      const lines = wrapText(ctx, text, effectiveCellWidth);
      const cellLeftX = borderPadding + (col === 0 ? 0 : colWidths[0]);
      const cellTopY = borderPadding + row * cellHeight;

      const textBlockHeight = lines.length * lineHeight;
      const textStartX = cellLeftX + currentCellWidth / 2;
      let textStartY = cellTopY + cellHeight / 2 - textBlockHeight / 2 + lineHeight / 2;

      lines.forEach(line => {
        ctx.fillText(line, textStartX, textStartY);
        textStartY += lineHeight;
      });
    }
  }
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i];
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
};