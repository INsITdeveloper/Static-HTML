import { NextApiRequest, NextApiResponse } from 'next';
import { dalle } from "gpti";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const prompt = req.query.q as string || "anime";

    dalle.v1({
        prompt: prompt
    }, (err: Error | null, data: any) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(data);
        }
    });
};

export default handler;
