# Model-View-Controller Framework

The Model-View-Controller (MVC) framework organizes a program into three core segments: the Model, which manages the logic and data; the View, which handles the user interface and presentation; and the Controller, which interprets user inputs and interactions. By utilizing the MVC framework, we aimed to clarify the relationships between these components, specifically focusing on how changes in one segment drive updates in others. The approach involves building Model components that, when updated, trigger changes in other Models or Views, with these updates typically initiated through interactions with a Controller component.

## Model-View Separation

Paper Playground (paper-land/paperLand) code encourages a software design pattern called "model-view separation". This pattern
is often used to develop user interfaces, games, and is heavily used by [SceneryStack](https://scenerystack.github.io/community/) libraries.

Benefits of model-view separation include:

- It separates internal data from the way it is presented to the user.
- You can create multiple output modalities/representations from a single model.
- Changes to the view do not impact application behavior.

## Model

The "model" is the internal data that represents application state and logic.

## View

The view is everything that can be observed by the user. Graphics, sounds, descriptions, vibrations, tangibles -
anything!

## More info

For more info about this pattern, please
see https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md#model-view-controller-mvc
and https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller. MVC is pervasive in software design and is used
for far more than user interface development!

## Example Paper Land model

Let's pretend we want to display a cupcake 🧁 on the Paper Land Display. On the Display, we want to display a visual
cupcake and write strings that describe its properties.

First, lets consider the important things to draw and describe about the cupcake. That will determine the components we
need in the model.

- Type of cake (carrot, chocolate, lemon, ...)
- Type of icing (buttercream, royal, whipped cream, ...)
- Type of sprinkles (confetti, jimmies, pearls, ...)

Let's create a Paper Land model that represents these attributes! As of 4/28/23, Paper Land Program code looks like
this:

```js
  const onProgramAdded = ( paperProgramNumber, scratchPad, sharedData ) => {

    // (1)
    phet.paperLand.addModelComponent( 'cakeTypeProperty', new phet.axon.Property( "Chocolate" ) );
    phet.paperLand.addModelComponent( 'icingTypeProperty', new phet.axon.Property( "Buttercream" ) );
    phet.paperLand.addModelComponent( 'sprinklesProperty', new phet.axon.Property( "Confetti" ) ); 
  };

  // (2)
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString()
      }
    }
  } );
```

Quickly breaking down the numbered sections of the above Program code:

1) `addModelComponent` is used to add new components to the Display model. We provide the name for the component so that
   it can be looked up later, and the actual model component. The model component can be any data type. In this example,
   we are using a PhET library component called `axon.Property`. `axon.Property` has support for sending events
   whenever the value changes. We will use that later to update cupcake descriptions when values change!
2) Boilerplate that tells Paper Land to create these model components when this Program is detected.

NOTE: In a real example, it would be important to remove the model components when the program is removed. See
[Display API](https://github.com/phetsims/paper-land/blob/main/docs/use/board-api.md).

## Example Paper Land view

Let's use the model we just created in some Paper Land Program view code. This view could add dynamic graphics and
descriptions that will change with the model.

```js
  const onProgramAdded = ( paperProgramNumber, scratchPad, sharedData ) => {

    // (1)
    const cupcakeNode = new CupcakeNode(); 
    sharedData.scene.addChild( cupcakeNode );
    
    // (2)
    phet.paperLand.addModelPropertyLink( 'cakeTypeProperty', cakeType => {
    
      // (3)
      if ( cakeType === "Chocolate" ) {
        cupcakeNode.drawChocolate();
        cupcakeNode.descriptionContent = "The richest chocolate you have ever tasted."
      }
      else if ( cakeType === "Carrot" ) {
        cupcakeNode.drawCarrot();
        cupcakeNode.descriptionContent = "Spiced to perfection."
      }
      else if ( cakeType === "Lemon" ) {
        cupcakeNode.drawLemon();
        cupcakeNode.descriptionContent = "As refreshing as it is sweet."
      }
    } );
  };

  // (4)
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
      }
    }
  } );
```

Quickly breaking down the numbered sections of the above Program code:

1) We create a `CupcakeNode` and add it to the scene. The `CupcakeNode` could use scenery to draw the cake, icing, and
   sprinkles and have other structure for a screen reader but that is beyond the scope of these notes. The `cupcakeNode`
   is added as a child to the scene so that it is drawn to the Display.
2) We add a link to the `cakeTypeProperty` with `addModelPropertyLink`. The first argument is the name of the Property
   to observe. The second argument is the work you want to do when the Property value changes. `addModelPropertyLink`
   will handle listener registration for you so that it works no matter what order the model and view code is introduced
   to the Display.
3) This is the logic called whenever the model `cakeTypeProperty` changes. I introduced
   imaginary `drawChocolate`, `drawCarrot` and `drawLemon` functions. Implementing these is beyond the scope of these
   notes, but you could imagine they change images or colors representing the cupcake. They are followed by code
   that changes how the cupcake is described for a screen reader.
4) Boilerplate that tells Paper Land to run this view code whenever the Program is detected.

From a single `cakeTypeProperty`, we support several output modalities. You can imagine many other view
Programs that could play sounds, trigger vibrations, and many other things from this single model component.

NOTE: In a real example, it would be important to remove the model components when the program is removed. See
[Display API](https://github.com/phetsims/paper-land/blob/main/docs/use/board-api.md).