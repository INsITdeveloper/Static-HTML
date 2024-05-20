import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import cheerio from 'cheerio';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pages = [1, 2, 3, 4];
  try {
    const requests = pages.map(async (page) => {
      const response = await axios.get(`https://otakudesu.cloud/ongoing-anime/page/${page}`);

      if (response.status !== 200) throw new Error(`Error ${response.status}`);

      const $ = cheerio.load(response.data);
      const $parentElement = $('#venkonten > div > div.venser > div.venutama > div.rseries > div > div.venz > ul > li');

      const list = $parentElement
        .map((i, el) => {
          const title = $(el).find('div > div.thumb > a > div > h2').text();
          const thumbnail = $(el).find('div > div.thumb > a > div > img').attr('src');
          const episode = $(el).find('div > div.epz').text();
          const temp = $(el).find('div > div.thumb > a').attr('href')?.split('/');

          return {
            id: temp?.[temp.length - 2],
            title,
            thumbnail,
            episode,
          };
        })
        .get();

      return list;
    });

    const results = await Promise.all(requests);
    const mergedList = results.flat(); // Menggabungkan hasil dari semua halaman

    res.status(200).json({ status: 200, success: true, data: mergedList });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export default handler;
