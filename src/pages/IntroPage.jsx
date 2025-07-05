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
        console.log("Intro paragraphs loaded:", paragraphs);
      });
  }, []);

  return (
    <main className="intro-page">
      <div className="intro-page-title">על הפרויקט</div>
      <div className="intro-page-content">
        <div className="intro-page-paragraphs">
          {introParagraphs}
        </div>
        <div className="intro-page-credits">
          יוצרת האתר <span className="intro-page-credits-name">רון מור יוסף</span> , סטודנטית שנה אחרונה במחלקה לתקשורת חזותית בבצלאל. האתר נבנה במסגרת פרויקט גמר בהנחיית <span className="intro-page-credits-name">חובב אופנהיים</span> ו<span className="intro-page-credits-name">פרופ׳ רותו מודן</span> .
          <br />פיתוח: <span className="intro-page-credits-name">יובל כהן</span>.
        </div>
      </div>
      <div className="intro-page-footer">
        <img src="/assets/images/logo-bezalel.png" alt="Bezalel logo" />
      </div>

    </main>
  );
};

export default IntroPage;
