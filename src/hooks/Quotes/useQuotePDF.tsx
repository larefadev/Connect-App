import React, { useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ProductQuote } from '@/types/quote';
import PDFWrapper from '@/components/Quotes/PDFWrapper';

export const useQuotePDF = () => {
  const generateAndDownloadPDF = useCallback(async (quote: ProductQuote) => {
    try {
      // Generar el PDF usando React.createElement
      const pdfDoc = pdf(React.createElement(PDFWrapper, { quote }));
      
      // Convertir a blob
      const blob = await pdfDoc.toBlob();
      
      // Crear URL del blob
      const url = URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cotizacion-${quote.quote_number}.pdf`;
      
      // Simular clic para descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      return false;
    }
  }, []);

  const generatePDFBlob = useCallback(async (quote: ProductQuote): Promise<Blob | null> => {
    try {
      const pdfDoc = pdf(React.createElement(PDFWrapper, { quote }));
      const blob = await pdfDoc.toBlob();
      return blob;
    } catch (error) {
      console.error('Error al generar PDF blob:', error);
      return null;
    }
  }, []);

  const generatePDFBase64 = useCallback(async (quote: ProductQuote): Promise<string | null> => {
    try {
      const pdfDoc = pdf(React.createElement(PDFWrapper, { quote }));
      const blob = await pdfDoc.toBlob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al generar PDF base64:', error);
      return null;
    }
  }, []);

  const openPDFInNewTab = useCallback(async (quote: ProductQuote) => {
    try {
      const pdfDoc = pdf(React.createElement(PDFWrapper, { quote }));
      const blob = await pdfDoc.toBlob();
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva pestaña
      window.open(url, '_blank');
      
      // Limpiar después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error al abrir PDF:', error);
      return false;
    }
  }, []);

  return {
    generateAndDownloadPDF,
    generatePDFBlob,
    generatePDFBase64,
    openPDFInNewTab
  };
};
