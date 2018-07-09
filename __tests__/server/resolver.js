import {resolveSectionDesc} from '../../server/resolver'

it('should run', (done) => {
  resolveSectionDesc({
    "children": {
      "contributions": {
        "subsection": "prelevements_sociaux.contributions"
      }
    }
  }).then(section => {
    expect(section.children.contributions.children).toBeTruthy()
    done()
  })
});
