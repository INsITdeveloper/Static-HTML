import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import React, { useState } from 'react';

const Index = () => {
    const [previewImage, setPreviewImage] = useState<string>('');
    const [outputJson, setOutputJson] = useState<string>('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Cek apakah ada file yang dipilih
        if (!e.target.files || e.target.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Kirim media ke telegra.ph
            const telegraphResponse = await axios.post('https://telegra.ph/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Dapatkan URL gambar dan ukuran media dari respons telegra.ph
            const imageUrl = telegraphResponse.data[0].src;
            const imageSize = telegraphResponse.data[0].size;

            // Hitung waktu expired (misalnya, 1 minggu dari sekarang)
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7); // Expired dalam 7 hari

            // Persiapkan respons JSON
            const responseData = {
                imageUrl: imageUrl,
                imageSize: imageSize,
                expireDate: expireDate.toISOString() // Konversi tanggal ke format ISO
            };

            // Set preview image
            setPreviewImage(imageUrl);

            // Set output JSON
            setOutputJson(JSON.stringify(responseData, null, 2));
        } catch (error) {
            console.error('Error uploading image to telegra.ph:', error);
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
