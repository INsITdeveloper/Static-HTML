import { NextApiRequest, NextApiResponse } from 'next';
import { generateImagesLinks } from 'bimg';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { q } = req.query;
    try {
        if (!q || typeof q !== 'string') {
            throw new Error('Query parameter "q" is missing or invalid.');
        }
        const imageLinks = await generateImagesLinks(q as string);
        res.json(imageLinks);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
