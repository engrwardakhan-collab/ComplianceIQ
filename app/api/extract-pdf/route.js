export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    const rawText = result.text ?? '';
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\x20-\x7E\n\t]/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanText) {
      return Response.json(
        { error: 'No readable text found in this PDF. It may be a scanned image — please use a text-based PDF or paste the text manually.' },
        { status: 422 }
      );
    }

    return Response.json({ text: cleanText });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return Response.json({ error: error.message || 'PDF extraction failed' }, { status: 500 });
  }
}
