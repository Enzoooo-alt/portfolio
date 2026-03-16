import React from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";

const sections = [
  {
    id: "presentation",
    title: "👤 Présentation",
    content: "Déterminé, sérieux et autonome. Je serais un élément décisif dans cette société",
    details: [
      "🎯 Formation Actuelle : BTS SIO option SLAM",
      "📍 Localisation : France, Lyon",
      "🎓 Établissement : Lycée Les Chassagnes",
      "💼 Statut : En recherche d'alternance"
    ]
  },
  {
    id: "competences",
    title: "💻 Compétences Techniques",
    categories: [
      {
        name: "Langages de programmation",
        skills: ["C#", "HTML", "CSS", "PHP", "JavaScript", "Python"]
      },
      {
        name: "Bases de données",
        skills: ["MariaDB", "MySQL", "Access"]
      },
      {
        name: "Frameworks & CMS",
        skills: ["Laravel", "React", "WordPress"]
      }
    ]
  },
  {
    id: "projets",
    title: "🚀 Expériences & Projets",
    projects: [
            {
        name: "Stage 2ème année BTS SIO",
        description: "Développement d'un site web vitrine pour leur restaurant",
        technologies: ["PHP"],
        status: "À venir",
        date: "13/02/2026",
        entreprise: "Segapal"
      },
      {
        name: "Stage 1ère année BTS SIO",
        description: "Création d'un site e-commerce à l'aide de WordPress",
        technologies: ["WordPress", "Travail d'équipe"],
        status: "Terminé",
        date: "5/5/2025",
        entreprise: "Maison Courtieu"
      },
      {
        name: "Caissier - Leclerc",
        description: "Gestion de caisse et relation client",
        technologies: ["Accueil", "Inventaire", "Service client"],
        status: "Expérience professionnelle",
        date: "02/03/2024"
      },
      {
        name: "Stage d'observation - Leclerc",
        description: "Vente d'objets informatiques et apprentissage relation client",
        technologies: ["Vente", "Relation client", "Travail de groupe"],
        status: "Terminé",
        date: "20/11/2019"
      }
    ]
  },
  {
    id: "parcours",
    title: "📚 Parcours Académique",
    timeline: [
      {
        year: "2025",
        title: "BTS SIO option SLAM",
        subtitle: "Lycée Les Chassagnes",
        description: "Spécialité Solutions Logicielles et Applications Métiers"
      },
      {
        year: "2024",
        title: "Bac Technologique STI2D",
        subtitle: "Lycée Charlie Chaplin",
        description: "Spécialité Systèmes d'Information Numérique"
      },
      {
        year: "2020",
        title: "Brevet des Collèges",
        subtitle: "Collège Georges Brassens",
        description: "Diplôme national du brevet"
      }
    ]
  },
  {
    id: "interets",
    title: "🎯 Centres d'Intérêt",
    topics: [
      {
        theme: "Sports",
        description: "Football, Jeux-Vidéo, Codage Informatique"
      },
      {
        theme: "Voyages",
        description: "Allemagne, Espagne, Pologne"
      },
      {
        theme: "Langues",
        description: "Français (Langue maternelle), Anglais (Intermédiaire), Espagnol (Limité), Polonais (Limité)"
      }
    ]
  },
  {
    id: "contact",
    title: "📞 Contact",
    informations: [
      "📧 Email : enzobourgin@gmail.com",
      "📞 Téléphone : 0623557555",
      "📍 Adresse : France, Lyon",
      "💼 LinkedIn : Enzo Bourgin"
    ],
    cta: "N'hésitez pas à me contacter pour discuter de projets ou d'opportunités !"
  }
];

const Portfolio = () => {
  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <div className="profile-card">
          <div className="profile-image">
            <div className="avatar-placeholder">👨‍💻</div>
          </div>
          <div className="profile-info">
            <h1 className="main-title">Enzo Bourgin</h1>
            <p className="subtitle">Étudiant en BTS SIO Option SLAM</p>
            <div className="badges">
              <span className="badge">Développement</span>
              <span className="badge">WordPress</span>
              <span className="badge">Base de données</span>
            </div>
          </div>
        </div>

        <div className="menu-button-container">
          <Link to="/menu" className="menu-button">
            Accéder à mes projets !
          </Link>
        </div>
      </header>

      <main className="portfolio-content">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            className="portfolio-section"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            <h2 className="section-title">
              <span className="section-icon">{section.title.split(' ')[0]}</span>
              {section.title.split(' ').slice(1).join(' ')}
            </h2>

            {section.id === "presentation" && (
              <div className="presentation-content">
                <p className="presentation-text">{section.content}</p>
                <div className="details-grid">
                  {section.details.map((detail, i) => (
                    <div key={i} className="detail-item" style={{ animationDelay: `${i * 0.1}s` }}>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.id === "competences" && (
              <div className="skills-container">
                {section.categories.map((category, i) => (
                  <div key={i} className="skill-category">
                    <h3 className="category-title">{category.name}</h3>
                    <div className="skills-list">
                      {category.skills.map((skill, j) => (
                        <span key={j} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.id === "projets" && (
              <div className="projects-grid">
                {section.projects.map((project, i) => (
                  <div key={i} className="project-card" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="project-header">
                      <h3 className="project-name">{project.name}</h3>
                      <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                    {project.entreprise && <p className="project-entreprise">📌 {project.entreprise}</p>}
                    <p className="project-description">{project.description}</p>
                    <div className="project-date">📅 {project.date}</div>
                    <div className="project-technologies">
                      {project.technologies.map((tech, j) => (
                        <span key={j} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.id === "parcours" && (
              <div className="timeline">
                {section.timeline.map((step, i) => (
                  <div className="timeline-item" key={i} style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="timeline-marker">
                      <div className="timeline-year">{step.year}</div>
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">{step.title}</h3>
                      <p className="timeline-subtitle">{step.subtitle}</p>
                      <p className="timeline-description">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.id === "interets" && (
              <div className="veille-container">
                {section.topics.map((topic, i) => (
                  <div key={i} className="veille-topic" style={{ animationDelay: `${i * 0.2}s` }}>
                    <h3 className="topic-title">{topic.theme}</h3>
                    <p className="topic-description">{topic.description}</p>
                  </div>
                ))}
              </div>
            )}

            {section.id === "contact" && (
              <div className="contact-content">
                <div className="contact-info">
                  {section.informations.map((info, i) => (
                    <div key={i} className="contact-item">
                      {info}
                    </div>
                  ))}
                </div>
                <p className="contact-cta">{section.cta}</p>
                <div className="contact-buttons">
                  <a href="mailto:enzobourgin@gmail.com" className="cta-button secondary">
                    📧 Me contacter
                  </a>
                  <a href="tel:0623557555" className="cta-button">
                    📞 Appeler
                  </a>
                </div>
              </div>
            )}
          </section>
        ))}
      </main>

      <footer className="portfolio-footer">
        <p>© 2024 Enzo Bourgin - BTS SIO SLAM</p>
        <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </footer>
    </div>
  );
};

export default Portfolio;
