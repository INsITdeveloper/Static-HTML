import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

type Data = {
  bodyContent?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Remove all script tags from the body content
    $('script').remove();

    // Extract and clean the body content
    const bodyContent = $('body').text().trim();

    if (bodyContent) {
      return res.status(200).json({ bodyContent });
    } else {
      return res.status(500).json({ error: 'Failed to fetch body content' });
    }
  } catch (error) {
    console.error('Error fetching body content:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
