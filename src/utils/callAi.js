import OpenAI from "openai";

const token = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const endpoint = process.env.NEXT_PUBLIC_OPENAI_ENDPOINT;
const modelName = process.env.NEXT_PUBLIC_OPENAI_MODENAME;

export const callAi = async (prompt) => {

    const client = new OpenAI({ baseURL: endpoint, apiKey: token, dangerouslyAllowBrowser: true });

    try {
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        if (response.choices?.length > 0) {
            const aiMessage = response.choices[0].message.content.trim();
            return aiMessage;
        } else {
            return "Failed to get response";
        }

    } catch (error) {
        return "Failed to get response";
    }
};
