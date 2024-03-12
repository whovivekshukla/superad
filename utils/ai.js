import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";
import { StructuredOutputParser } from "langchain/output_parsers";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        "Sentiment score of the analysis, ranging from -10 (most negative) to 10 (most positive)"
      ),
    sentimentFinding: z
      .string()
      .describe(
        "Summary of the overall sentiment finding from the analysis, highlighting key positive and negative sentiments"
      ),
    keyIssues: z
      .array(z.string())
      .describe(
        "List of key issues or concerns identified in the news articles that may be contributing to negative sentiment"
      ),
    positiveStrategy: z
      .string()
      .describe(
        "Strategies or actions that can be taken to address the identified issues and improve the sentiment"
      ),
    marketCampaign: z
      .string()
      .min(150)
      .describe(
        "High-level marketing campaign strategy to improve the brand image and sentiment, addressing the identified issues and leveraging positive sentiments"
      ),
    advertisement: z
      .string()
      .min(400)
      .describe(
        "Persuasive, attention-grabbing advertisement copy aimed at consumers, highlighting the product's strengths and addressing identified concerns"
      ),
  })
);

const getPrompt = async (content, productName) => {
  const format_instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template: `You are a seasoned marketing expert tasked with analyzing the sentiment of news articles about the product "{productName}" and creating a comprehensive marketing campaign and advertisement to improve the brand image, address concerns, and drive sales.

Given the following news articles:
{entry}

Please perform an in-depth sentiment analysis on the articles and provide the following:

{format_instructions}

When creating the marketing campaign and advertisement, consider the following:

- Identify key issues or concerns raised in the news articles that may be contributing to negative sentiment towards "{productName}", and develop strategies to address those issues.
- Highlight the strengths and positive sentiments associated with "{productName}", and leverage those in the marketing campaign and advertisement.
- The marketing campaign should outline a high-level, cohesive strategy that addresses the identified issues, promotes the strengths of "{productName}", and aims to improve brand image and sentiment.
- The advertisement should be a persuasive, attention-grabbing message aimed at consumers, addressing their concerns and showcasing the benefits of "{productName}" in a compelling way.
- Use language that resonates with the target audience and aligns with the brand's tone and messaging for "{productName}".
- Provide specific, actionable recommendations for executing the marketing campaign and advertisement effectively for "{productName}".`,
    inputVariables: ["entry", "productName"],
    partialVariables: { format_instructions },
  });
  const input = await prompt.format({ entry: content, productName });
  return input;
};

export const createMarketingCampaign = async (content, productName) => {
  const input = await getPrompt(content, productName);
  const model = new ChatAnthropic({
    temperature: 0,
    modelName: "claude-3-sonnet-20240229",
  });
  const output = await model.invoke(input);
  return output;
};
