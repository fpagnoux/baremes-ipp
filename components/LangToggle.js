import {basename, isProd} from '../config'

const LangToggle = ({path, lang}) => {
  const toEn = lang == 'fr'
  const target = toEn ? `${basename}/en${path}`: `${basename}${path.replace(/^\/en/, '')}` || '/'
  debugger
  const text = toEn ? 'EN' : 'FR'
  return <div><a href={target} style={{float: 'right'}}>{text}</a></div>
}

export default LangToggle
