import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="toolbar top-bar">
    <img src="/assets/images/hebrew-logo.svg" alt="Logo" className="logo" />
    <nav>
      <Link to="/">אודות</Link>
      <Link to="/gallery">טקסטים</Link>
      <Link to="/statistics">נתונים</Link>
    </nav>
  </header>
);

export default Header;
