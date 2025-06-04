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
          <label htmlFor="name">Division</label>
          { appState.mode === 'edit' && <select name="division" onChange={(e) => {
            const select = e.target as HTMLSelectElement;
            const value = select.value;
            
            const updatedDog: IDog = { ...this.dog, division: value as any };
            const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
            
            if (dogIndex !== -1) {
              appState.dogs[dogIndex] = updatedDog;
              appState.dogs = [...appState.dogs];
            }
          }}>
            <option value="" disabled>Division</option>
            <option selected={this.dog.division === 'mantrailing'} value="mantrailing">Mantrailing</option>
            <option selected={this.dog.division === 'area'} value="area">Area search</option>
            <option selected={this.dog.division === 'rubble'} value="rubble">Rubble search</option>
            <option selected={this.dog.division === 'avalanche'} value="avalanche">Avalanche search</option>
            <option selected={this.dog.division === 'water'} value="water">Water search</option>
          </select> }
          { appState.mode === 'view' && <p>
            { this.dog.division === 'mantrailing' && 'Mantrailing' }
            { this.dog.division === 'area' && 'Area search' }
            { this.dog.division === 'rubble' && 'Rubble search' }
            { this.dog.division === 'avalanche' && 'Avalanche search' }
            { this.dog.division === 'water' && 'Water search' }
          </p> }
        </div>
        <div class="form-group">
          <label htmlFor="name">Indication</label>
          { appState.mode === 'edit' && <select name="indication" onChange={(e) => {
            const select = e.target as HTMLSelectElement;
            const value = select.value;
            
            const updatedDog: IDog = { ...this.dog, indication: value as any };
            const dogIndex = appState.dogs.findIndex((dog: IDog) => dog.name === this.dog.name);
            
            if (dogIndex !== -1) {
              appState.dogs[dogIndex] = updatedDog;
              appState.dogs = [...appState.dogs];
            }
          }}>
            <option value="" disabled>Indication</option>
            <option selected={this.dog.indication === 'bark'} value="bark">Barking</option>
            <option selected={this.dog.indication === 'recall-refind'} value="recall-refind">Recall/Refind</option>
            <option selected={this.dog.indication === 'passive'} value="passive">Passive</option>
            <option selected={this.dog.indication === 'other'} value="other">Other</option>
          </select> }
          { appState.mode === 'view' && <p>
            { this.dog.indication === 'bark' && 'Barking' }
            { this.dog.indication === 'recall-refind' && 'Recall/Refind' }
            { this.dog.indication === 'passive' && 'Passive' }
            { this.dog.indication === 'other' && 'Other' }
          </p> }
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