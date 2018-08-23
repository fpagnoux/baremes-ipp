import {resolveSection} from '../../server/resolver'

it('should run', (done) => {
  resolveSection({
    "subparams": {
      "contributions": {
        "subsection": "prelevements_sociaux.contributions_sociales"
      }
    }
  }).then(section => {
    expect(section.subparams.contributions.subparams).toBeTruthy()
    done()
  })
});
