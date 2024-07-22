import React, { useState } from 'react';
import FormBuilder from './components/FormBuilder';
import FormGenerator from './components/FormGenerator';
import './styles.css';

const App = () => {
  const [formConfig, setFormConfig] = useState([]);

  const handleSaveConfig = (config) => {
    setFormConfig(config);
  };

  return (
    <div className="container">
      <h1>Dynamic Form Generator</h1>
      <FormBuilder onSave={handleSaveConfig} />
      {formConfig.length > 0 && <FormGenerator fields={formConfig} />}
    </div>
  );
};

export default App;
