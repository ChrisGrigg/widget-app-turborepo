/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { ModifyWidgetProps, WidgetProps } from "../types";
import usePrevious from "../hooks/usePrevious";
import { defaultMessages, defaultRules, useValidation } from "react-simple-form-validator";

export default function WidgetItem(props: ModifyWidgetProps & WidgetProps) {
  const [touchedFields, setTouchedFields] = useState({
    newName: false,
    newManufacturer: false,
    newStockLevel: false,
  });
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState<string>(props.name);
  const [newManufacturer, setNewManufacturer] = useState<string>(props.manufacturer);
  const [newStockLevel, setNewStockLevel] = useState<number>(props.stockLevel);

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      newName: { required: true },
      newManufacturer: { required: true },
      newStockLevel: { required: true, customStockLevelRule: true },
    },
    state: { newName, newManufacturer, newStockLevel },
    rules: { ...defaultRules, customStockLevelRule: /^[1-9][0-9]*$/ },
    messages: {
      ...defaultMessages,
      en: { ...defaultMessages['en'], customStockLevelRule: 'Number must be over 0', required: 'Field is required' },
    }
  });

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
  }

  function handleManufacturerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewManufacturer(e.target.value);
  }

  function handlStockLevelChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewStockLevel(Number(e.target.value));
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    props.editWidget(props.id, props.name, props.manufacturer, props.stockLevel);
    setNewName(props.name);
    setNewManufacturer(props.manufacturer);
    setNewStockLevel(props.stockLevel);
    setEditing(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    props.editWidget(props.id, newName || props.name, newManufacturer || props.manufacturer, newStockLevel || props.stockLevel);
    setNewName(newName || props.name);
    setNewManufacturer(newManufacturer || props.manufacturer);
    setNewStockLevel(newStockLevel || props.stockLevel);
    setEditing(false);
    setTouchedFields({ newName: false, newManufacturer: false, newStockLevel: false });
  }

  const onBlurHandler = (_event: React.FormEvent<HTMLElement>, field: string) =>
    setTouchedFields((prevFields) => ({ ...prevFields, [field]: true }));

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="newName">
          Name:
        </label>
        <input
          id="newName"
          className="widget-text"
          type="text"
          value={newName}
          onChange={handleNameChange}
          ref={editFieldRef}
          onBlur={(e) => onBlurHandler(e, 'newName')}
        />
        <p className="error-text">
          {touchedFields.newName && isFieldInError('newName') && getErrorsInField('newName').join('\n')}
        </p>
        <label htmlFor="newManufacturer">
          Manufacturer:
        </label>
        <input
          id="newManufacturer"
          className="widget-text"
          type="text"
          value={newManufacturer}
          onChange={handleManufacturerChange}
          onBlur={(e) => onBlurHandler(e, 'newManufacturer')}
        />
        <p className="error-text">
          {touchedFields.newManufacturer && isFieldInError('newManufacturer') && getErrorsInField('newManufacturer').join('\n')}
        </p>
        <label htmlFor="newStockLevel">
          Stock Level:
        </label>
        <input
          id="newStockLevel"
          className="widget-text"
          type="number"
          value={newStockLevel}
          onChange={handlStockLevelChange}
          onBlur={(e) => onBlurHandler(e, 'newStockLevel')}
        />
        <p className="error-text">
          {touchedFields.newStockLevel && isFieldInError('newStockLevel') && getErrorsInField('newStockLevel').join('\n')}
        </p>
      </div>
      <div className="btn-group">

        <button
          type="button"
          className="btn widget-cancel"
          onClick={handleCancel}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary widget-edit" disabled={!isFormValid}>
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <label>
          Name: {props.name}
        </label>
      </div>
      <div className="c-cb">
        <label>
          Manufacturer: {props.manufacturer}
        </label>
      </div>
      <div className="c-cb">
        <label>
          Stock Level: {props.stockLevel}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteWidget(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (!wasEditing && isEditing) {
      (editFieldRef.current as HTMLInputElement | null)?.focus();
    }
    if (wasEditing && !isEditing) {
      (editButtonRef.current as HTMLButtonElement | null)?.focus();
    }
  }, [wasEditing, isEditing]);


  return <li className="widget">{isEditing ? editingTemplate : viewTemplate}</li>;
}
