import { NextApiRequest, NextApiResponse } from 'next';
const { gpt } = require("gpti");

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    gpt.v1({
        messages: [
            {
                role: "assistant",
                content: "Hello! How are you today?"
            },
            {
                role: "user",
                content: "Hello, my name is Yandri."
            },
            {
                role: "assistant",
                content: "Hello, Yandri! How are you today?"
            }
        ],
        prompt: "Can you repeat my name?",
        model: "GPT-4",
        markdown: false
    }, (err: Error | null, data: any) => { // Menggunakan tipe `any` untuk data
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(data);
        }
    });
};

export default handler;
