import Layout from '../../components/Layout'
import LangToggle from '../../components/LangToggle'

const Index = () => (
  <Layout>
    <LangToggle lang="en" target="/"/>
    <h1 className="box"><span>IPP tax and benefit tables</span></h1>
    <div className="entry-content text">
      <h4>Taxes</h4>
      <ul>
        <li><a href="./social-security-contributions">Social security contributions</a></li>
        <li><a href="./income-tax">Income tax</a></li>
        <li><a href="./capital-taxation">Capital taxation</a></li>
        <li><a href="./indirect-taxation">Indirect taxation</a></li>
        <li><a href="./taxation-societes">Business taxation</a></li>
      </ul>
      <h4>Contributory and non-contributory benefits</h4>
      <ul>
        <li><a href="./social-benefits">Prestations sociales</a></li>
        <li><a href="./unemployment">Chômage</a></li>
        <li><a href="./pension">Retraite</a></li>
      </ul>
      <h4>Market regulations</h4>
      <ul>
        <li><a href="./labour-market">Labour market</a></li>
        <li><a href="./regulated-energy-tariffs">Regulated energy tariffs</a></li>
      </ul>
    </div>
  </Layout>
  )
export default Index
