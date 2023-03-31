/**
 * The main model component for the board. This is a map with keys that are the name of the model component
 * and values of the model subcomponents components for board that are created by paper programs.
 *
 * This file has functions for the working with the model that are added to the paperLand namespace so that
 * they are available in paper program code.
 */

import paperLand from './paperLand.js';

// The model of our sim design board, with all model Properties and components from paper programs.
// Map<string, Object> - keys are the name of the model component, values are any kind of model component
const boardModel = new Map();

// Maps that give all functions listening for model component add/remove. We need references to those listeners
// so that we can easily add/remove them when model components or observers are removed.
// Map<string, function> - keys are name of the component, functions are the listeners
const componentNameToAddedListenerMap = new Map();
const componentNameToRemovedListenerMap = new Map();

// Emits events when model components are added or removed, to be used in program code. Emits with two args
// {string} - name of the model component
// {*} - Reference to the component being added or removed
paperLand.modelComponentAddedEmitter = new window.phet.axon.Emitter();
paperLand.modelComponentRemovedEmitter = new window.phet.axon.Emitter();

/**
 * Adds a model component to the model Object with the provided name. Emits events so client code can observe
 * changes to the model.
 * @param {string} componentName
 * @param {*} componentObject - any model component (Property, or object with multiple Properties and values)
 */
paperLand.addModelComponent = ( componentName, componentObject ) => {
  if ( boardModel.get( componentName ) === undefined ) {
    boardModel.set( componentName, componentObject );
    paperLand.modelComponentAddedEmitter.emit( componentName, componentObject );
  }
  else {
    console.warn( `Model already has component with name ${componentName}` );
  }
};

/**
 * Remove a component with the provided name from the model. Updates the global modelProperty which is our map
 * of all model components and also emits a separate Emitter.
 * @param {string} componentName
 */
paperLand.removeModelComponent = componentName => {
  const componentObject = boardModel.get( componentName );

  if ( componentObject === undefined ) {
    console.warn( `Model does not have component with name ${componentName}` );
  }
  else {

    // delete the object from the global model and then reassign to trigger a Property change
    boardModel.delete( componentName );

    // emit events, passing the componentObject through so that client can dispose of various objects
    paperLand.modelComponentRemovedEmitter.emit( componentName, componentObject );

    // dispose the component when we are done with it, if supported
    componentObject.dispose && componentObject.dispose();
  }
};

/**
 * Adds a listener to the provided emitter and saves a reference to it in a Map so it can be easily removed later.
 * @param componentName {string}
 * @param emitter {phet.axon.Emitter} - Either modelComponentRemovedEmitter or modelComponentAddedEmitter
 * @param listener {function} - listener for when the model component is added/removed
 * @param listenerMap {Map} - Either componentNameToAddedListenerMap or componentNameToRemovedListenerMap
 */
const addListenerToModelChangeEmitter = ( componentName, emitter, listener, listenerMap ) => {
  emitter.addListener( listener );

  if ( !listenerMap.has( componentName ) ) {
    listenerMap.set( componentName, [] );
  }
  listenerMap.get( componentName ).push( listener );
};

/**
 * Removes the listener from the provided emitter and clears it from the reference Map.
 *
 * @param componentName {string}
 * @param emitter {phet.axon.Emitter} - Either modelComponentAddedEmitter or modelComponentRemovedEmitter
 * @param listener {function}
 * @param listenerMap {Map} - Either componentNameToAddedListenerMap or componentNameToRemovedListenerMap
 */
const removeListenerFromModelChangeEmitter = ( componentName, emitter, listener, listenerMap ) => {
  emitter.removeListener( listener );

  if ( !listenerMap.has( componentName ) ) {
    throw new Error( 'listenerMap does not have provided listener.' );
  }
  else {
    const listeners = listenerMap.get( componentName );
    const index = listeners.indexOf( listener );
    if ( index > -1 ) {
      listeners.splice( index, 1 );

      if ( listeners.length === 0 ) {
        listenerMap.delete( componentName );
      }
    }
    else {
      throw new Error( 'listener was not in the array for component' );
    }
  }
};

/**
 * Add an observer for a model component that is expected to be in the boardModel.
 *
 * When the model exists, handleComponentAttach is called with it and listeners are added to the boardModel to detach
 * when the model component is removed. When the model does not exist (or is removed), listeners are added to the board
 * model to handle when the component is added back again.
 *
 * This supports paper programs that have dependencies on each-other while also allowing them to be added to the
 * view in any order.
 * @param componentName {string} - name of the model component to attach to
 * @param handleComponentAttach {function(component)} - handles attachment to the model component when the component
 *                                                      exists (for example, call `component.link` here)
 * @param handleComponentDetach {function(component)} - handles detachment from the model component when component is
 *                                                      removed (for example, call `component.unlink` here)
 */
paperLand.addModelObserver = ( componentName, handleComponentAttach, handleComponentDetach ) => {

  // Component exists in the model - do whatever work is needed on attach and add listeners to watch for when
  // the component is removed again.
  const handleComponentExists = component => {
    handleComponentAttach( component );

    const componentRemovedListener = removedComponentName => {
      if ( componentName === removedComponentName ) {
        handleComponentDoesNotExist( component );
        removeListenerFromModelChangeEmitter( componentName, paperLand.modelComponentRemovedEmitter, componentRemovedListener, componentNameToRemovedListenerMap );
      }
    };
    addListenerToModelChangeEmitter( componentName, paperLand.modelComponentRemovedEmitter, componentRemovedListener, componentNameToRemovedListenerMap );
  };
  const handleComponentDoesNotExist = component => {
    if ( component !== undefined ) {
      handleComponentDetach( component );
    }

    const componentAddedListener = ( addedComponentName, addedComponent ) => {
      if ( componentName === addedComponentName ) {
        handleComponentExists( addedComponent );
        removeListenerFromModelChangeEmitter( componentName, paperLand.modelComponentAddedEmitter, componentAddedListener, componentNameToAddedListenerMap );
      }
    };
    addListenerToModelChangeEmitter( componentName, paperLand.modelComponentAddedEmitter, componentAddedListener, componentNameToAddedListenerMap );
  };

  if ( boardModel.has( componentName ) ) {

    // component already exists in the model, handle it and wait for removal
    handleComponentExists( boardModel.get( componentName ) );
  }
  else {

    // component does not exist yet, wait for it to be added
    handleComponentDoesNotExist();
  }
};

/**
 * Removes the model observer for the component with the provided name and does some detachment from the model
 * component.
 * @param componentName {string} - name of the model component to stop watching
 * @param handleComponentDetach {function(component)} - handles detach on the model component to stop observing changes
 *                                                      (for example, call `component.unlink` here)
 */
paperLand.removeModelObserver = ( componentName, handleComponentDetach ) => {
  if ( boardModel.has( componentName ) ) {
    handleComponentDetach( boardModel.get( componentName ) );
  }

  // remove any modelComponentAdded/modelComponentRemoved emitter listeners that were added on
  // addModelObserver...
  const componentAddedListeners = componentNameToAddedListenerMap.get( componentName );
  if ( componentAddedListeners ) {
    while ( componentAddedListeners.length > 0 ) {
      paperLand.modelComponentAddedEmitter.removeListener( componentAddedListeners.pop() );
    }
  }

  const componentRemovedListeners = componentNameToRemovedListenerMap.get( componentName );
  if ( componentRemovedListeners ) {
    while ( componentRemovedListeners.length > 0 ) {
      paperLand.modelComponentRemovedEmitter.removeListener( componentRemovedListeners.pop() );
    }
  }
};

/**
 * Adds a listener to a Property in the boardModel. If the Property does not exist, the listener will be linked
 * as soon as it does. If the Property is removed from the model, the listener will be unlinked, but linked again
 * as soon as the Property is added back to the model.
 * @param componentName {string} - name of the component to observe
 * @param listener - {function(value)} - listener linked to the model Property
 */
paperLand.addModelPropertyLink = ( componentName, listener ) => {
  paperLand.addModelObserver(
    componentName,
    component => {
      if ( !component.link ) { throw new Error( 'Model component is not a Property' ); }
      component.link( listener );
    },
    component => {
      if ( !component.unlink ) { throw new Error( 'Model component is not a Property' ); }
      component.unlink( listener );
    }
  );
};

/**
 * Removes a listener form a Property in the boardModel and stops watching for changes to the boardModel to add/remove
 * the Property listener again when the model Property is added/removed from the boardModel.
 * @param componentName {string} - name of Property to unlink from
 * @param listener {function} - listener should have been added with addModelPropertyLink
 */
paperLand.removeModelPropertyLink = ( componentName, listener ) => {
  paperLand.removeModelObserver(
    componentName,
    component => component.unlink( listener )
  );
};

export default boardModel;