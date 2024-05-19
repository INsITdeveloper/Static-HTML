// pages/api/uptelegraph.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from 'telegraph-uploader';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(process.cwd(), '/public/uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing the files' });
      }

      const file = files.file as File;
      const filePath = file.filepath;

      try {
        const result = await uploadFile(fs.createReadStream(filePath));
        res.status(200).json({ url: result.link });
      } catch (error) {
        res.status(500).json({ error: 'Error uploading file to Telegraph' });
      } finally {
        // Optionally, delete the file after upload to free up space
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      }
    });
  } else if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Media to Telegraph</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .error { color: red; }
          .success { margin-top: 20px; }
          .upload-button { margin-left: 10px; padding: 5px 10px; }
        </style>
      </head>
      <body>
        <h1>Upload Media to Telegraph</h1>
        <input type="file" id="fileInput" />
        <button class="upload-button" onclick="handleUpload()">Upload</button>
        <div id="output"></div>
        <script>
          async function handleUpload() {
            const fileInput = document.getElementById('fileInput');
            const output = document.getElementById('output');
            output.innerHTML = '';

            if (!fileInput.files || fileInput.files.length === 0) {
              output.innerHTML = '<p class="error">No file selected.</p>';
              return;
            }

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await fetch('/api/uptelegraph', {
                method: 'POST',
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                output.innerHTML = \`<p class="success">Upload successful! File URL: <a href="\${data.url}" target="_blank">\${data.url}</a></p>\`;
              } else {
                output.innerHTML = '<p class="error">Error uploading file.</p>';
              }
            } catch (err) {
              output.innerHTML = '<p class="error">Error uploading file.</p>';
            }
          }
        </script>
      </body>
      </html>
    `);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
