import { useState } from "react";

const FormField = ({ field, formik }) => {
    const [error, setError] = useState('')

  const isVisible = () => {
    if (field.showIf) {
      const [depField, depValue] = field.showIf.split('=').map(s => s.trim());
      return formik.values[depField] === depValue;
    }
    return true;
  };

  if (!isVisible()) return null;

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const allowedFileTypes = field.allowedFileTypes.map(type => type.trim().toLowerCase());
      const fileExtension = getFileExtension(file.name);
      if (field.maxFileSize && file.size > field.maxFileSize * 1024) {
        // formik.setFieldError(field.name, `File size exceeds ${field.maxFileSize} KB`);
        setError(`File size exceeds ${field.maxFileSize} KB`);
      } else if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(fileExtension)) {
        // formik.setFieldError(field.name, `File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
        setError(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
        formik.setFieldValue(field.name, '');  // Clear the field value
      } else {
        setError('')
        formik.setFieldValue(field.name, file);
      }
    }
  };

  return (
    <div className="form-field">
      <label>{field.label}</label>
      {field.type === 'text' && (
        <>
          <input type="text" {...formik.getFieldProps(field.name)} />
          {formik.errors[field.name] && formik.touched[field.name] && (
            <div className="error">{formik.errors[field.name]}</div>
          )}
        </>
      )}
      {field.type === 'textarea' && (
        <>
          <textarea {...formik.getFieldProps(field.name)} />
          {formik.errors[field.name] && formik.touched[field.name] && (
            <div className="error">{formik.errors[field.name]}</div>
          )}
        </>
      )}
      {field.type === 'dropdown' && (
        <>
          <select {...formik.getFieldProps(field.name)}>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {formik.errors[field.name] && formik.touched[field.name] && (
            <div className="error">{formik.errors[field.name]}</div>
          )}
        </>
      )}
      {field.type === 'checkbox' && (
        <>
          <input type="checkbox" {...formik.getFieldProps(field.name)} />
          {field.label}
          {formik.errors[field.name] && formik.touched[field.name] && (
            <div className="error">{formik.errors[field.name]}</div>
          )}
        </>
      )}
      {field.type === 'radio' && (
        <>
          {field.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                {...formik.getFieldProps(field.name)}
              />
              {option}
            </label>
          ))}
          {formik.errors[field.name] && formik.touched[field.name] && (
            <div className="error">{formik.errors[field.name]}</div>
          )}
        </>
      )}
      {field.type === 'file' && (
        <>
          <input
            type="file"
            name={field.name}
            onChange={handleFileChange}
          />
          {error && (
            <div className="error">{error}</div>
          )}
        </>
      )}
    </div>
  );
};

export default FormField;
