import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    // opacity: 0,
    // y: -300,
    // x: 500
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5
};

const HomePage = ({ idleTimeout, setIdleTimeout, idleEnabled, setIdleEnabled }) => {
  const navigate = useNavigate();
  const [localTimeout, setLocalTimeout] = useState(idleTimeout ?? 120);
  const [localEnabled, setLocalEnabled] = useState(idleEnabled ?? true);
  const [showIdleMenu, setShowIdleMenu] = useState(false);

  const handleTimeoutChange = (e) => {
    const val = Math.max(10, Number(e.target.value));
    setLocalTimeout(val);
    setIdleTimeout?.(val);
  };
  const handleToggle = () => {
    setLocalEnabled((prev) => {
      setIdleEnabled?.(!prev);
      return !prev;
    });
  };

  return (
    <motion.main
      className='home-page'
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className='home-mid-box'>
        <div className='home-logo'>
          <img src="/assets/images/hebrew-logo.svg" alt="Logo" className="logo" />
        </div>
        <p>
          כיום בישראל יש כ־98,000 בני ובנות זוג של משרתי מילואים.
          מתוכם 97% נשים. <br /><br />
          האתר הזה אוסף את הקולות שלהן&mdash;<br /> 
          סיפורים, תחושות ומספרים המצטברים יחד.<br /><br />
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
        {/* Burger toggle for idle settings */}
        <div className="idle-burger-container">
          <button
            className="idle-burger-btn"
            onClick={() => setShowIdleMenu(prev => !prev)}
            aria-label="הגדרות חוסר פעילות"
          >
            <span />
            <span />
            <span />
          </button>
          {showIdleMenu && (
            <div className="idle-toggle-box idle-toggle-popup">
              <label>
                <input
                  type="checkbox"
                  checked={idleEnabled ?? localEnabled}
                  onChange={handleToggle}
                />
                ניתוב אוטומטי לדף הבית ({idleEnabled ?? localEnabled ? "פעיל" : "כבוי"})
              </label>
              <label style={{ marginRight: "1em" }}>
                זמן חוסר פעילות (שניות):{" "}
                <input
                  type="number"
                  min={10}
                  max={600}
                  value={idleTimeout ?? localTimeout}
                  onChange={handleTimeoutChange}
                  style={{ width: "4em" }}
                  disabled={!(idleEnabled ?? localEnabled)}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default HomePage;
