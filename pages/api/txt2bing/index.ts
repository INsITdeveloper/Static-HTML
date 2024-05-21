import { NextApiRequest, NextApiResponse } from 'next';
import { BingImageClient } from 'bing-images';

const client = new BingImageClient({
    token: process.env.cookie,
    notify: false
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;
    try {
        const result = await client.getImages(query as string);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
