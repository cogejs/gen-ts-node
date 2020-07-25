import {Template} from 'coge-generator';
import {expect} from '@tib/testlab';
import AppTemplate = require('../app');

describe('ts-node/app', () => {
  it('should be a template', () => {
    expect(new AppTemplate({})).instanceOf(Template);
  });
});
