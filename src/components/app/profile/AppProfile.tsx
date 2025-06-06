import { Component, h } from '@stencil/core';
import { appState } from '../../../store/AppState';
import { t } from '../../../store/Translations';

@Component({
  tag: 'app-profile',
  styleUrl: 'AppProfile.css'
})
export class AppProfile {

  organisations = [
    { id: 'drv', name: 'DRV' },
    { id: 'drk', name: 'DRK' },
    { id: 'asb', name: 'ASB' },
    { id: 'dlrg', name: 'DLRG' },
    { id: 'brh', name: 'BRH' },
    { id: 'bzrh', name: 'BZRH' },
    { id: 'malteser', name: 'Malteser' },
    { id: 'johanniter', name: 'Johanniter' },
  ];
  
  handleInputChange(event: KeyboardEvent, field: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    appState.profile = {
      ...appState.profile,
      [field]: value
    };
  }

  render() {
    return (
      <div class="profile-wrapper">
        <div class="form-group">
          <label htmlFor="name">{ t('name', 'Name') }</label>
          { appState.mode === 'edit' && <input type="text" id="name" name="name" placeholder={t('name_placeholder', 'Your Name')} value={appState.profile.name} onKeyUp={(e) => {
            this.handleInputChange(e, 'name');
          }} /> }
          { appState.mode === 'view' && <p>{ appState.profile.name }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">{ t('phone', 'Phone') }</label>
          { appState.mode === 'edit' && <input type="phone" id="phone" name="phone" placeholder={t('phone_placeholder', 'Phone')} value={appState.profile.phone} onKeyUp={(e) => {
            this.handleInputChange(e, 'phone');
          }} /> }
          { appState.mode === 'view' && <p>{ appState.profile.phone }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="organisation">{ t('organisation', 'Organisation') }</label>
          { appState.mode === 'edit' && <select name="organisation" id="organisation" onChange={(e) => {
            const select = e.target as HTMLSelectElement;
            const value = select.value;
            
            appState.profile = {
              ...appState.profile,
              organisation: value
            };
          }}>
            <option value="">{ t('select_organisation', 'Select Organisation') }</option>
            {this.organisations.map(org => (
              <option selected={appState.profile.organisation === org.id} value={org.id} key={org.id}>{org.name}</option>
            ))}
            <option value="other" selected={appState.profile.organisation === 'other'}>{ t('other_org', 'Other') }</option>
          </select> }
          { appState.mode === 'view' && <p>{ this.organisations.find((organisation) => {
            return organisation.id === appState.profile.organisation;
          })?.name }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">{ t('unit', 'Unit') }</label>
          { appState.mode === 'edit' && <input type="unitName" id="unitName" name="unitName" placeholder={t('unit_name_placeholder', 'Unit name')} value={appState.profile.unitName} onKeyUp={(e) => {
            this.handleInputChange(e, 'unitName');
          }} /> }
          { appState.mode === 'view' && <p>{ appState.profile.unitName }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="notes">{ t('notes', 'Notes') }</label>
          { appState.mode === 'edit' && <textarea id="notes" name="notes" placeholder={t('notes_placeholder', 'Notes')} onKeyUp={(e) => {
            this.handleInputChange(e, 'notes');
          }}>{ appState.profile.notes }</textarea> }

          { appState.mode === 'view' && <p>{ appState.profile.notes }</p> }
        </div>
      </div>
    );
  }
}