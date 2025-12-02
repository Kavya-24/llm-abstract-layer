import { LLMClient } from "./llm/client/LLMClient.js";
import type { CompletionRequest, CompletionResponse } from "./llm/types/completion.js";
import { GeminiModel, LLMProvider, OpenAIModel } from "./llm/types/provider.js";


function geminiBuilderClient(){
    const apiKey = 'test-api-key';
    const llmClient = LLMClient.builder()
                           .setProvider(LLMProvider.GEMINI)
                           .setModel(GeminiModel.GEMINI_2_FLASH_LITE)
                           .setApiKey(apiKey)
                           .build();
    return llmClient;
}

function openaiBuilderClient(){
    const apiKey = 'test-api-key';
    const llmClient = LLMClient.builder()
                           .setProvider(LLMProvider.OPENAI)
                           .setModel(OpenAIModel.GPT_4o_mini)
                           .setApiKey(apiKey)
                           .build();
    return llmClient;
}


const completionRequest : CompletionRequest = {
    messages: [
       { role: "system" as const, content: 'You are an answer-only assistant'},
       { role: "user" as const, content: 'Name a few popular social media sites'}
    ],
    temperature: 0.0,
    maxTokens: 1024
}

try {
    // const completionResponseGemini : CompletionResponse = await geminiBuilderClient().complete(completionRequest);
    // const completionResponseOpenAi : CompletionResponse = await openaiBuilderClient().complete(completionRequest);
} catch (e : any) {

}
