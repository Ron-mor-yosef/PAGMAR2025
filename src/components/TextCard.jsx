import "./TextCard.css";
import FloatingInfoBox from "./FloatingInfoBox";

const TextCard = ({ text, index, view, onCardClick, twitch }) => {

  return (

    <div
      className={`text-card${twitch ? " twitch" : ""}`}
      style={{ position: "relative" }}
      onClick={(e) => onCardClick(text, e)}
    >
      <div className="text-card-content">
        {<p dangerouslySetInnerHTML={{ __html: text['הטקסט']?.replace(/\r+\n+/g, "<br>") }} />}
      </div>
      <div className="text-card-info">
        <div className="text-card-author">
          {text['שם כותבת'] || 'ללא שם'}
        </div>
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
    </div>
  );
};

export default TextCard;
