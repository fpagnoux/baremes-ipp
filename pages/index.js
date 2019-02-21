import Layout from '../components/Layout'
import LangToggle from '../components/LangToggle'


const Index = () => (
  <Layout>
    <LangToggle lang="fr" path="/"/>
    <h1 className="box"><span>Barèmes IPP</span></h1>
    <div className="entry-content text">
      <h4>Prélèvements obligatoires</h4>
      <ul>
        <li><a href="./prelevements-sociaux">Prélèvements sociaux</a></li>
        <li><a href="./impot-sur-le-revenu">Impôt sur le revenu</a></li>
        <li><a href="./taxation-du-capital">Taxation du capital</a></li>
        <li><a href="./taxation-indirecte">Taxation indirecte</a></li>
        <li><a href="./taxation-societes">Taxation des entreprises</a></li>
      </ul>
      <h4>Transferts et prestations</h4>
      <ul>
        <li><a href="./prestations-sociales">Prestations sociales</a></li>
        <li><a href="./chomage">Chômage</a></li>
        <li><a href="./regimes-de-retraites">Retraite</a></li>
      </ul>
      <h4>Réglementations</h4>
      <ul>
        <li><a href="./marche-du-travail">Marché du travail</a></li>
        <li><a href="./tarifs-reglementes-energie">Tarifs réglementés de l’énergie</a></li>
      </ul>
    </div>
  </Layout>
  )
export default Index
