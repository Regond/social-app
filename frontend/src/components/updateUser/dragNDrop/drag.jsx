import React, { useState } from 'react';
import './drag.scss';

const DragAndDropFileInput = ({ onFileSelect, label }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e) => {
    onFileSelect(e.target.files[0]);
  };

  return (
    <div
      className={`drag-drop-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById(label).click()}
    >
    <div className="cover">
        <input
        id={label}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        />
        <p>Drag or click</p>
    </div>

    </div>
  );
};

export default DragAndDropFileInput;
