import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import React, { useState } from 'react';

const Index = () => {
    const [previewImage, setPreviewImage] = useState<string>('');
    const [outputJson, setOutputJson] = useState<string>('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/uptelegraph/index.tsx', formData);
            const data = response.data;

            // Set preview image
            setPreviewImage(data.imageUrl);

            // Set output JSON
            setOutputJson(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error uploading image:', error);
            setOutputJson('Error: ' + error.message);
        }
    };

    return (
        <div>
            <form encType="multipart/form-data">
                <input type="file" name="file" accept="image/*" onChange={handleUpload} />
            </form>
            {previewImage && <img src={previewImage} alt="Preview Image" />}
            <pre>{outputJson}</pre>
        </div>
    );
};

export default Index;
