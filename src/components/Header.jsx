import { Link, useLocation } from "react-router-dom";
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <div className="header">
      <header className="toolbar top-bar">
        <Link to="/"><img src="/assets/images/hebrew-logo.svg" alt="Logo" className="logo" /></Link>
      </header>
      <nav>
        <Link to="/intro" className={location.pathname === "/intro" ? "active" : ""}>אודות</Link>
        <Link to="/gallery" className={location.pathname === "/gallery" ? "active" : ""}>טקסטים</Link>
        <Link to="/statistics" className={location.pathname === "/statistics" ? "active" : ""}>נתונים</Link>
        <Link to="/statistics-grid" className={location.pathname === "/statistics-grid" ? "active" : ""}>גריד</Link>
      </nav>
    </div>
  );
};

export default Header;
