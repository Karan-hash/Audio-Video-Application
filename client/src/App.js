// src/App.js
import React from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const App = () => {
  return (
    <div className="App">
      <h1>Video and Audio Upload</h1>
      <FileUpload />
      <FileList />
    </div>
  );
};

export default App;
