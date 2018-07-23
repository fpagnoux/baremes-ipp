import {resolveSection} from '../../server/resolver'

it('should run', (done) => {
  resolveSection({
    "children": {
      "contributions": {
        "subsection": "prelevements_sociaux.contributions_sociales"
      }
    }
  }).then(section => {
    expect(section.children.contributions.children).toBeTruthy()
    done()
  })
});
