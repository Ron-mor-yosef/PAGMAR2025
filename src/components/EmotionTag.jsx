import './EmotionTag.css';

const EmotionTag = ({ emotion }) => (
  <div className="emotion-tags">
    {emotion && <span>{emotion}</span>}
  </div>
);

export default EmotionTag;
