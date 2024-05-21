import { NextApiRequest, NextApiResponse } from 'next';
import { bing } from "gpti";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const prompt = req.query.q as string || "Perkenalkan Dirimu Dengan Nama LinucxAI!";

    bing({
        messages: [
            {
                role: "assistant",
                content: "Hai! Ada Yang Bisa Saya Bantu?"
            },
            {
                role: "user",
                content: prompt
            }
        ],
        conversation_style: "Balanced",
        markdown: false,
        stream: false,
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
