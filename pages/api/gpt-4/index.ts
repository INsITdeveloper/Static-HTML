import { gpt, GptResponse } from "gpti";

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
