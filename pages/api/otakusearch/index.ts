// pages/api/search.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required and must be a string' });
  }

  const url = `https://otakudesu.cloud/?s=${encodeURIComponent(q)}&post_type=anime`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const searchResults: any[] = [];

    $('li[style="list-style:none;"]').each((i, element) => {
      const title = $(element).find('h2 a').text().trim();
      const link = $(element).find('h2 a').attr('href');
      const imageUrl = $(element).find('img').attr('src');
      const altText = $(element).find('img').attr('alt');
      const genres: string[] = [];
      const status = $(element).find('.set').eq(1).text().replace('Status : ', '').trim();
      const rating = $(element).find('.set').eq(2).text().replace('Rating : ', '').trim();

      $(element).find('.set').eq(0).find('a').each((i, el) => {
        genres.push($(el).text().trim());
      });

      if (title && link && imageUrl) {
        searchResults.push({ title, link, imageUrl, altText, genres, status, rating });
      }
    });

    if (searchResults.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    res.status(200).json({ searchResults });
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
};

export default handler;
