import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="toolbar top-bar">
    <img src="/logo.pdf" alt="Logo" className="logo" />
    <nav>
      <Link to="/">בית</Link>
      <Link to="/gallery">גלריה</Link>
      <Link to="/statistics">סטטיסטיקות</Link>
    </nav>
  </header>
);

export default Header;
