import Layout from '../../components/Layout'
import LangToggle from '../../components/LangToggle'

const Index = () => (
  <Layout>
    <LangToggle lang="en" path="/en"/>
    <h1 className="box"><span>IPP tax and benefit tables</span></h1>
    <div className="entry-content text">
      <h4>Taxes</h4>
      <ul>
        <li><a href="./en/prelevements-sociaux">Social security contributions</a></li>
        <li><a href="./en/impot-sur-le-revenu">Income tax</a></li>
        <li><a href="./en/taxation-du-capital">Capital taxation</a></li>
        <li><a href="./en/taxation-indirecte">Indirect taxation</a></li>
        <li><a href="./en/taxation-societes">Business taxation</a></li>
      </ul>
      <h4>Contributory and non-contributory benefits</h4>
      <ul>
        <li><a href="./en/prestations-sociales">Prestations sociales</a></li>
        <li><a href="./en/chomage">Chômage</a></li>
        <li><a href="./en/regimes-de-retraites">Retraite</a></li>
      </ul>
      <h4>Market regulations</h4>
      <ul>
        <li><a href="./en/marche-du-travail">Labour market</a></li>
        <li><a href="./en/tarifs-reglementes-energie">Regulated energy tariffs</a></li>
      </ul>
    </div>
  </Layout>
  )
export default Index
