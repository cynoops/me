import { newSpecPage } from '@stencil/core/testing';
import { AppProfile } from './AppProfile';
import { appState } from '../../../store/AppState';

describe('app-profile', () => {
  it('renders selected organisation', async () => {
    appState.mode = 'edit';
    appState.profile = {
      name: '',
      phone: '',
      organisation: 'drk',
      unitName: '',
      notes: '',
    };

    const page = await newSpecPage({
      components: [AppProfile],
      html: `<app-profile></app-profile>`,
    });

    await page.waitForChanges();
    const select = page.root.querySelector('select');
    expect(select).not.toBeNull();
    expect(select.value).toBe('drk');

    const option = select.querySelector('option[value="drk"]');
    expect(option).not.toBeNull();
    expect(option.selected).toBe(true);
  });
});
