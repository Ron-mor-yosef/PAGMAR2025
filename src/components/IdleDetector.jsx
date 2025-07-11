import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function IdleDetector({ timeout = 120, enabled = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFading(false);
      return;
    }
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFading(false);
      timeoutRef.current = setTimeout(() => {
        if (location.pathname !== "/") {
          setFading(true);
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 800); // match fade duration
        }
      }, timeout * 1000); // timeout in seconds
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, [location.pathname, navigate, timeout, enabled]);

  return fading ? <div className="fade-overlay" /> : null;
}