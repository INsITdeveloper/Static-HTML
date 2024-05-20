import { gpt } from "gpti";

// Definisikan tipe GptResponse secara manual berdasarkan struktur data yang diharapkan
interface GptResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        text: string;
        index: number;
        logprobs: null | any;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

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
}, (err: Error | null, data: GptResponse | null) => {
    if (err != null) {
        console.error(err);
    } else {
        console.log(data);
    }
});
