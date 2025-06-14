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
        {<p dangerouslySetInnerHTML={{ __html: text['הטקסט']?.replace(/\r+|\n+/g, "<br>") }} />}
      </div>
      <div className="text-card-info">
        <div className="text-card-author">
          {text['שם כותבת'] || 'ללא שם'}
        </div>
        <ul className="text-card-tags">
          {text['רגש']?.split(/,|\n|\r/g).map((emotion, i) => {
            if (emotion.trim() !== "") {
              return <li key={i} className="emotion-tag">{emotion.trim()}</li>;
            } else {
              return null;
            }
          })}
          {/* </ul>
          <ul className="text-card-category"> */}
          {text['קטגוריה']?.split(/,|\n|\r/g).map((category, i) => {
            if (category.trim() !== "") {
              return <li key={i} className="category-tag">{category.trim()}</li>;
            } else {
              return null;
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default TextCard;
