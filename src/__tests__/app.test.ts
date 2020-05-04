import AppTemplate = require('../app');
import {Template} from "coge-generator";

describe('ts-node/app', () => {
  it('should be a template', () => {
    expect(new AppTemplate({})).toBeInstanceOf(Template);
  })
});
