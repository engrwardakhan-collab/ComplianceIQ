'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Send, AlertCircle, CheckCircle2, Loader2, FileText, Sparkles, MessageSquare } from 'lucide-react';
import styles from './page.module.css';

async function extractTextFromPDF(file) {
  const formData = new FormData();
  formData.append('file', file);

  let response;
  try {
    response = await fetch('/api/extract-pdf', { method: 'POST', body: formData });
  } catch {
    throw new Error('Could not reach the PDF extraction service. Check your connection.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('PDF extraction service returned an unexpected response. Try uploading a .txt file instead.');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'PDF extraction failed');
  if (!data.text?.trim()) throw new Error('No readable text found in this PDF. It may be scanned — try a text-based PDF or .txt file.');
  return data.text;
}

export default function Home() {
  const [documentText, setDocumentText] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [highlightedField, setHighlightedField] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const messagesEndRef = useRef(null);
  const documentRef = useRef(null);
  const pdfUrlRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);
    setMessages([]);
    setExtractedData([]);
    setSummary('');
    setHighlightedField(null);
    setSelectedItem(null);

    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }
    setPdfUrl(null);
    setIsPdf(false);

    try {
      let text = '';

      if (file.type === 'text/plain') {
        text = await file.text();
        setIsPdf(false);
      } else if (file.type === 'application/pdf') {
        const blobUrl = URL.createObjectURL(file);
        pdfUrlRef.current = blobUrl;
        setPdfUrl(blobUrl);
        setIsPdf(true);
        text = await extractTextFromPDF(file);
        if (!text.trim()) throw new Error('Could not extract text from PDF. The file may be scanned or image-based.');
      } else {
        throw new Error('Unsupported file type. Please upload a .txt or .pdf file.');
      }

      setDocumentText(text);
      await analyzeDocument(text);
    } catch (err) {
      setError(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeDocument = async (text) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setExtractedData(data.extracted_data || []);
      setSummary(data.summary || '');
      setMessages([{ role: 'assistant', content: `I've analyzed your contract and found ${data.extracted_data?.length || 0} key fields. What would you like to know?` }]);
    } catch (err) {
      setError(`Analysis error: ${err.message}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;
    const userMessage = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, documentText, extractedData, messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Chat failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setError(`Chat error: ${err.message}`);
    } finally {
      setChatLoading(false);
    }
  };

  const handleHighlightField = (item) => {
    setSelectedItem(item);
    if (!isPdf) {
      const valueStr = typeof item.value === 'string' ? item.value : item.field;
      setHighlightedField(valueStr || item.field);
      setTimeout(() => {
        const el = documentRef.current?.querySelector(`.${styles.highlighted}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const unfilledCount = extractedData.filter(d => d.value === 'Not filled').length;

  return (
    <div className={styles.root}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <div className={styles.headerIcon}><FileText size={18} /></div>
          <span className={styles.headerTitle}>ContractIQ</span>
        </div>
        <div className={styles.headerRight}>
          {extractedData.length > 0 && unfilledCount > 0 && (
            <div className={styles.warningPill}>
              <AlertCircle size={13} /> {unfilledCount} unfilled {unfilledCount === 1 ? 'field' : 'fields'}
            </div>
          )}
          <div className={styles.connectedPill}>
            <CheckCircle2 size={13} /> AI Connected
          </div>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          {!documentText && !pdfUrl ? (
            <label htmlFor="file-upload" className={styles.uploadArea}>
              <div className={styles.uploadIconWrap}>
                <Upload size={28} />
              </div>
              <h3 className={styles.uploadTitle}>Drop your contract here</h3>
              <p className={styles.uploadSub}>Supports PDF and TXT files</p>
              <div className={styles.uploadCta}>Choose File</div>
              <input id="file-upload" type="file" accept=".txt,.pdf" onChange={handleFileUpload} className={styles.fileInput} />
            </label>
          ) : (
            <div className={styles.documentPreview}>
              <div className={styles.docToolbar}>
                <label htmlFor="file-upload" className={styles.uploadButton}>
                  <Upload size={15} /> New Document
                  <input id="file-upload" type="file" accept=".txt,.pdf" onChange={handleFileUpload} className={styles.fileInput} />
                </label>
                {loading && (
                  <div className={styles.analyzingPill}>
                    <Loader2 size={13} className={styles.spinner} /> Analyzing…
                  </div>
                )}
              </div>
              {isPdf && pdfUrl ? (
                <iframe src={pdfUrl} className={styles.pdfViewer} title="PDF Contract" />
              ) : (
                <div ref={documentRef} className={styles.documentContent}>
                  {documentText.split('\n').map((line, idx) => {
                    const highlighted = highlightedField && line.toLowerCase().includes(highlightedField.toLowerCase());
                    return (
                      <div key={idx} className={`${styles.docLine} ${highlighted ? styles.highlighted : ''}`}>
                        {line || '\u00A0'}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {!documentText && !pdfUrl && !loading && (
            <div className={styles.emptyState}>
              <Sparkles size={36} className={styles.emptyIcon} />
              <h3>AI Contract Analyzer</h3>
              <p>Upload a contract on the left to extract key fields, detect missing signatures, and ask questions about the document.</p>
            </div>
          )}

          {loading && !summary && (
            <div className={styles.loadingState}>
              <Loader2 size={28} className={styles.spinner} />
              <p>Reading and analyzing your contract…</p>
            </div>
          )}

          {summary && (
            <div className={styles.summaryCard}>
              <div className={styles.sectionLabel}><Sparkles size={13} /> Summary</div>
              <p className={styles.summaryText}>{summary}</p>
            </div>
          )}

          {extractedData.length > 0 && (
            <div className={styles.extractedSection}>
              <div className={styles.sectionLabelRow}>
                <div className={styles.sectionLabel}><FileText size={13} /> Key Fields</div>
                <span className={styles.fieldCount}>{extractedData.length} fields · {unfilledCount} missing</span>
              </div>
              {!isPdf && <p className={styles.clickHint}>Click a row to highlight in document</p>}

              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Field</div>
                  <div className={styles.tableCell}>Value</div>
                </div>
                {extractedData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${styles.tableRow}
                      ${selectedItem?.field === item.field ? styles.activeRow : ''}
                      ${item.value === 'Not filled' ? styles.unfilledRow : ''}`}
                    onClick={() => handleHighlightField(item)}
                  >
                    <div className={`${styles.tableCell} ${styles.fieldCell}`}>{item.field}</div>
                    <div className={styles.tableCell}>
                      {item.value === 'Not filled'
                        ? <span className={styles.unfilledBadge}>Not filled</span>
                        : typeof item.value === 'object' && item.value !== null
                          ? Object.entries(item.value).map(([k, v]) => `${k}: ${v}`).join(', ')
                          : item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {extractedData.length > 0 && (
            <div className={styles.chatSection}>
              <div className={styles.sectionLabel}><MessageSquare size={13} /> Ask About This Contract</div>
              <div className={styles.messagesContainer}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className={`${styles.message} ${styles.assistant}`}>
                    <Loader2 size={13} className={styles.spinner} /> Thinking…
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="e.g. Are all signatures complete?"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={chatLoading}
                  className={styles.messageInput}
                />
                <button onClick={handleSendMessage} disabled={chatLoading || !inputMessage.trim()} className={styles.sendButton}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
