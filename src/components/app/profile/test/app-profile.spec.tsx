import { newSpecPage } from '@stencil/core/testing';

jest.mock('../../../../store/AppState', () => ({
  appState: {
    mode: 'view',
    profile: null,
    dogs: []
  }
}));
import { AppProfile } from '../AppProfile';
import { appState } from '../../../../store/AppState';

describe('app-profile', () => {
  beforeEach(() => {
    appState.profile = {
      name: 'Jane',
      phone: '123',
      organisation: 'drk',
      unitName: 'Unit',
      notes: 'Note'
    } as any;
  });

  it('renders inputs in edit mode', async () => {
    appState.mode = 'edit';
    const page = await newSpecPage({ components: [AppProfile], html: `<app-profile></app-profile>` });
    expect(page.root?.querySelector('input[name="name"]')).not.toBeNull();
  });

  it('renders text in view mode', async () => {
    appState.mode = 'view';
    const page = await newSpecPage({ components: [AppProfile], html: `<app-profile></app-profile>` });
    expect(page.root?.textContent).toContain('Jane');
  });
});
