import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';
import useEditableForm from './useEditableForm.js';

export default function CreateEnumerationForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    proposedData => {

      // as long as there is at least one value and they are all unique, the form is valid
      return proposedData.values.length > 0 && new Set( proposedData.values ).size === proposedData.values.length;
    },
    props.getFormData,
    NamedEnumerationProperty
  );

  const handleClick = event => {
    handleChange( { values: [ ...formData.values, '' ] } );
  };

  const handleDelete = event => {
    formData.values.pop();
    handleChange( { values: formData.values } );
  };

  // Handle edit to an individual text input for the enumeration - getting the value of that input and inserting it
  // into the form data
  const handleEdit = ( event, index ) => {
    const newValues = formData.values.slice();
    newValues[ index ] = event.target.value;
    handleChange( { values: newValues } );
  };

  return (
    <>
      <div>
        <StyledButton name={'Create Value'} onClick={handleClick} otherClassNames={styles.horizontalPadding}></StyledButton>
        <StyledButton name={'Remove Value'} onClick={handleDelete} otherClassNames={styles.horizontalPadding}></StyledButton>
        {
          formData.values.map( ( value, index ) =>
            <div key={`${index}-enum-input-parent`}>
              <TextInput value={value} index={index} handleEdit={handleEdit}/>
            </div>
          )
        }
      </div>
    </>
  );
}

function TextInput( props ) {
  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Value String</Form.Label>
        <Form.Control type='text' onChange={event => {
          props.handleEdit( event, props.index );
        }} value={props.value}/>
      </Form.Group>
    </>
  );
}