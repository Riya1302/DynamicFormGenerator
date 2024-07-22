import React, { useState } from 'react';
import FieldConfigModal from './FieldConfigModal';

const FormBuilder = ({ onSave }) => {
  const [fields, setFields] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleAddField = () => {
    setEditingField(null);
    setModalOpen(true);
  };

  const handleEditField = (index) => {
    setEditingField({ ...fields[index], index });
    setModalOpen(true);
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSaveField = (field, index) => {
    if (index !== undefined) {
      const updatedFields = [...fields];
      updatedFields[index] = field;
      setFields(updatedFields);
    } else {
      setFields([...fields, { ...field, name: field.label }]);
    }
    setModalOpen(false);
  };

  const handleSaveForm = () => {
    onSave(fields);
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(fields, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="buttons">
        <button onClick={handleAddField}>Add Field</button>
        <button onClick={handleSaveForm}>Save Form</button>
        <button onClick={handleDownloadJson}>Download JSON</button>
      </div>
      <div>
        {fields.map((field, index) => (
          <div key={index} className="field-item">
            <span>{field.label}</span>
            <div>
              <button onClick={() => handleEditField(index)}>Edit</button>
              <button onClick={() => handleDeleteField(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <FieldConfigModal
          field={editingField}
          onSave={handleSaveField}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FormBuilder;
