import { Link, useLocation } from "react-router-dom";
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <div className="header">
      <header className="toolbar top-bar">
        <Link to="/PAGMAR2025"><img src={process.env.PUBLIC_URL + "/assets/images/hebrew-logo.svg"} alt="Logo" className="logo" /></Link>
      </header>
      <nav>
        <Link to="/PAGMAR2025/statistics" className={location.pathname === "/PAGMAR2025/statistics" ? "active statistics-page" : "statistics-page"}>מספרים</Link>
        <Link to="/PAGMAR2025/gallery" className={location.pathname === "/PAGMAR2025/gallery" ? "active gallery-page" : "gallery-page"}>טקסטים</Link>
        <Link to="/PAGMAR2025/intro" className={location.pathname === "/PAGMAR2025/intro" ? "active intro-page" : "intro-page"}>אודות</Link>
      </nav>
    </div>
  );
};

export default Header;
