import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import xhr from 'xhr';
import styles from './../CreatorMain.css';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateSoundViewForm( props ) {
  const [ soundFiles, setSoundFiles ] = useState( [] );

  // Load sound files on mount
  useEffect( () => {
    const soundFilesListUrl = new URL( 'api/creator/soundFiles', window.location.origin ).toString();
    xhr.get( soundFilesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body && response.body.soundFiles ) {
          if ( Array.isArray( response.body.soundFiles ) ) {
            setSoundFiles( response.body.soundFiles );

            // set the first sound file as the default
            props.getSoundFormData( { soundFileName: response.body.soundFiles[ 0 ] } );
          }
        }
      }
    } );
  }, [] );

  const soundFileSelector = (
    <div>
      <Form.Label>Select sound file:</Form.Label>
      <Form.Select
        onChange={event => {
          props.getSoundFormData( { soundFileName: event.target.value } );
        }}
      >
        {
          soundFiles.map( ( soundFile, index ) => {
            return (
              <option
                key={`sound-file-${index}`}
                value={soundFile}
              >{soundFile}</option>
            );
          } )
        }
      </Form.Select>
    </div>
  );

  const soundFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>setPlaybackRate() - takes a value that must be larger than 0</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setOutputLevel() - takes a value between 0 and 1</ListGroup.Item>
      </ListGroup>
    </div>
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={soundFileSelector}
        typeSpecificFunctions={soundFunctions}
        isFormValid={props.isFormValid}
        getFormData={props.getGeneralFormData}
        functionPrompt={'Use the available functions and variables to control the sound.'}
        componentsPrompt={'Function is called and sound is played whenever a component changes.'}
      ></ViewComponentControls>
    </div>
  );
}