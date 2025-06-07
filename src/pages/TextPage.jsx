import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadCSV } from '../utils/parseCSV';
import EmotionTag from '../components/EmotionTag';
import './TextPage.css';


const TextPage = () => {
  const { id } = useParams();
  const [text, setText] = useState(null);

  useEffect(() => {
    loadCSV('/texts.csv').then(data => setText(data[id]));
  }, [id]);

  if (!text) return <div>טוען...</div>;

  return (
    <main>
      <h1>{text['כותרת']}</h1>
      <h3>{text['שם כותבת']}</h3>
      <p>{text['הטקסט']?.split(/\n|\r/g).map((line, i) => <div key={i}>{line}</div>)}</p>
      <EmotionTag emotion={text['רגשות']} />
    </main>
  );
};

export default TextPage;
