/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useState } from "react";
import { AddWidgetProps } from "../types";
import { defaultMessages, defaultRules, useValidation } from 'react-simple-form-validator';

const Form: React.FC<AddWidgetProps> = (props: AddWidgetProps) => {
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    manufacturer: false,
    stockLevel: false,
  });
  const [name, setWidgetName] = useState<string>("");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [stockLevel, setStockLevel] = useState<number>(0);

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      name: { required: true },
      manufacturer: { required: true },
      stockLevel: { required: true, customStockLevelRule: true },
    },
    state: { name, manufacturer, stockLevel },
    rules: { ...defaultRules, customStockLevelRule: /^[1-9][0-9]*$/ },
    messages: {
      ...defaultMessages,
      en: { ...defaultMessages['en'], customStockLevelRule: 'Number must be over 0', required: 'Field is required' }
    }
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    props.addWidget(name, manufacturer, stockLevel);
    setWidgetName("");
    setManufacturer("");
    setStockLevel(0);
    setTouchedFields({ name: false, manufacturer: false, stockLevel: false });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setWidgetName(e.target.value);
  }

  function handleManufacturerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setManufacturer(e.target.value);
  }

  function handleStockLevelChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStockLevel(Number(e.target.value));
  }

  const onBlurHandler = (_event: React.FormEvent<HTMLElement>, field: string) =>
    setTouchedFields((prevFields) => ({ ...prevFields, [field]: true }));

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label className="label__lg">
          Widget Manager
        </label>
      </h2>
      <label htmlFor="name">
        <p>Name:</p>
      </label>
      <input
        type="text"
        id="name"
        className="input"
        autoComplete="off"
        value={name}
        onChange={handleNameChange}
        onBlur={(e) => onBlurHandler(e, 'name')}
      />
      <p className="error-text">
        {touchedFields.name && isFieldInError('name') && getErrorsInField('name').join('\n')}
      </p>
      <label htmlFor="manufacturer">
        <p>Manufacturer:</p>
      </label>
      <input
        type="text"
        id="manufacturer"
        className="input"
        autoComplete="off"
        value={manufacturer}
        onChange={handleManufacturerChange}
        onBlur={(e) => onBlurHandler(e, 'manufacturer')}
      />
      <p className="error-text">
        {touchedFields.manufacturer && isFieldInError('manufacturer') && getErrorsInField('manufacturer').join('\n')}
      </p>
      <label htmlFor="stockLevel">
        <p>Stock Level:</p>
      </label>
      <input
        type="number"
        id="stockLevel"
        className="input mb-3"
        autoComplete="off"
        value={stockLevel}
        onChange={handleStockLevelChange}
        onBlur={(e) => onBlurHandler(e, 'stockLevel')}
      />
      <p className="error-text">
        {touchedFields.stockLevel && isFieldInError('stockLevel') && getErrorsInField('stockLevel').join('\n')}
      </p>
      <button type="submit" className="btn btn__primary btn__lg" disabled={!isFormValid}>
        Add
      </button>
    </form>
  );
};

export default Form;
