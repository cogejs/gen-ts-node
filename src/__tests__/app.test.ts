import {Template} from 'coge-generator';
import {expect} from '@artlab/testlab';
import AppTemplate = require('../app');

describe('ts-node/app', () => {
  it('should be a template', () => {
    expect(new AppTemplate({})).instanceOf(Template);
  });
});
