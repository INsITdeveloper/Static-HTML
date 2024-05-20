import { NextApiRequest, NextApiResponse } from 'next';
import { stablediffusion } from 'gpti';
import { useEffect, useState } from 'react';

const StablediffusionPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const prompt = "buatkan saya gambar sunset";
                const data = await generateImage(prompt);
                const preparedData = await prepareResponse(data, prompt);
                setResponseData(preparedData);
            } catch (error) {
                setError(error);
            }
        };

        fetchImage();
    }, []);

    const generateImage = (prompt: string) => {
        return new Promise((resolve, reject) => {
            stablediffusion.v2({
                prompt: prompt,
                data: {
                    prompt_negative: "",
                    guidance_scale: 9
                }
            }, (err: Error | null, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    const prepareResponse = async (data: any, prompt: string) => {
        try {
            const base64Image = data?.imageBuffer?.toString('base64') || data?.base64Image;

            if (!base64Image) {
                throw new Error('No image data found.');
            }

            const imageData = `data:image/jpeg;base64,${base64Image}`;

            const responseData = {
                code: 200,
                status: true,
                prompt: prompt,
                model: "StableDiffusion-2.1",
                data: {
                    prompt_negative: "",
                    guidance_scale: 9
                },
                images: [imageData]
            };

            return responseData;
        } catch (error) {
            throw error;
        }
    };

    return (
        <div>
            <h1>Stable Diffusion Image Generation</h1>
            {responseData ? (
                <div>
                    <h2>Generated Image:</h2>
                    <img src={responseData.images[0]} alt="Generated Image" />
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default StablediffusionPage;
