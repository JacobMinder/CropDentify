import React, { useState } from "react";
import { pinata } from "./utils/config";
import Header from './components/Header';
import './App.css'; // Import any additional styles if needed

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmission = async () => {
    if (!selectedFile) {
      console.error("No file selected!");
      return;
    }

    try {
      const upload = await pinata.upload.file(selectedFile);
      console.log(upload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header title="CropDentify" /> {/* Use the Header component here */}
      <div style={{ marginTop: '80px', padding: '20px' }}> {/* Add margin to avoid overlap */}
        <label className="form-label">Choose File</label>
        <input type="file" onChange={changeHandler} />
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </>
  );
}

export default App;
