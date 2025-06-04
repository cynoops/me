import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

jest.mock('../../../../store/AppState', () => ({
  appState: {
    mode: 'view',
    profile: null,
    dogs: []
  }
}));

import { AppDog } from '../AppDog';
import { appState } from '../../../../store/AppState';
import { IDog } from '../../../../store/AppState';

describe('app-dog', () => {
  const dog: IDog = {
    name: 'Rex',
    age: 3,
    breed: 'Labrador',
    sex: 'm',
    division: 'area',
    indication: 'bark',
    notes: '',
    castrated: true
  };

  it('renders text in view mode', async () => {
    appState.mode = 'view';
    const page = await newSpecPage({
      components: [AppDog],
      template: () => (<app-dog dog={dog}></app-dog>)
    });
    expect(page.root?.textContent).toContain('Rex');
  });

  it('renders inputs in edit mode', async () => {
    appState.mode = 'edit';
    const page = await newSpecPage({
      components: [AppDog],
      template: () => (<app-dog dog={dog}></app-dog>)
    });
    expect(page.root?.querySelector('input[name="name"]')).not.toBeNull();
  });
});
