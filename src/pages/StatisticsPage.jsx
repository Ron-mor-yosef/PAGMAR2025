import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { loadCSV } from '../utils/parseCSV';
import './StatisticsPage.css';

const CATEGORY_CLASSES = {
  'נפש': 'category-nefesh',
  'גוף': 'category-guf',
  'זוגיות': 'category-zugiyut',
  'ילדים': 'category-yeladim',
  'תעסוקה': 'category-taasukah',
  'אחר': 'category-other',
};

const StatisticsPage = () => {
  const sketchRef = useRef();
  const styleRefs = useRef({});

  // Create hidden elements for each category to read CSS variables
  useEffect(() => {
    Object.entries(CATEGORY_CLASSES).forEach(([cat, className]) => {
      if (!styleRefs.current[cat]) {
        const el = document.createElement('div');
        el.className = className;
        el.style.display = 'none';
        document.body.appendChild(el);
        styleRefs.current[cat] = el;
      }
    });
    return () => {
      Object.values(styleRefs.current).forEach(el => el.remove());
    };
  }, []);

  useEffect(() => {
    let p5Instance;

    const getCategoryStyle = (category) => {
      const el = styleRefs.current[category] || styleRefs.current['אחר'];
      const style = getComputedStyle(el);
      return {
        color: style.getPropertyValue('--category-color').trim(),
        font: style.getPropertyValue('--category-font').trim(),
        fontWeight: style.getPropertyValue('--category-font-weight').trim(),
        fontStyle: style.getPropertyValue('--category-font-style').trim(),
      };
    };

    const sketch = (p) => {
      const items = [];
      const placedItems = [];
      const padding = 20;

      const tryPlaceItem = (w, h, maxAttempts = 300) => {
        let attempts = 0;
        let factor = 0.43;
        let x, y;

        while (attempts < maxAttempts) {
          x = p.random((p.width * (1 - factor)) - p.width * factor, (p.width * factor) + p.width * factor - w);
          y = p.random((p.height * (1 - factor)) - p.height * factor, (p.height * factor) + p.height * factor - h);

          const overlaps = placedItems.some((other) => {
            const overlapX = x < other.x + other.width + padding &&
              x + w + padding > other.x;
            const overlapY = y < other.y + other.height + padding &&
              y + h + padding > other.y;
            return overlapX && overlapY;
          });

          if (!overlaps) return { x, y };
          attempts++;
        }

        return null;
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth - 2, p.windowHeight - 82);
        p.textAlign(p.RIGHT, p.CENTER);
        p.textDirection(p.RIGHT_TO_LEFT);
        p.noStroke();
        p.fill(255);
        p.textSize(24);
        p.text('📊 טוען נתונים...', p.width / 2, p.height / 2);

        loadCSV('/statistics.csv')
          .then((table) => {
            const maxBlockWidth = p.width * 0.22;

            for (let r = 0; r < table.length; r++) {
              const row = table[r];
              const explanation = row['הסבר'] || '';
              const rawPercent = row['אחוזים'] || '0%';
              const category = row['קטגוריה'] || 'אחר';
              const percent = parseFloat(rawPercent.replace('%', '').trim());

              if (isNaN(percent)) continue;

              const style = getCategoryStyle(category);

              const baseFontSize = p.map(percent, 0, 100, 16, 48);
              p.textFont(style.font);
              p.textStyle(style.fontStyle === 'italic' ? p.ITALIC : p.NORMAL);
              p.textWeight?.(style.fontWeight === 'bold' ? p.BOLD : p.NORMAL); // p5.js doesn't have textWeight, but you can use textStyle for bold if needed
              p.textSize(baseFontSize);

              const words = explanation.trim().split(/\s+/);
              const lines = [];
              let line = '';

              for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                if (
                  p.textWidth(testLine) > maxBlockWidth &&
                  line.trim().split(' ').length >= 2
                ) {
                  lines.push(line.trim());
                  line = words[i] + ' ';
                } else {
                  line = testLine;
                }
              }

              if (line.trim()) {
                lines.push(line.trim());
              }

              // Ensure last line has at least 2 words (if more than 1 line)
              if (lines.length > 1) {
                const lastWords = lines[lines.length - 1].split(' ');
                if (lastWords.length < 2) {
                  const popped = lines.pop();
                  lines[lines.length - 1] += ' ' + popped;
                }
              }

              const blockWidth = Math.max(...lines.map((l) => p.textWidth(l)));
              const blockHeight = lines.length * baseFontSize * 1.2;

              const placement = tryPlaceItem(blockWidth, blockHeight);
              if (!placement) {
                console.warn('⛔ Skipping due to lack of space:', explanation);
                continue;
              }

              const { x, y } = placement;

              placedItems.push({ x, y, width: blockWidth, height: blockHeight });

              items.push({
                blurLerp: 0,
                x,
                y,
                lines,
                fontSize: baseFontSize,
                width: blockWidth,
                height: blockHeight,
                percent: rawPercent,
                color: style.color,
                font: style.font,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle,
                pulseOffset: p.random(20000),
              });
            }
          })
          .catch((err) => {
            console.error('❌ Failed to load statistics:', err);
            p.background(0);
            p.fill(255);
            p.textSize(24);
            p.text('❌ שגיאה בטעינת הנתונים', p.width / 2, p.height / 2);
          });
      };

      p.draw = () => {
        p.background(34,34,34,180);
        let hoveredItem = null;

        for (const item of items) {
          const mouseInside =
            p.mouseX >= item.x &&
            p.mouseX <= item.x + item.width &&
            p.mouseY >= item.y - item.height / 2 &&
            p.mouseY <= item.y + item.height / 2;

          if (mouseInside) hoveredItem = item;
        }

        for (const item of items) {
          const isHovered = item === hoveredItem;
          const targetBlur = hoveredItem ? (isHovered ? 0.5 : 6) : 2;

          item.blurLerp = p.lerp(item.blurLerp, targetBlur, 0.1);
          p.drawingContext.filter = `blur(${item.blurLerp}px)`;
          let blurAmount = '2px';

          if (hoveredItem) {
            blurAmount = isHovered ? '0.5px' : '6px';
          }

          p.drawingContext.filter = `blur(${blurAmount})`;

          // Heartbeat animation
          const heartbeat = (factor = 1) => {
            const t = ((p.frameCount + item.pulseOffset) % 120) * factor / 60.0;
            if (t < 0.1) {
              return 1 + (0.08 * Math.sin(t * Math.PI * 10) * factor);
            } else if (t < 0.2) {
              return 1 + (0.04 * Math.sin((t - 0.1) * Math.PI * 10) * factor);
            } else {
              return 1;
            }
          };
          const pulse = heartbeat(0.02);
          const animatedFontSize = item.fontSize * pulse;

          p.textFont(item.font);
          p.textStyle(item.fontStyle === 'italic' ? p.ITALIC : p.NORMAL);
          p.textSize(animatedFontSize);
          p.fill(item.color);

          item.lines.forEach((line, i) => {
            const lineY =
              item.y + i * animatedFontSize * 1.2 -
              ((item.lines.length - 1) * animatedFontSize * 1.2) / 2;
            p.text(line, item.x + item.width, lineY);
          });

          p.drawingContext.filter = 'none';
        }

        // Tooltip on hover
        if (hoveredItem) {
          const tooltipText = hoveredItem.percent;
          const tooltipSize = 16;
          p.textSize(tooltipSize);
          const textW = p.textWidth(tooltipText) + 20;
          const textH = tooltipSize * 1.4;

          const bx = p.mouseX;
          const by = p.mouseY - 30;

          p.fill(255, 255, 255, 230);
          p.rectMode(p.CENTER);
          p.rect(bx, by, textW, textH, 6);

          p.fill(0);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(tooltipText, bx, by);
          p.textAlign(p.RIGHT, p.CENTER);
        }
      };
    };

    p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance?.remove();
  }, []);

  return <div ref={sketchRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default StatisticsPage;
