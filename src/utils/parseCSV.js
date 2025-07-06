import Papa from 'papaparse';

export const loadCSV = (path) => {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
};

// Updated processTaggedText to support splitting around <br> tags
export const processTaggedText = (text, activeTags) => {
  let result = "";
  let index = 0;
  const tagIdentifiers = ["<קטגוריה:", "<רגש:"];

  // Helper to find a closing tag that matches the given tagType and tagName.
  const findClosingTag = (text, start, tagType, tagName) => {
    const pattern = `<${tagType}:`;
    let pos = start;
    while ((pos = text.indexOf(pattern, pos)) !== -1) {
      const endPos = text.indexOf(">", pos);
      if (endPos === -1) break;
      let tagContent = text.substring(pos + pattern.length, endPos).trim();
      tagContent = tagContent.replace(/\s+/g, ' ');
      if (tagContent.startsWith(`${tagName}`)) {
        let remainder = tagContent.slice(tagName.length).trim();
        if (remainder === "/" || remainder === "/>") {
          return pos;
        }
        if (tagContent === `${tagName}/`) {
          return pos;
        }
      }
      pos = endPos + 1;
    }
    return -1;
  };

  while (index < text.length) {
    // Find the next open tag
    let nextIndex = text.length;
    let nextTag = null;
    for (const tagId of tagIdentifiers) {
      const i = text.indexOf(tagId, index);
      if (i !== -1 && i < nextIndex) {
        nextIndex = i;
        nextTag = tagId;
      }
    }

    // Append plain text up to the next tag
    if (nextIndex > index) {
      result += text.substring(index, nextIndex);
      index = nextIndex;
    }

    if (nextTag) {
      const isCategory = nextTag === "<קטגוריה:";
      const tagType = isCategory ? "קטגוריה" : "רגש";

      // Find the end of the opening tag
      const openTagEnd = text.indexOf(">", index);
      if (openTagEnd === -1) {
        result += text.substring(index);
        break;
      }

      let openTagContent = text.substring(index + nextTag.length, openTagEnd).trim();
      const openingTagText = text.substring(index, openTagEnd + 1);
      const selfClosing = openingTagText.endsWith("/>");

      // Move index past the opening tag
      index = openTagEnd + 1;

      const spanClass = `${isCategory ? "highlight-category" : "highlight-emotion"} ${openTagContent}${activeTags.includes(openTagContent) ? " active" : ""}`;

      if (selfClosing) {
        // No inner text to process
        result += `<span class="${spanClass}"></span>`;
      } else {
        // For non-self-closing tag, find the corresponding closing tag
        const closeIndex = findClosingTag(text, index, tagType, openTagContent);
        if (closeIndex === -1) {
          result += text.substring(index);
          break;
        }
        const innerText = text.substring(index, closeIndex);
        let processedInner = processTaggedText(innerText, activeTags);
        // If the processed inner text contains a <br>, split into multiple spans
        if (/<br\s*\/?>/i.test(processedInner)) {
          const segments = processedInner.split(/<br\s*\/?>/i);
          processedInner = segments
            .map(segment => `<span class="${spanClass}">${segment}</span>`)
            .join("<br>");
        } else {
          processedInner = `<span class="${spanClass}">${processedInner}</span>`;
        }
        result += processedInner;

        // Move index past the closing tag
        const closingEnd = text.indexOf(">", closeIndex);
        index = closingEnd === -1 ? text.length : closingEnd + 1;
      }
    }
  }
  return result;
};


