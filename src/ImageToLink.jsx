import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageToLink.css";

export default function ImageToLink() {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [target, setTarget] = useState("_blank");
  const [htmlCode, setHtmlCode] = useState("");
  const [jsxCode, setJsxCode] = useState("");
  const [markdownCode, setMarkdownCode] = useState("");
  const [copyStatus, setCopyStatus] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [additionalClasses, setAdditionalClasses] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [responsive, setResponsive] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Charger l'historique depuis le localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("imageLinkHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Générer les codes
  const generateCodes = () => {
    if (!imageUrl.trim()) return;

    const classes = additionalClasses ? ` class="${additionalClasses}"` : "";
    const style = responsive ? ' style="max-width: 100%; height: auto;"' : "";
    const widthAttr = width ? ` width="${width}"` : "";
    const heightAttr = height ? ` height="${height}"` : "";
    
    // HTML
    const html = `<a href="${linkUrl || '#'}" target="${target}">\n  <img src="${imageUrl}" alt="${altText || 'Image description'}"${classes}${style}${widthAttr}${heightAttr} />\n</a>`;
    setHtmlCode(html);
    
    // JSX
    const jsx = `<a href="${linkUrl || '#'}" target="${target}">\n  <img src="${imageUrl}" alt="${altText || 'Image description'}"${classes ? ` className="${additionalClasses}"` : ""}${responsive ? ' style={{ maxWidth: "100%", height: "auto" }}' : ""}${widthAttr}${heightAttr} />\n</a>`;
    setJsxCode(jsx);
    
    // Markdown
    const markdown = `[![${altText || 'Image description'}](${imageUrl})](${linkUrl || '#'})`;
    setMarkdownCode(markdown);
    
    // Ajouter à l'historique
    const newItem = {
      id: Date.now(),
      imageUrl,
      linkUrl,
      altText,
      target,
      timestamp: new Date().toLocaleString(),
    };
    
    const updatedHistory = [newItem, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem("imageLinkHistory", JSON.stringify(updatedHistory));
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Vérifier si l'URL est valide
    try {
      new URL(imageUrl);
      
      // Précharger l'image pour vérifier qu'elle existe
      const img = new Image();
      img.onload = () => {
        setPreviewImage(imageUrl);
        generateCodes();
        setLoading(false);
      };
      img.onerror = () => {
        setError("L'image n'a pas pu être chargée. Vérifiez l'URL.");
        setLoading(false);
      };
      img.src = imageUrl;
    } catch {
      setError("URL invalide. Assurez-vous d'utiliser une URL complète (commençant par http:// ou https://)");
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setImageUrl(dataUrl);
      setPreviewImage(dataUrl);
      generateCodes();
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (codeType, text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyStatus({ [codeType]: true });
        setTimeout(() => setCopyStatus({ [codeType]: false }), 2000);
      })
      .catch(err => console.error('Erreur lors de la copie:', err));
  };

  const clearAll = () => {
    setImageUrl("");
    setLinkUrl("");
    setAltText("");
    setTarget("_blank");
    setHtmlCode("");
    setJsxCode("");
    setMarkdownCode("");
    setPreviewImage("");
    setError("");
    setAdditionalClasses("");
    setWidth("");
    setHeight("");
    setResponsive(false);
  };

  const loadFromHistory = (item) => {
    setImageUrl(item.imageUrl);
    setLinkUrl(item.linkUrl);
    setAltText(item.altText);
    setTarget(item.target);
    setPreviewImage(item.imageUrl);
    generateCodes();
  };

  const deleteFromHistory = (id, e) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("imageLinkHistory", JSON.stringify(updatedHistory));
  };

  // Options pour les cibles
  const targetOptions = [
    { value: "_blank", label: "Nouvel onglet" },
    { value: "_self", label: "Même fenêtre" },
    { value: "_parent", label: "Fenêtre parent" },
    { value: "_top", label: "Fenêtre supérieure" },
  ];

  return (
    <div className="image-to-link-app">
      <header className="app-header">
        <button className="back-button" onClick={() => navigate("/menu")}>
          ← Retour au menu
        </button>
        <h1>Image to Link Converter</h1>
        <p className="app-subtitle">
          Transformez n'importe quelle image web en lien HTML/JSX/Markdown
        </p>
      </header>

      <div className="app-container">
        <div className="input-section">
          <div className="input-card">
            <h2>📥 Source de l'image</h2>
            
            <div className="upload-options">
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                📁 Importer depuis mon ordinateur
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              <div className="or-separator">
                <span>OU</span>
              </div>
            </div>

            <form onSubmit={handleUrlSubmit} className="url-form">
              <div className="form-group">
                <label htmlFor="imageUrl">URL de l'image</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  required
                />
                <small className="hint">
                  Collez l'URL d'une image web (doit commencer par http:// ou https://)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="linkUrl">Lien de destination (optionnel)</label>
                <input
                  type="url"
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://exemple.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="altText">Texte alternatif (alt)</label>
                <input
                  type="text"
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Description de l'image"
                />
                <small className="hint">
                  Important pour l'accessibilité et le SEO
                </small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="target">Cible du lien</label>
                  <select
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    {targetOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="width">Largeur (px)</label>
                  <input
                    type="number"
                    id="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Hauteur (px)</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={responsive}
                    onChange={(e) => setResponsive(e.target.checked)}
                  />
                  Rendre l'image responsive
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                  />
                  Afficher l'aperçu
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="additionalClasses">Classes CSS supplémentaires</label>
                <input
                  type="text"
                  id="additionalClasses"
                  value={additionalClasses}
                  onChange={(e) => setAdditionalClasses(e.target.value)}
                  placeholder="rounded shadow hover:scale-105"
                />
                <small className="hint">
                  Classes CSS à appliquer à l'image (séparées par des espaces)
                </small>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="generate-btn"
                  disabled={loading || !imageUrl.trim()}
                >
                  {loading ? "⏳ Génération..." : "🚀 Générer le code"}
                </button>
                <button 
                  type="button" 
                  className="clear-btn"
                  onClick={clearAll}
                >
                  🗑️ Tout effacer
                </button>
              </div>
            </form>
          </div>

          {showPreview && previewImage && (
            <div className="preview-card">
              <h2>👁️ Aperçu</h2>
              <div className="preview-container">
                <div className="preview-wrapper">
                  {linkUrl ? (
                    <a 
                      href={linkUrl} 
                      target={target}
                      rel={target === "_blank" ? "noopener noreferrer" : ""}
                    >
                      <img
                        src={previewImage}
                        alt={altText || "Preview"}
                        className={`preview-image ${additionalClasses}`}
                        style={{
                          ...(responsive && { maxWidth: "100%", height: "auto" }),
                          ...(width && { width: `${width}px` }),
                          ...(height && { height: `${height}px` })
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src={previewImage}
                      alt={altText || "Preview"}
                      className={`preview-image ${additionalClasses}`}
                      style={{
                        ...(responsive && { maxWidth: "100%", height: "auto" }),
                        ...(width && { width: `${width}px` }),
                        ...(height && { height: `${height}px` })
                      }}
                    />
                  )}
                </div>
                <div className="image-info">
                  <p><strong>URL:</strong> {imageUrl.length > 50 ? imageUrl.substring(0, 50) + "..." : imageUrl}</p>
                  {linkUrl && <p><strong>Lien vers:</strong> {linkUrl.length > 50 ? linkUrl.substring(0, 50) + "..." : linkUrl}</p>}
                  {altText && <p><strong>Alt:</strong> {altText}</p>}
                  <p><strong>Cible:</strong> {targetOptions.find(o => o.value === target)?.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="output-section">
          {(htmlCode || jsxCode || markdownCode) ? (
            <>
              <div className="code-group">
                <div className="code-header">
                  <h3>🌐 Code HTML</h3>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy('html', htmlCode)}
                  >
                    {copyStatus.html ? "✅ Copié!" : "📋 Copier"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{htmlCode}</code>
                </pre>
              </div>

              <div className="code-group">
                <div className="code-header">
                  <h3>⚛️ Code JSX</h3>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy('jsx', jsxCode)}
                  >
                    {copyStatus.jsx ? "✅ Copié!" : "📋 Copier"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{jsxCode}</code>
                </pre>
              </div>

              <div className="code-group">
                <div className="code-header">
                  <h3>📝 Code Markdown</h3>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy('markdown', markdownCode)}
                  >
                    {copyStatus.markdown ? "✅ Copié!" : "📋 Copier"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{markdownCode}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>Prêt à convertir !</h3>
              <p>
                Entrez une URL d'image ou importez un fichier pour générer
                automatiquement le code HTML, JSX et Markdown d'un lien avec image.
              </p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="history-section">
            <h2>📜 Historique</h2>
            <div className="history-grid">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="history-item"
                  onClick={() => loadFromHistory(item)}
                >
                  <button 
                    className="delete-history-btn"
                    onClick={(e) => deleteFromHistory(item.id, e)}
                    aria-label="Supprimer"
                  >
                    ×
                  </button>
                  <div className="history-image">
                    <img src={item.imageUrl} alt={item.altText || "Historique"} />
                  </div>
                  <div className="history-info">
                    <p className="history-date">{item.timestamp}</p>
                    <p className="history-url">
                      {item.linkUrl || "Sans lien"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="clear-history-btn"
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("imageLinkHistory");
              }}
            >
              🗑️ Vider l'historique
            </button>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>
          Made with ❤️ par Enzo Bourgin | 
          <a href="https://github.com/Enzoooo-alt" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> | 
          <a href="https://enzobourgin.fr" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
        </p>
        <p className="footer-note">
          Cette application ne stocke pas vos images, seulement les URLs dans votre navigateur local.
        </p>
      </footer>
    </div>
  );
}
