import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, documentText, extractedData, messages } = await request.json();

    if (!message || !documentText) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for real estate contracts. Answer questions based on this contract information:

Document text: ${documentText.substring(0, 2000)}

Extracted fields: ${JSON.stringify(extractedData)}

IMPORTANT RULES:
1. Answer questions based ONLY on the contract above
2. If asked "where is this info in the document?", tell the location if available
3. If asked "is the document signed?", check the text for signature indicators
4. For information NOT in the contract, say: "This information is not present in the contract"
5. Keep answers short and direct (1-2 sentences)
6. Be helpful but don't speculate`,
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const assistantMessage = response.choices[0].message.content;

    return Response.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: error.message || 'Chat failed' },
      { status: 500 }
    );
  }
}
