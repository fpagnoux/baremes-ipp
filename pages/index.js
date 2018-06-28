import Layout from '../components/Layout'


const Index = () => (
  <Layout>
    <h1 className="box"><span>Barèmes IPP</span></h1>
    <div className="entry-content text">
      <h4>Transferts et prestations</h4>
      <h5>Prestations sociales</h5>
      <h6>Minima sociaux</h6>
      <ul>
        <li><a href="/table?table=rsa_montant">Revenu de solidarité active (RSA) : montant de base</a></li>
        <li><a href="/table?table=rsa_majoration">Revenu de solidarité active (RSA) : majorations (montant de base et revenus) et montant minimum versé</a></li>
        <li><a href="/table?table=rsa_forfait_logement">Revenu de solidarité active (RSA) : forfait logement</a></li>
      </ul>
    </div>
  </Layout>
  )
export default Index
