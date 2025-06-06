import { Component, h, Prop } from '@stencil/core';
import { appState, IDog } from '../../../store/AppState';
import { t } from '../../../store/Translations';


@Component({
  tag: 'app-dog',
  styleUrl: 'AppDog.css'
})
export class AppDog {

  @Prop() dog: IDog;

  handleInputChange(event: KeyboardEvent, field: string) {
    const input = event.target as HTMLInputElement;
    let value: any = input.value;

    // Convert value types for certain fields
    if (field === 'age') {
      value = parseInt(value, 10);
    }

    // Update the dog object in the app state
    const updatedDog = { ...this.dog, [field]: value } as IDog;
    const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
    
    if (dogIndex !== -1) {
      appState.dogs[dogIndex] = updatedDog;
      appState.dogs = [...appState.dogs];
    }
  }
  
  render() {
    return (
      <div class={{
        'dog-wrapper': true,
        'dog-wrapper-edit': appState.mode === 'edit',
        'dog-wrapper-view': appState.mode === 'view'
      }}>
        <div class="form-group dog-name">
          <label htmlFor="name">{ t('name', 'Name') }</label>
          { appState.mode === 'edit' && <input type="name" id="name" name="name" placeholder="Name" value={this.dog.name} onKeyUp={(e) => {
            this.handleInputChange(e, 'name');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.name }</p> }
        </div>
        <div class="form-group dog-age">
          <label htmlFor="name">{ t('age', 'Age') }</label>
          { appState.mode === 'edit' && <input type="number" step={1} id="age" name="age" placeholder="Age" value={this.dog.age} onKeyUp={(e) => {
            this.handleInputChange(e, 'age');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.age }</p> }
        </div>
        <div class="form-group dog-breed">
          <label htmlFor="name">{ t('breed', 'Breed') }</label>
          { appState.mode === 'edit' && <input type="text" id="breed" name="breed" placeholder="Breed" value={this.dog.breed} onKeyUp={(e) => {
            this.handleInputChange(e, 'breed');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.breed }</p> }
        </div>
        <div class="form-group dog-sex">
          <label htmlFor="name">{ t('sex', 'Sex') }</label>
          { appState.mode === 'edit' && <select name="sex" onChange={(e) => {
            const select = e.target as HTMLSelectElement;
            const value = select.value;
            
            const updatedDog: IDog = { ...this.dog, sex: value as any };
            const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
            
            if (dogIndex !== -1) {
              appState.dogs[dogIndex] = updatedDog;
              appState.dogs = [...appState.dogs];
            }
          }}>
            <option value="">{ t('select_sex', 'Select sex') }</option>
            <option selected={this.dog.sex === 'm'} value="m">{ t('male', 'Male') }</option>
            <option selected={this.dog.sex === 'f'} value="f">{ t('female', 'Female') }</option>
          </select> }
          { appState.mode === 'view' && <p>{ this.dog.sex === 'm' ? t('male', 'Male') : t('female', 'Female') }</p> }
        </div>
        <div class="form-group dog-castrated">
          <label htmlFor="name">{ t('castrated', 'Castrated') }</label>
          { appState.mode === 'edit' && <select name="castrated" onChange={(e) => {
            const select = e.target as HTMLSelectElement;
            const value = select.value === 'true';

            const updatedDog: IDog = { ...this.dog, castrated: value };
            const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
            
            if (dogIndex !== -1) {
              appState.dogs[dogIndex] = updatedDog;
              appState.dogs = [...appState.dogs];
            }
          }}>
            <option value="" disabled>{ t('castrated', 'Castrated') }</option>
            <option selected={this.dog.castrated} value="true">{ t('yes', 'Yes') }</option>
            <option selected={!this.dog.castrated} value="false">{ t('no', 'No') }</option>
          </select> }
          { appState.mode === 'view' && <p>{ this.dog.castrated ? t('yes', 'Yes') : t('no', 'No') }</p> }
        </div>
        <div class="form-group dog-division">
          <label htmlFor="division">{ t('division', 'Division') }</label>
          { appState.mode === 'edit' &&
            <div class="division-options">
              { ['mantrailing', 'area', 'rubble', 'avalanche', 'water'].map((div) => {
                const checked = this.dog?.divisions?.some(d => d.division === div);
                return <div class="division-option">
                  <label>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const isChecked = input.checked;
                      const divisions = [...this.dog.divisions];
                      const idx = divisions.findIndex(d => d.division === div);
                      if (isChecked && idx === -1) {
                        divisions.push({ division: div as any, indication: 'bark' });
                      } else if (!isChecked && idx !== -1) {
                        divisions.splice(idx, 1);
                      }
                      const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
                      if (dogIndex !== -1) {
                        appState.dogs[dogIndex] = { ...this.dog, divisions } as IDog;
                        appState.dogs = [...appState.dogs];
                      }
                    }} /> {
                      {
                        mantrailing: t('mantrailing', 'Mantrailing'),
                        area: t('area_search', 'Area search'),
                        rubble: t('rubble_search', 'Rubble search'),
                        avalanche: t('avalanche_search', 'Avalanche search'),
                        water: t('water_search', 'Water search')
                      }[div]
                    }
                  </label>
                  { checked && <select onChange={(e) => {
                    const select = e.target as HTMLSelectElement;
                    const value = select.value;
                    const divisions = [...this.dog.divisions];
                    const idx = divisions.findIndex(d => d.division === div);
                    if (idx !== -1) {
                      divisions[idx] = { division: div as any, indication: value as any };
                    }
                    const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
                    if (dogIndex !== -1) {
                      appState.dogs[dogIndex] = { ...this.dog, divisions } as IDog;
                      appState.dogs = [...appState.dogs];
                    }
                  }}>
                    <option value="bark" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'bark'}>{ t('barking', 'Barking') }</option>
                    <option value="recall-refind" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'recall-refind'}>{ t('recall_refind', 'Recall/Refind') }</option>
                    <option value="passive" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'passive'}>{ t('passive', 'Passive') }</option>
                    <option value="other" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'other'}>{ t('other', 'Other') }</option>
                  </select> }
                </div>;
              }) }
            </div> }
          { appState.mode === 'view' &&
            <ul>
              { this.dog?.divisions?.map(d => <li>{
                {
                  mantrailing: t('mantrailing', 'Mantrailing'),
                  area: t('area_search', 'Area search'),
                  rubble: t('rubble_search', 'Rubble search'),
                  avalanche: t('avalanche_search', 'Avalanche search'),
                  water: t('water_search', 'Water search')
                }[d.division]
              } - {
                {
                  bark: t('barking', 'Barking'),
                  'recall-refind': t('recall_refind', 'Recall/Refind'),
                  passive: t('passive', 'Passive'),
                  other: t('other', 'Other')
                }[d.indication]
              }</li>) }
            </ul> }
        </div>

        { appState.mode === 'edit' && <div class="form-group form-group-actions">
          <button class="button-delete" onClick={() => {
            if (confirm(t('delete_dog_confirm', 'Are you sure you want to delete this dog?'))) {
              const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
              if (dogIndex !== -1) {
                appState.dogs.splice(dogIndex, 1);
                appState.dogs = [...appState.dogs];
              }
            }
          }}>{ t('delete', 'Delete') }</button>
        </div> }
      </div>
    );
  }
}