import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormField from './FormField';

const FormGenerator = ({ fields }) => {
  const [isFormValid, setIsFormValid] = useState(true);

  const validationSchema = yup.object(
    fields.reduce((schema, field) => {
      let validator = yup.string();
      switch (field.validationType) {
        case 'email':
          validator = validator.email('Invalid email format');
          break;
        case 'phone':
          validator = validator.matches(/^[0-9]{10}$/, 'Invalid phone number');
          break;
        default:
          break;
      }
      if (field.required) {
        validator = validator.required('This field is required');
      }
      if (field.minLength) {
        validator = validator.min(field.minLength, `Minimum length is ${field.minLength}`);
      }
      if (field.maxLength) {
        validator = validator.max(field.maxLength, `Maximum length is ${field.maxLength}`);
      }
      if (field.type === 'file') {
        validator = yup.mixed().test(
          'fileSize',
          `File size exceeds ${field.maxFileSize} KB`,
          value => !value || (field.maxFileSize ? value.size <= field.maxFileSize * 1024 : true)
        ).test(
          'fileType',
          `File type not allowed. Allowed types: ${field.allowedFileTypes.join(', ')}`,
          value => !value || (field.allowedFileTypes.length > 0 ? field.allowedFileTypes.includes(value.name.split('.').pop().toLowerCase()) : true)
        );
      }
      schema[field.name] = validator;
      return schema;
    }, {})
  );

  const formik = useFormik({
    initialValues: fields.reduce((values, field) => {
      values[field.name] = '';
      return values;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
    validate: (values) => {
      const errors = {};
      fields.forEach(field => {
        if (field.type === 'file' && formik.errors[field.name]) {
          setIsFormValid(false);
        } else {
          setIsFormValid(true);
        }
      });
      return errors;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {fields.map((field, index) => (
        <FormField key={index} field={field} formik={formik} setFormValid={setIsFormValid} />
      ))}
      <button type="submit" disabled={!isFormValid}>Submit</button>
    </form>
  );
};

export default FormGenerator;
