import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class SoundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} soundFileName - a sound file that exists in www/media/sounds
   * @param {boolean} loop - whether or not to loop the sound
   */
  constructor( name, modelComponents, controlFunctionString, soundFileName, loop ) {
    super( name, modelComponents, controlFunctionString );
    this.soundFileName = soundFileName;

    // may be undefined when loading
    this.loop = loop || false;
  }

  /**
   * Save state to JSON for saving to database.
   */
  save() {
    return {
      ...super.save(),
      soundFileName: this.soundFileName,
      loop: this.loop
    };
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new SoundViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      stateObject.soundFileName,
      stateObject.loop
    );
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      soundFileName: '',
      loop: false
    };
  }
}