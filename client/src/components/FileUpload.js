import React, { useState } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';

const FileUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setMessage(''); // Reset message

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setProgress(Math.round((loaded * 100) / total));
        },
      });

      console.log(res.data);
      setProgress(0); // Reset progress after completion
      setMessage('File uploaded and compressed successfully');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during the upload.');
      }
      setProgress(0); // Reset progress on error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Upload</button>
      {progress > 0 && <ProgressBar progress={progress} />}
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default FileUpload;
