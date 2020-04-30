import AppTemplate = require('../app');
import {Template} from "coge-generator";

describe('tsnp/app', () => {
  it('should be a template', () => {
    expect(new AppTemplate({})).toBeInstanceOf(Template);
  })
});
