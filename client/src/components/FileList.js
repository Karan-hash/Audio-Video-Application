import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    };

    fetchFiles();
  }, []);

  return (
    <ol className="file-list">
      {files.map((file) => (
        <li key={file._id} className="file-item">
          <div>
            <h3>Title: {file.title}</h3>
            <p>Description: {file.description}</p>
          </div>
          <div>
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default FileList;
