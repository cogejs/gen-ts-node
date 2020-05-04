import GitTemplate = require('../git');
import {Template} from "coge-generator";

describe('ts-node/app', () => {
  it('should be a template', () => {
    expect(new GitTemplate({})).toBeInstanceOf(Template);
  })
});
