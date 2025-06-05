import { useNavigate } from 'react-router-dom';
import './TextCard.css';

const TextCard = ({ text, index, view }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/text/${index}`);
  };

  return (
    <div onClick={handleClick} className="text-card">
      {view === 'snippet' && <p>{text['הטקסט']?.slice(0, 60)}...</p>}
      {view === 'citation' && <p>{text['ציטוט1'] || 'אין ציטוט'}</p>}
      {view === 'title' && <strong>{text['כותרת']} / {text['שם כותבת']}</strong>}
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
