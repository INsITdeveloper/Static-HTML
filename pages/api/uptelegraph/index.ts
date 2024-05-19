import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { uploadFile } from 'telegraph-uploader';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToTelegraph = async (filePath: string) => {
  try {
    const response = await uploadFile(filePath);
    return response;
  } catch (error) {
    console.error('Error uploading to Telegraph:', error);
    throw new Error('Telegraph upload failed');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.uploadDir = './public/uploads';
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const telegraphResponse = await uploadToTelegraph(file.path);
      return res.status(200).json({ url: telegraphResponse.url });
    } catch (uploadError) {
      console.error('Error uploading to Telegraph:', uploadError);
      return res.status(500).json({ error: 'Error uploading to Telegraph' });
    }
  });
}
