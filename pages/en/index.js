import Layout from '../../components/Layout'
import LangToggle from '../../components/LangToggle'

const Index = () => (
  <Layout>
    <LangToggle lang="en" path="/en"/>
    <h1 className="box"><span>IPP tax and benefit tables</span></h1>
    <div className="entry-content text">
      <h4>Taxes</h4>
      <ul>
        <li><a href="./prelevements-sociaux">Social security contributions</a></li>
        <li><a href="./income-tax">Income tax</a></li>
        <li><a href="./taxation-du-capital">Capital taxation</a></li>
        <li><a href="./taxation-indirecte">Indirect taxation</a></li>
        <li><a href="./taxation-societes">Business taxation</a></li>
      </ul>
      <h4>Contributory and non-contributory benefits</h4>
      <ul>
        <li><a href="./prestations-sociales">Prestations sociales</a></li>
        <li><a href="./chomage">Chômage</a></li>
        <li><a href="./regimes-de-retraites">Retraite</a></li>
      </ul>
      <h4>Market regulations</h4>
      <ul>
        <li><a href="./marche-du-travail">Labour market</a></li>
        <li><a href="./tarifs-reglementes-energie">Regulated energy tariffs</a></li>
      </ul>
    </div>
  </Layout>
  )
export default Index
