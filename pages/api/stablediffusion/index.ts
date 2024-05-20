import { NextApiRequest, NextApiResponse } from 'next';
const { stablediffusion } = require("gpti");

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const prompt = req.query.q as string || "buatkan saya gambar sunset";

    stablediffusion.v2({
        prompt: prompt,
        data: {
            prompt_negative: "",
            guidance_scale: 9
        }
    }, async (err: Error | null, data: any) => {
        if (err) {
            console.error('Error from stablediffusion.v2:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            try {
                console.log('Data received from stablediffusion.v2:', data);

                // Check if data contains the expected image property
                const imageBuffer = data?.imageBuffer; // Adjust according to your API response
                const base64Image = imageBuffer ? imageBuffer.toString('base64') : data?.base64Image;

                if (!base64Image) {
                    console.error('Error: No image data found.');
                    res.status(500).json({ error: 'No image data found' });
                    return;
                }

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
