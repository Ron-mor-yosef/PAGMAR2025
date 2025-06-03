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
    </div>
  );
};

export default TextCard;
