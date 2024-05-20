import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID query parameter is required and must be a string' });
  }

  const url = `https://otakudesu.cloud/batch/${encodeURIComponent(id)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Check if the page contains expected data
    if (!$('.batchlink').length) {
      return res.status(404).json({ error: 'Not Found' });
    }

    const batchLinks: any[] = [];

    $('.batchlink').each((i, element) => {
      const title = $(element).find('h4').text().trim();
      const links: { quality: string; links: { service: string; url: string }[] }[] = [];

      $(element).find('ul > li').each((j, liElement) => {
        const quality = $(liElement).find('strong').text().trim();
        const serviceLinks: { service: string; url: string }[] = [];

        $(liElement).find('a').each((k, aElement) => {
          const service = $(aElement).text().trim();
          const url = $(aElement).attr('href');
          if (url) {
            serviceLinks.push({ service, url });
          }
        });

        links.push({ quality, links: serviceLinks });
      });

      batchLinks.push({ title, links });
    });

    res.status(200).json({ batchLinks });
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
};

export default handler;
