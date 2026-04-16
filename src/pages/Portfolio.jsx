import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Portfolio.css";

const featuredProjects = [
  {
    title: "Inazuma Draft Pro",
    route: "/inazuma-draft",
    description: "Draft tactique 5v5 + simulation live",
    tag: "Game AI"
  },
  {
    title: "Cars Card Collection",
    route: "/cars-racing",
    description: "TCG Cars: boosters, deck auto et duel IA",
    tag: "Card Game"
  },
  {
    title: "Pokémon Types Live",
    route: "/pokemon-types",
    description: "Analyse matchup + comparaison de types en direct",
    tag: "Data"
  },
  {
    title: "Cuillère Assistant",
    route: "/cuillere",
    description: "Assistant conversationnel avec fallback intelligent",
    tag: "IA"
  },
  {
    title: "App de Planning",
    route: "/app-de-planning",
    description: "Projet Laravel intégré depuis le dossier App-de-planning",
    tag: "Laravel"
  },
  {
    title: "MaBanque (cours)",
    route: "/mabanque",
    description: "Projet bancaire de formation conservé et évolutif",
    tag: "School"
  }
];

const sections = [
  {
    id: "presentation",
    icon: "👤",
    title: "Présentation",
    content: "Déterminé, sérieux et autonome. Je serais un élément décisif dans cette société",
    details: [
      { icon: "🎯", label: "Formation actuelle", value: "BTS SIO option SLAM" },
      { icon: "📍", label: "Localisation", value: "France, Lyon" },
      { icon: "🎓", label: "Établissement", value: "Lycée Les Chassagnes" },
      { icon: "💼", label: "Statut", value: "En recherche d'alternance" }
    ]
  },
  {
    id: "competences",
    icon: "💻",
    title: "Compétences Techniques",
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
    icon: "🚀",
    title: "Expériences & Projets",
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
    icon: "📚",
    title: "Parcours Académique",
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
    icon: "🎯",
    title: "Centres d'Intérêt",
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
    id: "documents",
    icon: "🗂️",
    title: "Dossier BTS SIO",
    intro:
      "Tableau de synthèse E5 et veille technologique/cybersécurité utilisés pendant la présentation orale.",
    resources: [
      {
        key: "excel",
        type: "Excel",
        title: "Tableau de synthèse E5",
        description:
          "Synthèse des compétences BTS SIO SLAM, activités menées et éléments de preuve associés.",
        downloadUrl: "/documents/competences-bts-sio.xlsx",
        publicShareUrl: ""
      },
      {
        key: "ppt",
        type: "PowerPoint",
        title: "Veille technologique et cybersécurité",
        description:
          "Présentation interactive mobilisée pour exposer les thématiques, les impacts et les solutions étudiées.",
        downloadUrl: "/documents/veille-techno-cyber.pptx",
        publicShareUrl: ""
      }
    ]
  },
  {
    id: "contact",
    icon: "📞",
    title: "Contact",
    informations: [
      { icon: "📧", label: "Email", value: "enzobourgin@gmail.com", href: "mailto:enzobourgin@gmail.com" },
      { icon: "📞", label: "Téléphone", value: "06 23 55 75 55", href: "tel:0623557555" },
      { icon: "📍", label: "Adresse", value: "France, Lyon" },
      { icon: "💼", label: "LinkedIn", value: "Enzo Bourgin", href: "https://www.linkedin.com" }
    ],
    cta: "N'hésitez pas à me contacter pour discuter de projets ou d'opportunités !"
  }
];

const Portfolio = () => {
  const statTargets = useMemo(
    () => [
      { label: "Projets coeur", value: 5, suffix: "" },
      { label: "Moteurs interactifs", value: 4, suffix: "" },
      { label: "Expériences pro", value: 4, suffix: "" }
    ],
    []
  );

  const [scrollProgress, setScrollProgress] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(statTargets.map(() => 0));
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [activeDocumentKey, setActiveDocumentKey] = useState("excel");
  const [embedFailed, setEmbedFailed] = useState(false);
  const [excelPreview, setExcelPreview] = useState({
    loading: true,
    error: "",
    headers: [],
    rows: []
  });
  const [pptPreview, setPptPreview] = useState({
    loading: true,
    error: "",
    slides: [],
    currentSlide: 0
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const subtitleRotator = useMemo(
    () => ["Développement web", "Interfaces dynamiques", "Apps interactives"],
    []
  );

  const documentsSection = useMemo(
    () => sections.find((section) => section.id === "documents"),
    []
  );

  const excelResource = useMemo(
    () => documentsSection?.resources.find((resource) => resource.key === "excel"),
    [documentsSection]
  );

  const pptResource = useMemo(
    () => documentsSection?.resources.find((resource) => resource.key === "ppt"),
    [documentsSection]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", onPreferenceChange);

    return () => mediaQuery.removeEventListener("change", onPreferenceChange);
  }, []);

  useEffect(() => {
    setEmbedFailed(false);
  }, [activeDocumentKey]);

  useEffect(() => {
    let cancelled = false;

    const loadExcelPreview = async () => {
      if (!excelResource?.downloadUrl) {
        if (!cancelled) {
          setExcelPreview({ loading: false, error: "Fichier Excel introuvable.", headers: [], rows: [] });
        }
        return;
      }

      try {
        const response = await fetch(excelResource.downloadUrl);
        if (!response.ok) {
          throw new Error("Chargement impossible du fichier Excel.");
        }

        const buffer = await response.arrayBuffer();
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];

        const matrix = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: "",
          blankrows: false
        });

        const cleanedRows = matrix
          .map((row) => row.map((cell) => (cell == null ? "" : String(cell).trim())))
          .filter((row) => row.some((cell) => cell !== ""));

        if (!cleanedRows.length) {
          throw new Error("Le fichier Excel ne contient pas de données exploitables.");
        }

        const [headerCandidate = [], ...bodyCandidate] = cleanedRows;
        const maxWidth = Math.max(
          headerCandidate.length,
          ...bodyCandidate.map((row) => row.length),
          1
        );

        const headers =
          headerCandidate.length > 0
            ? headerCandidate
            : Array.from({ length: maxWidth }, (_, index) => `Colonne ${index + 1}`);

        const rows = (bodyCandidate.length > 0 ? bodyCandidate : cleanedRows).slice(0, 18);

        if (!cancelled) {
          setExcelPreview({ loading: false, error: "", headers, rows });
        }
      } catch (error) {
        if (!cancelled) {
          setExcelPreview({
            loading: false,
            error: error.message || "Prévisualisation Excel indisponible.",
            headers: [],
            rows: []
          });
        }
      }
    };

    const parseSlideNumber = (slidePath) => {
      const match = slidePath.match(/slide(\d+)\.xml$/i);
      return match ? Number(match[1]) : 0;
    };

    const extractSlideText = (xmlContent) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
      const nodes = Array.from(xmlDoc.getElementsByTagName("a:t"));
      return nodes
        .map((node) => node.textContent?.trim() || "")
        .filter(Boolean);
    };

    const loadPptPreview = async () => {
      if (!pptResource?.downloadUrl) {
        if (!cancelled) {
          setPptPreview({ loading: false, error: "Fichier PowerPoint introuvable.", slides: [], currentSlide: 0 });
        }
        return;
      }

      try {
        const response = await fetch(pptResource.downloadUrl);
        if (!response.ok) {
          throw new Error("Chargement impossible du fichier PowerPoint.");
        }

        const buffer = await response.arrayBuffer();
        const { default: JSZip } = await import("jszip");
        const zip = await JSZip.loadAsync(buffer);

        const slidePaths = Object.keys(zip.files)
          .filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
          .sort((pathA, pathB) => parseSlideNumber(pathA) - parseSlideNumber(pathB));

        const slides = [];
        for (const [index, path] of slidePaths.entries()) {
          const file = zip.file(path);
          if (!file) {
            continue;
          }

          const xmlContent = await file.async("text");
          const lines = extractSlideText(xmlContent);
          const title = lines[0] || `Slide ${index + 1}`;
          const bullets = lines.slice(1, 10);

          slides.push({
            id: path,
            index: index + 1,
            title,
            bullets
          });
        }

        if (!slides.length) {
          throw new Error("Aucune slide lisible trouvée dans la présentation.");
        }

        if (!cancelled) {
          setPptPreview({ loading: false, error: "", slides, currentSlide: 0 });
        }
      } catch (error) {
        if (!cancelled) {
          setPptPreview({
            loading: false,
            error: error.message || "Prévisualisation PowerPoint indisponible.",
            slides: [],
            currentSlide: 0
          });
        }
      }
    };

    loadExcelPreview();
    loadPptPreview();

    return () => {
      cancelled = true;
    };
  }, [excelResource, pptResource]);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const progress = total > 0 ? (scrollTop / total) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setSubtitleIndex(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitleRotator.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, subtitleRotator.length]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedStats(statTargets.map((stat) => stat.value));
      return undefined;
    }

    const duration = 1200;
    const steps = 30;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      const progress = step / steps;

      setAnimatedStats(statTargets.map((stat) => Math.round(stat.value * progress)));

      if (step >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, statTargets]);

  const normalizeStatusClass = (status) =>
    status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const getResourceSourceUrl = (resource) => {
    const candidateUrl = resource.publicShareUrl || resource.downloadUrl;

    if (!candidateUrl) {
      return "";
    }

    if (/^https?:\/\//i.test(candidateUrl)) {
      return candidateUrl;
    }

    if (typeof window === "undefined") {
      return "";
    }

    return new URL(candidateUrl, window.location.origin).toString();
  };

  const getOfficeEmbedUrl = (sourceUrl) => {
    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
      return "";
    }

    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sourceUrl)}`;
  };

  const canUseOfficeEmbed = (sourceUrl) => {
    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
      return false;
    }

    try {
      const { hostname } = new URL(sourceUrl);
      const isLocalHost =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

      return !isLocalHost;
    } catch {
      return false;
    }
  };

  const goToPptSlide = (direction) => {
    setPptPreview((previous) => {
      if (!previous.slides.length) {
        return previous;
      }

      const total = previous.slides.length;
      const nextIndex = (previous.currentSlide + direction + total) % total;
      return { ...previous, currentSlide: nextIndex };
    });
  };

  const renderExcelPreview = () => {
    if (excelPreview.loading) {
      return <p className="documents-stage-state">Chargement du tableau de synthèse…</p>;
    }

    if (excelPreview.error) {
      return <p className="documents-stage-state">{excelPreview.error}</p>;
    }

    return (
      <div className="excel-preview-wrap" role="region" aria-label="Aperçu du tableau de synthèse">
        <table className="excel-preview-table">
          <thead>
            <tr>
              {excelPreview.headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header || `Colonne ${index + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelPreview.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {excelPreview.headers.map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}>{row[colIndex] || ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPptPreview = () => {
    if (pptPreview.loading) {
      return <p className="documents-stage-state">Chargement de la présentation…</p>;
    }

    if (pptPreview.error) {
      return <p className="documents-stage-state">{pptPreview.error}</p>;
    }

    const currentSlide = pptPreview.slides[pptPreview.currentSlide];
    if (!currentSlide) {
      return <p className="documents-stage-state">Slide indisponible.</p>;
    }

    return (
      <div className="ppt-preview-wrap" role="region" aria-label="Aperçu de la présentation veille">
        <div className="ppt-preview-toolbar">
          <button type="button" className="ppt-nav-btn" onClick={() => goToPptSlide(-1)}>
            Slide précédente
          </button>
          <span>
            {currentSlide.index}/{pptPreview.slides.length}
          </span>
          <button type="button" className="ppt-nav-btn" onClick={() => goToPptSlide(1)}>
            Slide suivante
          </button>
        </div>

        <article className="ppt-slide-card">
          <h4>{currentSlide.title}</h4>
          {currentSlide.bullets.length > 0 ? (
            <ul>
              {currentSlide.bullets.map((bullet, index) => (
                <li key={`bullet-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : (
            <p>Slide sans texte.</p>
          )}
        </article>
      </div>
    );
  };

  const renderDocumentStage = (section) => {
    const activeResource =
      section.resources.find((resource) => resource.key === activeDocumentKey) || section.resources[0];

    if (!activeResource) {
      return null;
    }

    const sourceUrl = getResourceSourceUrl(activeResource);
    const shouldEmbed = canUseOfficeEmbed(sourceUrl) && !embedFailed;
    const embedUrl = shouldEmbed ? getOfficeEmbedUrl(sourceUrl) : "";

    return (
      <div className="documents-stage" aria-live="polite">
        <div className="documents-stage-header">
          <span className="documents-stage-type">{activeResource.type}</span>
          <h3>{activeResource.title}</h3>
        </div>

        <div className="documents-stage-frame">
          {embedUrl ? (
            <iframe
              title={`Prévisualisation ${activeResource.title}`}
              src={embedUrl}
              loading="lazy"
              allowFullScreen
              onError={() => setEmbedFailed(true)}
            ></iframe>
          ) : (
            <div className="documents-stage-local">
              {activeResource.key === "excel" && renderExcelPreview()}
              {activeResource.key === "ppt" && renderPptPreview()}
              <div className="documents-stage-cta">
                <a href={activeResource.downloadUrl} className="doc-button" target="_blank" rel="noreferrer">
                  Ouvrir le fichier original
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="portfolio-container">
      <a className="skip-link" href="#portfolio-main">
        Aller au contenu principal
      </a>

      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <header className="portfolio-header">
        <div className="profile-card">
          <div className="profile-image">
            <div className="avatar-placeholder" aria-hidden="true">👨‍💻</div>
          </div>
          <div className="profile-info">
            <h1 className="main-title">Enzo Bourgin</h1>
            <p className="subtitle">
              Étudiant en BTS SIO Option SLAM ·{" "}
              <span className="subtitle-animated" aria-live="polite">
                {subtitleRotator[subtitleIndex]}
              </span>
            </p>
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

        <div className="hero-stats">
          {statTargets.map((stat, index) => (
            <div className="hero-stat-card" key={stat.label}>
              <div className="hero-stat-value">
                {animatedStats[index]}
                {stat.suffix}
              </div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="featured-projects">
          {featuredProjects.map((project) => {
            const cardContent = (
              <>
                <span className="featured-project-tag">{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </>
            );

            if (project.external) {
              return (
                <a
                  key={project.title}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="featured-project-card"
                  aria-label={`Ouvrir ${project.title} dans un nouvel onglet`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={project.title} to={project.route} className="featured-project-card">
                {cardContent}
              </Link>
            );
          })}
        </div>

        <nav className="section-nav" aria-label="Navigation rapide des sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="section-nav-link">
              <span aria-hidden="true">{section.icon}</span>
              <span>{section.title}</span>
            </a>
          ))}
        </nav>
      </header>

      <main className="portfolio-content" id="portfolio-main" tabIndex="-1">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className="portfolio-section"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            <h2 className="section-title">
              <span className="section-icon" aria-hidden="true">{section.icon}</span>
              <span>{section.title}</span>
            </h2>

            {section.id === "presentation" && (
              <div className="presentation-content">
                <p className="presentation-text">{section.content}</p>
                <ul className="details-grid" aria-label="Points clés de présentation">
                  {section.details.map((detail, i) => (
                    <li key={detail.label} className="detail-item" style={{ animationDelay: `${i * 0.1}s` }}>
                      <span aria-hidden="true">{detail.icon}</span> {detail.label} : <strong>{detail.value}</strong>
                    </li>
                  ))}
                </ul>
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
                      <span className={`project-status ${normalizeStatusClass(project.status)}`}>
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

            {section.id === "documents" && (
              <div className="documents-content">
                <p className="documents-intro">{section.intro}</p>

                <div className="documents-grid">
                  {section.resources.map((resource) => {
                    const isActive = activeDocumentKey === resource.key;

                    return (
                      <article key={resource.title} className="document-card">
                        <div className="document-header">
                          <span className="document-type">{resource.type}</span>
                          <span className="document-status ready">
                            Disponible
                          </span>
                        </div>

                        <h3 className="document-title">{resource.title}</h3>
                        <p className="document-description">{resource.description}</p>

                        <div className="document-actions">
                          <button
                            type="button"
                            className={`doc-button ${isActive ? "active" : "secondary"}`}
                            onClick={() => setActiveDocumentKey(resource.key)}
                            aria-pressed={isActive}
                          >
                            {isActive ? "Affichage actif" : "Afficher dans la scène"}
                          </button>
                          <a href={resource.downloadUrl} target="_blank" rel="noreferrer" className="doc-button secondary">
                            Ouvrir
                          </a>
                          <a href={resource.downloadUrl} download className="doc-button secondary">
                            Télécharger
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {renderDocumentStage(section)}
              </div>
            )}

            {section.id === "contact" && (
              <div className="contact-content">
                <div className="contact-info">
                  {section.informations.map((info) => (
                    <div key={info.label} className="contact-item">
                      <p className="contact-item-label">
                        <span aria-hidden="true">{info.icon}</span> {info.label}
                      </p>
                      {info.href ? (
                        <a href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                          {info.value}
                        </a>
                      ) : (
                        <p>{info.value}</p>
                      )}
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
        <p>© 2026 Enzo Bourgin - BTS SIO SLAM</p>
        <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </footer>
    </div>
  );
};

export default Portfolio;
