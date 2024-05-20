import { NextApiRequest, NextApiResponse } from 'next';
const { stablediffusion } = require("gpti");

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const prompt = req.query.q as string || "buatkan saya gambar anime";

    stablediffusion.v2({
        prompt: prompt,
        data: {
            prompt_negative: "",
            guidance_scale: 9
        }
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
