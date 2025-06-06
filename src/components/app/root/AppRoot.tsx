import { Component, h } from '@stencil/core';
import { appState, IDog } from '../../../store/AppState';
import { translationState, setLanguage, t } from '../../../store/Translations';
import qrcode from 'qrcode-generator';

@Component({
  tag: 'app-root',
  styleUrl: 'AppRoot.css'
})
export class AppRoot {
  
  async openQRCode() {
    var typeNumber: TypeNumber = 20;
    var errorCorrectionLevel: ErrorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(JSON.stringify({
      profile: appState.profile,
      dogs: appState.dogs,
    }));
    qr.make();
    document.getElementById('qr-placeholder').innerHTML = qr.createSvgTag(6, 10);

    const dialog = document.getElementById('qr-code-dialog') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      });
    }
  }

  openPrint() {
    const profile = appState.profile;
    const dogs = appState.dogs;

    const dogsHtml = dogs.map((dog) => {
      const divs = dog.divisions.map(d => `${d.division} (${d.indication})`).join(', ');
      return `
      <li>
        <strong>${dog.name}</strong> - ${dog.age}y, ${dog.breed}, ${dog.sex === 'm' ? 'Male' : 'Female'}, ${divs}, ${dog.castrated ? 'Castrated' : 'Not castrated'}
      </li>`;
    }).join('');

    const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Print</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 1rem; }
        h1 { font-size: 1.2rem; margin: 0; }
        h2 { font-size: 1rem; margin-top: 1rem; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.2rem; }
        @media print { @page { size: A6; margin: 10mm; } }
      </style>
    </head>
    <body>
      <h1>${profile?.name || ''}</h1>
      <p>Phone: ${profile?.phone || ''}</p>
      <p>Organisation: ${profile?.organisation || ''}</p>
      <p>Unit: ${profile?.unitName || ''}</p>
      <p>${profile?.notes || ''}</p>
      <h2>${t('dogs','Dogs')}</h2>
      <ul>${dogsHtml}</ul>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  render() {
    return (
      <div class="app-wrapper">
        <div class="app-inner-wrapper">
          <dialog id="qr-code-dialog" class="app-qr-code-dialog">
            <div id="qr-placeholder" class="app-qr-code-placeholder" />
          </dialog>
          <header class="app-header">
            <div class="app-title">
              <h1>{ t('registration_card', 'Registration Card') }</h1>
              <h2>{ t('rescue_dog_team', 'Rescue Dog Team') }</h2>
            </div>
            <ul class="app-menu">
              { ['view', 'code'].includes(appState.mode) && <li onClick={() => { appState.mode = 'edit'; }}>
                <img src="/assets/icons/pencil.svg" alt="Edit" class="icon" />
              </li> }
              { ['edit', 'code'].includes(appState.mode) && <li onClick={() => { appState.mode = 'view'; }}>
                <img src="/assets/icons/eye.svg" alt="View" class="icon" />
              </li> }
              <li onClick={() => {
                this.openQRCode();
              }}>
                <img src="/assets/icons/qr-code.svg" alt="QR Code" class="app-qr-code-icon" />
              </li>
              <li onClick={() => {
                this.openPrint();
              }}>
                <img src="/assets/icons/printer.svg" alt="Print" class="icon" />
              </li>
            </ul>
          </header>
          <div class="app-content">
            { appState.mode === 'code' && <p>Code Mode</p> }
            { appState.mode !== 'code' && <div class="app-profile-wrapper">
              <app-profile />
              <div class="app-dogs-wrapper">
                <div class="app-dogs-header">
                  <h2>{ t('dogs', 'Dogs') }</h2>
                  { (appState.mode === 'edit' || appState.dogs.length === 0) && <button
                    class="app-add-dog-button"
                    onClick={() => {
                      const newDog:IDog = {
                        name: '',
                        age: 1,
                        breed: '',
                        sex: 'm',
                        divisions: [],
                        notes: '',
                        castrated: false,
                      };
                      appState.dogs = [...appState.dogs, newDog];
                      setTimeout(() => {
                        const dogEls = document.querySelectorAll('app-dog');
                        const last = dogEls[dogEls.length - 1] as any;
                        last?.openDialog?.();
                      }, 0);
                    }}
                  >{ t('add_dog', 'Add Dog') }</button> }
                </div>
                { appState.dogs.length === 0 && <p class="app-no-dogs">{ t('no_dogs', 'No dogs added yet.') }</p> }
                { appState.dogs.length > 0 &&
                  <div class={{ 'app-dogs-list': true, 'app-dogs-list-view': true }}>
                    { appState.dogs.map((dog) =>
                      <app-dog dog={dog} />
                    )}
                  </div>
                }
              </div>
            </div> }
          </div>
          <footer class="app-footer">
            <select onChange={(e) => setLanguage((e.target as HTMLSelectElement).value)}>
              { Object.keys(translationState.translations).map(lang => {
                const names: {[k:string]: string} = { en: 'English', de: 'Deutsch', fr: 'Français' };
                return <option value={lang} selected={translationState.language === lang}>{names[lang] || lang}</option>;
              }) }
            </select>
          </footer>
        </div>
      </div>
    );
  }
}