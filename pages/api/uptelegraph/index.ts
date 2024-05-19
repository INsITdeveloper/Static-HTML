import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fileBuffer = req.body; // Assuming file data is in buffer format
    const telegraphResponse = await uploadToTelegraph(fileBuffer);

    res.status(200).json({ url: telegraphResponse.result.url });
  } catch (error) {
    console.error('Error uploading to Telegraph:', error);
    res.status(500).json({ error: 'Error uploading to Telegraph' });
  }
}

async function uploadToTelegraph(fileBuffer: Buffer) {
  const formData = new FormData();
  
  // Convert Buffer to Blob
  const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });

  // Append Blob to FormData
  formData.append('file', blob, 'uploaded_file');

  const response = await axios.post('https://telegra.ph/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
