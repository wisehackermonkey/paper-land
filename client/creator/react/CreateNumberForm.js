import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreateNumberForm( props ) {
  const valueRef = useRef( '' );
  const minRef = useRef( '' );
  const maxRef = useRef( '' );

  const handleChange = () => {
    const allDefined = [ valueRef, minRef, maxRef ].every( ref => ref.current !== '' );
    const numbers = [ minRef, valueRef, maxRef ].map( ref => parseInt( ref.current, 10 ) );

    const minNumber = numbers[ 0 ];
    const defaultNumber = numbers[ 1 ];
    const maxNumber = numbers[ 2 ];
    const inRange = minNumber < defaultNumber && defaultNumber < maxNumber;
    props.isFormValid( allDefined && inRange );
    props.getFormData( { min: minRef.current, max: maxNumber, default: defaultNumber } );
  };

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min Value</Form.Label>
        <Form.Control
          type='number'
          onChange={event => {
            minRef.current = event.target.value;
            handleChange();
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max Value</Form.Label>
        <Form.Control
          type='number'
          onChange={event => {
            maxRef.current = event.target.value;
            handleChange();
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Control
          type='number'
          onChange={event => {
            valueRef.current = event.target.value;
            handleChange();
          }}
        />
      </Form.Group></div>
  );
}