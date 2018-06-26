const Layout = ({children, fullWidth}) => (
  <div>
    <header id="main-header" class="main-header" role="banner">
      <div class="inner">
        <h1>
          <a href="https://www.ipp.eu/" title="retour à l’accueil">
            <img src="https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo.png" width="224" alt="Institut des Politiques Publiques – IPP" srcset="https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo.png 1x, https://www.ipp.eu/wp-content/themes/ipp/assets/img/ipp_logo@2x.png 2x"/>
          </a>
        </h1>
      </div>
      <div class="mobile-handler">
        <a href="#0" class="nav-trigger">
          <span class="cd-label">Menu</span>
          <span class="cd-icon"></span>
        </a>
      </div>
      <nav class="main-nav-container">
        <div class="inner">
          <ul id="main-nav" class="main-nav">
            <li id="menu-item-192" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-192">
              <a href="https://www.ipp.eu/presentation/">Accueil</a>
            </li>
            <li id="menu-item-98" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-98">
              <a href="https://www.ipp.eu/presentation/presentation/">L’Institut</a>
            </li>
            <li id="menu-item-99" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-99">
              <a href="https://www.ipp.eu/presentation/chercheurs/">Chercheurs</a>
            </li>
            <li id="menu-item-100" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-100">
              <a href="https://www.ipp.eu/presentation/thematiques/">Thématiques</a>
            </li>
            <li id="menu-item-189" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-189">
              <a href="https://www.ipp.eu/presentation/methodes/">Méthodes</a>
            </li>
            <li id="menu-item-101" class="active">
              <a href="https://www.ipp.eu/presentation/outils/" class="active">Outils</a>
            </li>
            <li id="menu-item-5565" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-5565">
              <a href="https://www.ipp.eu/presentation/publications/">Publications</a>
            </li>
            <li id="menu-item-104" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-104">
              <a href="https://www.ipp.eu/actualites/">Actualités</a>
            </li>""
          </ul>
        </div>
      </nav>
    </header>
    <div id="content" className={"inner col-content" + (fullWidth ? " full-width": "")}>
      <div id="main-col" className={"main-col" + (fullWidth ? " full-width": "")}>{ children }</div>
    </div>
  </div>
)

export default Layout
