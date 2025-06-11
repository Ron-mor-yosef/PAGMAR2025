import "./TextCard.css";
import FloatingInfoBox from "./FloatingInfoBox";

const TextCard = ({ text, view, onCardClick }) => {

  return (
    <div
      className="text-card"
      style={{ position: "relative" }}
      onClick={(e) => onCardClick(text, e)}
    >
      <div className="text-card-title">{text['כותרת'] || 'ללא כותרת'}</div>
      {view === 'snippet' && <p>{text['הטקסט']?.slice(0, 60)}...</p>}
      {view === 'citation' && <p>{text['ציטוט1'] || 'אין ציטוט'}</p>}
      {view === 'title' && <strong>{text['כותרת']|| 'ללא כותרת'} / {text['שם כותבת']|| 'ללא שם'}</strong>}
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
