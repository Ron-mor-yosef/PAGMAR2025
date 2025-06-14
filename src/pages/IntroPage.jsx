import React, { useEffect, useState } from "react";
import './IntroPage.css';

const IntroPage = () => {
  const [introParagraphs, setIntroParagraphs] = useState([]);

  useEffect(() => {
    fetch("/intro.txt")
      .then(res => res.text())
      .then(text => {
        // Split by \n for paragraphs, replace \r with <br>
        const paragraphs = text.split('\n').map((para, idx) =>
          <p key={idx} dangerouslySetInnerHTML={{ __html: para.replace(/\\r/g, "<br>") }} />
        );
        setIntroParagraphs(paragraphs);
      });
  }, []);

  return (
    <main className="intro-page">
      <div className="intro-page-title">על הפרויקט</div>
      <div className="intro-page-content">
      {introParagraphs}
      </div>
    </main>
  );
};

export default IntroPage;
