import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className='home-page'>
      <div className='home-mid-box'>
        <div className='home-logo'>
          <img src="/assets/images/hebrew-logo.svg" alt="Logo" className="logo" />
        </div>
        <p>
          כיום בישראל יש כ־98,000 בני ובנות זוג של משרתי מילואים.
          97% מהם הן נשים.        <br />
          <br />
          בין הבית לחזית &mdash;
          <br />
          האתר הזה אוסף את הקולות שלהן:
          <br />
          סיפורים, תחושות ומספרים המצטברים יחד.
          <br />
          <br />
          זהו סיפורן של הנשים העומדות בחזית העורף.
        </p>
        <div className="home-nav-btns">
          <button className="home-nav-btn" onClick={() => navigate('/statistics')}>
            מספרים
          </button>
          <button className="home-nav-btn" onClick={() => navigate('/gallery')}>
            טקסטים
          </button>
          <button className="home-nav-btn" onClick={() => navigate('/intro')}>
            אודות
          </button>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
