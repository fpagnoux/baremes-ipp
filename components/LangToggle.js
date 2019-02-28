import {isWP} from '../config'

const LangToggle = ({target, lang}) => {
  const text = (lang == 'fr') ? 'EN' : 'FR'
  return <div><a href={target} style={{float: 'right'}}>{text}</a></div>
}

export default LangToggle
