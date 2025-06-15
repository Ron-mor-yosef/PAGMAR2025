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

// Updated processTaggedText to support closing tags in the self-closing format
export const processTaggedText = (text, activeTags) => {
  let result = "";
  let index = 0;
  const tagIdentifiers = ["<קטגוריה:", "<רגש:"];

  // Helper to find a closing tag that matches the given tagType and tagName.
  // It looks for a substring like `<tagType: tagName/>` (allowing extra spaces).
  const findClosingTag = (text, start, tagType, tagName) => {
    const pattern = `<${tagType}:`;
    let pos = start;
    while ((pos = text.indexOf(pattern, pos)) !== -1) {
      const endPos = text.indexOf(">", pos);
      if (endPos === -1) break;
      let tagContent = text.substring(pos + pattern.length, endPos).trim();
      // Remove extra spaces within the tagContent
      tagContent = tagContent.replace(/\s+/g, ' ');
      // Expecting something like "guf/". Allow an optional space before the slash.
      if (tagContent.startsWith(`${tagName}`)) {
        // Remove the tag name from the beginning to see if only "/"
        let remainder = tagContent.slice(tagName.length).trim();
        if (remainder === "/" || remainder === "/>") {
          return pos;
        }
        // Alternatively, if the tagContent exactly equals `${tagName}/`
        if (tagContent === `${tagName}/`) {
          return pos;
        }
      }
      pos = endPos + 1;
    }
    return -1;
  };

  while (index < text.length) {
    // Find the next open tag (either category or emotion)
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
        // No closing ">", append the remainder and break
        result += text.substring(index);
        break;
      }

      // Extract tag content (e.g. "זוגיות" or "גוף" etc.)
      let openTagContent = text.substring(index + nextTag.length, openTagEnd).trim();
      // Determine if this opening tag is self-closing
      const openingTagText = text.substring(index, openTagEnd + 1);
      const selfClosing = openingTagText.endsWith("/>");

      // Move index past the opening tag
      index = openTagEnd + 1;

      const spanClass = `${isCategory ? "highlight-category" : "highlight-emotion"} ${openTagContent}${activeTags.includes(openTagContent) ? " active" : ""}`;

      if (selfClosing) {
        // Self-closing opening: no inner text
        result += `<span class="${spanClass}"></span>`;
      } else {
        // Look for the corresponding closing tag in the format: <tagType: tagName/>
        const closeIndex = findClosingTag(text, index, tagType, openTagContent);
        if (closeIndex === -1) {
          // No closing tag found, insert remaining text as plain text
          result += text.substring(index);
          break;
        }

        // Recursively process the inner text (to handle any nested tags)
        const innerText = text.substring(index, closeIndex);
        const processedInner = processTaggedText(innerText, activeTags);

        result += `<span class="${spanClass}">${processedInner}</span>`;

        // Move index past the closing tag
        const closingEnd = text.indexOf(">", closeIndex);
        index = closingEnd === -1 ? text.length : closingEnd + 1;
      }
    }
  }
  return result;
};


