import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

export default function IdleDetector() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFading(false);
      timeoutRef.current = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          if (location.pathname !== "/") navigate("/", { replace: true });
        }, 800); // match fade duration
      }, IDLE_TIMEOUT);
    };

    // Listen to user activity
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
  }, [location.pathname, navigate]);

  return fading ? <div className="fade-overlay" /> : null;
}