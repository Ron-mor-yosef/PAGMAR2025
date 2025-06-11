import "./TextCard.css";
import FloatingInfoBox from "./FloatingInfoBox";

const TextCard = ({ text, view, onCardClick }) => {

  return (
    <div
      className="text-card"
      style={{ position: "relative" }}
      onClick={(e) => onCardClick(text, e)}
    >
      {<strong>{text['כותרת'] || 'ללא כותרת'} / {text['שם כותבת'] || 'ללא שם'}</strong>}

      {text['הטקסט']?.slice(0, 60).split(/,|\r/g).map((paragraph, i) => (
        i === 0 ? <p key={i} >{paragraph.trim()}</p> : i > 1 ? null : <p key={i} >{paragraph.trim().concat('...')}</p>
      ))}
      <div className="text-card-emotions">
        {text['רגשות']?.split(/,|\r/g).map((emotion, i) => (
          <span key={i} className="emotion-tag">{emotion.trim()}</span>
        ))}
      </div>
      <ul className="text-card-category">
        {text['קטגוריות']?.split(/,|\r/g).map((category, i) => (
          <li key={i} className="category-tag">{category.trim()}</li>
        ))}
      </ul>
    </div>
  );
};

export default TextCard;
