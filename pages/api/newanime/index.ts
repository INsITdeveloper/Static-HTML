import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Fungsi untuk membaca data dari file JSON
const readDataFromFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  }
  return [];
};

// Fungsi untuk menulis data ke file JSON
const writeDataToFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Fungsi untuk mendapatkan data anime terbaru dari web
const fetchAnimeData = async () => {
  const pages = [1, 2, 3, 4];
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
  return results.flat(); // Menggabungkan hasil dari semua halaman
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const filePath = path.join(process.cwd(), 'data', 'animeData.json');
  try {
    const oldData = readDataFromFile(filePath);
    const newData = await fetchAnimeData();

    // Cari anime yang baru ditambahkan
    const newAnime = newData.filter((anime) => !oldData.some((oldAnime) => oldAnime.id === anime.id));

    if (newAnime.length > 0) {
      // Tulis data terbaru ke file
      writeDataToFile(filePath, newData);

      // Buat pesan notifikasi
      const notifications = newAnime.map((anime) => ({
        message: `New Update! - Anime ${anime.title} - Eps ${anime.episode}`,
        description: 'Deskripsi isi Api By NeastooID',
      }));

      res.status(200).json({ status: 200, success: true, notifications });
    } else {
      res.status(200).json({ status: 200, success: true, message: 'No new updates' });
    }
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export default handler;
