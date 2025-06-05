import { Component, h, Prop } from '@stencil/core';
import { appState, IDog } from '../../../store/AppState';


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
        <div class="form-group">
          <label htmlFor="name">Name</label>
          { appState.mode === 'edit' && <input type="name" id="name" name="name" placeholder="Name" value={this.dog.name} onKeyUp={(e) => {
            this.handleInputChange(e, 'name');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.name }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">Age</label>
          { appState.mode === 'edit' && <input type="number" step={1} id="age" name="age" placeholder="Age" value={this.dog.age} onKeyUp={(e) => {
            this.handleInputChange(e, 'age');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.age }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">Breed</label>
          { appState.mode === 'edit' && <input type="text" id="breed" name="breed" placeholder="Breed" value={this.dog.breed} onKeyUp={(e) => {
            this.handleInputChange(e, 'breed');
          }} /> }
          { appState.mode === 'view' && <p>{ this.dog.breed }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">Sex</label>
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
            <option value="">Select sex</option>
            <option selected={this.dog.sex === 'm'} value="m">Male</option>
            <option selected={this.dog.sex === 'f'} value="f">Female</option>
          </select> }
          { appState.mode === 'view' && <p>{ this.dog.sex === 'm' ? 'Male' : 'Female' }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">Castrated</label>
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
            <option value="" disabled>Castrated</option>
            <option selected={this.dog.castrated} value="true">Yes</option>
            <option selected={!this.dog.castrated} value="false">No</option>
          </select> }
          { appState.mode === 'view' && <p>{ this.dog.castrated ? 'Yes' : 'No' }</p> }
        </div>
        <div class="form-group">
          <label htmlFor="division">Division</label>
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
                        mantrailing: 'Mantrailing',
                        area: 'Area search',
                        rubble: 'Rubble search',
                        avalanche: 'Avalanche search',
                        water: 'Water search'
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
                    <option value="bark" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'bark'}>Barking</option>
                    <option value="recall-refind" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'recall-refind'}>Recall/Refind</option>
                    <option value="passive" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'passive'}>Passive</option>
                    <option value="other" selected={this.dog.divisions.find(d => d.division === div)?.indication === 'other'}>Other</option>
                  </select> }
                </div>;
              }) }
            </div> }
          { appState.mode === 'view' &&
            <ul>
              { this.dog?.divisions?.map(d => <li>{
                {
                  mantrailing: 'Mantrailing',
                  area: 'Area search',
                  rubble: 'Rubble search',
                  avalanche: 'Avalanche search',
                  water: 'Water search'
                }[d.division]
              } - {
                {
                  bark: 'Barking',
                  'recall-refind': 'Recall/Refind',
                  passive: 'Passive',
                  other: 'Other'
                }[d.indication]
              }</li>) }
            </ul> }
        </div>

        { appState.mode === 'edit' && <div class="form-group form-group-actions">
          <button class="button-delete" onClick={() => {
            if (confirm('Are you sure you want to delete this dog?')) {
              const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
              if (dogIndex !== -1) {
                appState.dogs.splice(dogIndex, 1);
                appState.dogs = [...appState.dogs];
              }
            }
          }}>Delete</button>
        </div> }
      </div>
    );
  }
}