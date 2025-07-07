import "./TextCard.css";
import FloatingInfoBox from "./FloatingInfoBox";
import { processTaggedText } from "../utils/parseCSV"; // Adjust the import path as necessary


const TextCard = ({
  text,
  index,
  view,
  onCardClick,
  selectedEmotions = [],
  selectedCategories = [],
  emotionIcons = {},
  categoryIcons = {},
}) => {
  // Check if this card matches a selected emotion or category
  const cardEmotions = (text['רגש'] || '').split(/,|\n|\r/).map(e => e.trim()).filter(Boolean);
  const cardCategories = (text['קטגוריה'] || '').split(/,|\n|\r/).map(e => e.trim()).filter(Boolean);

  // Find the first matching emotion/category (for icon)
  const matchedEmotion = cardEmotions.find(e => selectedEmotions.includes(e));
  const matchedCategory = cardCategories.find(c => selectedCategories.includes(c));

  // Pick icon index (emotion has priority)
  const iconIndex = matchedEmotion
    ? emotionIcons[matchedEmotion]
    : matchedCategory
      ? categoryIcons[matchedCategory]
      : null;

  function cleanTextForClamp(text) {
    // Remove trailing commas or periods before ellipsis, but allow '?'
    const withoutTags = text.replace(/([,,-]+)</g, '<').replace(/\s+</g, ' <').replace(/<[/]?span[^\>]*>/g,'');
    console.log("cleanTextForClamp", withoutTags);
    return withoutTags;
  }

  return (

    <div
      className={`text-card`}
      onClick={(e) => onCardClick(text, e)}
    >
      <div className="text-card-content">

        {<p dangerouslySetInnerHTML={{
          __html: cleanTextForClamp(processTaggedText(
            (text['הטקסט'] || "")
              .split(/\r?\n/g)
              .map(line => line.trim())
              .join('<br>'), []))
        }} />}
      </div>
      <div className="text-card-info">
        <div className="text-card-author">
          {text['שם כותבת'] || 'ללא שם'}
        </div>
        <ul className="text-card-tags">
          {cardEmotions.concat(cardCategories).map((tag, i) => {
            const isActive = selectedEmotions.includes(tag) || selectedCategories.includes(tag);
            // Pick the correct icon index
            const iconIndex = emotionIcons[tag] || categoryIcons[tag] || 1;
            return (
              <li
                key={i}
                className={isActive ? "active" : ""}
                style={
                  isActive
                    ? { "--svg-url-emotion": `url('${process.env.PUBLIC_URL}/assets/images/red_circles/${ Math.floor((Math.random() * 5) + 1)}.svg')`, 
                  "--circle-rotate": `${Math.floor((Math.random() * 20)-10)}deg` }
                    : {}
                }
              >
                {tag}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TextCard;
