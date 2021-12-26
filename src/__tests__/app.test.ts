import {Template} from '@coge/generator';
import AppTemplate = require('../app');

describe('ts-node/app', () => {
  it('should be a template', () => {
    expect(new AppTemplate({})).toBeInstanceOf(Template);
  });
});
