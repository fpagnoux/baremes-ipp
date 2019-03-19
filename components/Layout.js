const isWP = require('../config').isWP

if (! isWP) {
  require('../styles/style.css')
}

const StagingLayout = ({children}) => (
  <div>
    <header id="main-header" className="main-header" role="banner">
      <div className="inner">
        <h1>
          <a href="https://www.ipp.eu/" title="retour à l’accueil">
            <img src="https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo.png" width="224" alt="Institut des Politiques Publiques – IPP" srcSet="https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo.png 1x, https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo@2x.png 2x"/>
          </a>
        </h1>
      </div>
      <div className="mobile-handler">
        <a href="#0" className="nav-trigger">
          <span className="cd-label">Menu</span>
          <span className="cd-icon"></span>
        </a>
      </div>
      <nav className="main-nav-container">
        <div className="inner">
          <ul id="main-nav" className="main-nav">
            <li id="menu-item-192" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-192">
              <a href="https://www.ipp.eu/presentation/">Accueil</a>
            </li>
            <li id="menu-item-98" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-98">
              <a href="https://www.ipp.eu/presentation/presentation/">L’Institut</a>
            </li>
            <li id="menu-item-99" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-99">
              <a href="https://www.ipp.eu/presentation/chercheurs/">Chercheurs</a>
            </li>
            <li id="menu-item-100" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-100">
              <a href="https://www.ipp.eu/presentation/thematiques/">Thématiques</a>
            </li>
            <li id="menu-item-189" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-189">
              <a href="https://www.ipp.eu/presentation/methodes/">Méthodes</a>
            </li>
            <li id="menu-item-101" className="active">
              <a href="https://www.ipp.eu/presentation/outils/" className="active">Outils</a>
            </li>
            <li id="menu-item-5565" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-5565">
              <a href="https://www.ipp.eu/presentation/publications/">Publications</a>
            </li>
            <li id="menu-item-104" className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-104">
              <a href="https://www.ipp.eu/actualites/">Actualités</a>
            </li>""
          </ul>
        </div>
      </nav>
    </header>
    <div id="content" className="inner col-content">
      <div id="main-col" className="main-col">{ children }</div>
    </div>
  </div>
)

const ProdLayout = ({children}) => (<div>{ children }</div>)

const Layout = isWP ? ProdLayout : StagingLayout

export default Layout
