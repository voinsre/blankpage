import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

export const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Load the full system prompt from PROMPT_v2.md at module initialization.
// Extracts content between the ``` code fences in the markdown file.
function loadSystemPrompt(): string {
    try {
        const promptPath = path.join(process.cwd(), "PROMPT_v2.md");
        const fileContent = fs.readFileSync(promptPath, "utf-8");

        // Extract content between the first pair of ``` code fences
        const match = fileContent.match(/```\n([\s\S]*?)```/);
        if (match && match[1]) {
            return match[1].trim();
        }

        throw new Error("Could not find system prompt content in PROMPT_v2.md");
    } catch (error) {
        console.error("Failed to load PROMPT_v2.md:", error);
        // Minimal fallback prompt
        return `You are The Page. You are a blank page that asks questions.
You exist to help people think — not by giving them answers, but by asking the question they're avoiding.
NEVER generate content for the user. NEVER give advice. NEVER ask more than one question per response.
NEVER be longer than 2 sentences. You are calm. Still. Like a blank page.`;
    }
}

export const SYSTEM_PROMPT = loadSystemPrompt();
