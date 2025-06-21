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
        <Link to="/statistics" className={location.pathname === "/statistics" ? "active statistics-page" : "statistics-page"}>מספרים</Link>
        <Link to="/gallery" className={location.pathname === "/gallery" ? "active gallery-page" : "gallery-page"}>טקסטים</Link>
        <Link to="/intro" className={location.pathname === "/intro" ? "active intro-page" : "intro-page"}>אודות</Link>
      </nav>
    </div>
  );
};

export default Header;
