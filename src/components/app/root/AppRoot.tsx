import { Component, h } from '@stencil/core';
import { appState, IDog } from '../../../store/AppState';
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

  render() {
    return (
      <div class="app-wrapper">
        <dialog id="qr-code-dialog" class="app-qr-code-dialog">
          <div id="qr-placeholder" class="app-qr-code-placeholder" />
        </dialog>
        <header class="app-header">
          <div class="app-title">
            <h1>Digital Registration Card</h1>
            <h2>Rescue Dog Team</h2>
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
          </ul>
        </header>
        <div class="app-content">
          { appState.mode === 'code' && <p>Code Mode</p> }
          { appState.mode !== 'code' && <div class="app-profile-wrapper">
            <app-profile />
            <div class="app-dogs-wrapper">
              <div class="app-dogs-header">
                <h2>Dogs</h2>
                { appState.mode === 'edit' && <button
                  class="app-add-dog-button"
                  onClick={() => {
                    const newDog:IDog = {
                      name: '',
                      age: 1,
                      breed: '',
                      sex: 'm',
                      division: 'area',
                      indication: 'bark',
                      notes: '',
                      castrated: false,
                    };
                    appState.dogs = [...appState.dogs, newDog];
                  }}  
                >Add Dog</button> }
              </div>
              { appState.dogs.length === 0 && <p class="app-no-dogs">No dogs added yet.</p> }
              { appState.dogs.length > 0 &&
                <div class={{'app-dogs-list': true, 'app-dogs-list-edit': appState.mode === 'edit', 'app-dogs-list-view': appState.mode === 'view'}}>
                  { appState.dogs.map((dog) =>
                    <app-dog dog={dog} />
                  )}
                </div>
              }
            </div>
          </div> }
        </div>
      </div>
    );
  }
}