import { Ng2SelectPage } from './app.po';

describe('ng2-select App', function() {
  let page: Ng2SelectPage;

  beforeEach(() => {
    page = new Ng2SelectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
