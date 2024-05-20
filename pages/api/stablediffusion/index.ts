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
    }, async (err: Error | null, data: any) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            try {
                // Assuming data contains the image buffer
                const imageBuffer = data.imageBuffer; // Adjust according to your API response
                const base64Image = imageBuffer.toString('base64');

                const responseData = {
                    code: 200,
                    status: true,
                    prompt: prompt,
                    model: "StableDiffusion-2.1",
                    data: {
                        prompt_negative: "",
                        guidance_scale: 9
                    },
                    images: [
                        `data:image/jpeg;base64,${base64Image}`
                    ]
                };

                res.status(200).json(responseData);
            } catch (imageError) {
                console.error('Error encoding image:', imageError);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
};

export default handler;
