import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  description?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const apiUrl = `https://www.api.vyturex.com/describe?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.description) {
      return res.status(200).json({ description: response.data.description });
    } else {
      return res.status(500).json({ error: 'Failed to fetch description' });
    }
  } catch (error) {
    console.error('Error fetching description:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
