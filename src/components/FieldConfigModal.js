import React, { useState, useEffect } from 'react';

const FieldConfigModal = ({ field, onSave, onClose }) => {
  const [label, setLabel] = useState(field ? field.label : '');
  const [type, setType] = useState(field ? field.type : 'text');
  const [options, setOptions] = useState(field ? field.options : []);
  const [required, setRequired] = useState(field ? field.required : false);
  const [minLength, setMinLength] = useState(field ? field.minLength : '');
  const [maxLength, setMaxLength] = useState(field ? field.maxLength : '');
  const [validationType, setValidationType] = useState(field ? field.validationType : 'none');
  const [showIf, setShowIf] = useState(field ? field.showIf : '');
  const [maxFileSize, setMaxFileSize] = useState(field ? field.maxFileSize : '');
  const [allowedFileTypes, setAllowedFileTypes] = useState(field ? field.allowedFileTypes.join(', ') : '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (field) {
      setLabel(field.label);
      setType(field.type);
      setOptions(field.options || []);
      setRequired(field.required || false);
      setMinLength(field.minLength || '');
      setMaxLength(field.maxLength || '');
      setValidationType(field.validationType || 'none');
      setShowIf(field.showIf || '');
      setMaxFileSize(field.maxFileSize || '');
      setAllowedFileTypes(field.allowedFileTypes ? field.allowedFileTypes.join(', ') : '');
    }
  }, [field]);

  const validate = () => {
    const newErrors = {};
    if (!label.trim()) newErrors.label = 'Label is required';
    if (type === 'dropdown' || type === 'radio') {
      if (options.length === 0) newErrors.options = 'Options are required';
    }
    if (type === 'file') {
      if (!maxFileSize) newErrors.maxFileSize = 'Max file size is required';
      if (!allowedFileTypes.trim()) newErrors.allowedFileTypes = 'Allowed file types are required';
    }
    if (minLength && maxLength && parseInt(minLength, 10) > parseInt(maxLength, 10)) {
      newErrors.length = 'Max length must be greater than min length';
    }
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newField = {
      label,
      type,
      options: options.map(option => option.trim()),
      required,
      minLength: minLength ? parseInt(minLength, 10) : undefined,
      maxLength: maxLength ? parseInt(maxLength, 10) : undefined,
      validationType,
      showIf,
      maxFileSize: maxFileSize ? parseInt(maxFileSize, 10) : undefined,
      allowedFileTypes: allowedFileTypes ? allowedFileTypes.split(',').map(type => type.trim()) : [],
    };
    console.log('Saving field:', newField);
    onSave(newField, field ? field.index : undefined);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <label>
          Label:
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
          {errors.label && <div className="error">{errors.label}</div>}
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="file">File Upload</option>
          </select>
        </label>
        {(type === 'dropdown' || type === 'radio') && (
          <div>
            <label>
              Options (comma-separated):
              <input
                value={options.join(',')}
                onChange={(e) => setOptions(e.target.value.split(','))}
              />
              {errors.options && <div className="error">{errors.options}</div>}
            </label>
          </div>
        )}
        <label>
          Required:
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
        </label>
        {type !== 'file' && (
          <>
            <label>
              Min Length:
              <input value={minLength} onChange={(e) => setMinLength(e.target.value)} />
              {errors.length && <div className="error">{errors.length}</div>}
            </label>
            <label>
              Max Length:
              <input value={maxLength} onChange={(e) => setMaxLength(e.target.value)} />
              {errors.length && <div className="error">{errors.length}</div>}
            </label>
          </>
        )}
        {type === 'file' && (
          <>
            <label>
              Max File Size (KB):
              <input value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)} />
              {errors.maxFileSize && <div className="error">{errors.maxFileSize}</div>}
            </label>
            <label>
              Allowed File Types (comma-separated):
              <input value={allowedFileTypes} onChange={(e) => setAllowedFileTypes(e.target.value)} />
              {errors.allowedFileTypes && <div className="error">{errors.allowedFileTypes}</div>}
            </label>
          </>
        )}
        <label>
          Validation Type:
          <select value={validationType} onChange={(e) => setValidationType(e.target.value)}>
            <option value="none">None</option>
            <option value="email">Email</option>
            <option value="phone">Phone Number</option>
          </select>
        </label>
        <label>
          Show If (fieldName=value):
          <input value={showIf} onChange={(e) => setShowIf(e.target.value)} />
        </label>
        <div className="buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FieldConfigModal;
