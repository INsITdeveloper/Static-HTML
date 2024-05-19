import { useState } from 'react';
import axios from 'axios';

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [jsonOutput, setJsonOutput] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/uptelegraph/index', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      setJsonOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error uploading file:', error);
      setJsonOutput('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Upload to Telegraph</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>

      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px', maxHeight: '300px' }} />}

      <pre>{jsonOutput}</pre>
    </div>
  );
};

export default UploadForm;
