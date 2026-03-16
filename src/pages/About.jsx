import React, { useState } from "react";
import "../styles/pages/About.css";

export default function About() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Qui suis-je ?",
      answer: "Je suis Enzo Bourgin, étudiant en BTS SIO option SLAM passionné par le développement web et la cybersécurité."
    },
    {
      question: "Mon parcours",
      answer: "Après un Bac STI2D, j'ai poursuivi en BTS SIO pour me spécialiser dans le développement d'applications."
    },
    {
      question: "Mes compétences",
      answer: "Développement web (HTML/CSS, JavaScript, React, PHP), gestion de bases de données, et veille technologique."
    },
    {
      question: "Mes projets",
      answer: "Plusieurs projets scolaires et personnels incluant des applications web, sites vitrines et outils de gestion."
    },
    {
      question: "Mes objectifs",
      answer: "Devenir développeur full-stack et me spécialiser en cybersécurité à moyen terme."
    },
    {
      question: "Pourquoi ce portfolio ?",
      answer: "Pour présenter mon travail, partager mes apprentissages et montrer mon évolution dans le domaine du développement."
    }
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">À Propos de Moi</h1>
        
        <div className="faq-section">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
              </button>
              
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <div className="faq-answer-content">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
