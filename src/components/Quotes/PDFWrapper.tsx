import React from 'react';
import { ProductQuote } from '@/types/quote';
import QuotePDF from './QuotePDF';

interface PDFWrapperProps {
  quote: ProductQuote;
}

const PDFWrapper: React.FC<PDFWrapperProps> = ({ quote }) => {
  return <QuotePDF quote={quote} />;
};

export default PDFWrapper;
