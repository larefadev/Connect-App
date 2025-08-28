import { useCallback } from 'react';
import { ProductQuote } from '@/types/quote';

export const useQuotePDF = () => {
  const generateAndDownloadPDF = useCallback(async (quote: ProductQuote) => {
    try {
      // Crear un PDF simple como placeholder
      const pdfContent = `
        Cotización: ${quote.quote_number}
        Cliente: ${quote.client?.name || 'N/A'}
        Total: $${quote.total}
        Fecha: ${quote.quote_date}
      `;
      
      // Crear blob con el contenido
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      
      // Crear URL del blob
      const url = URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cotizacion-${quote.quote_number}.txt`;
      
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
      const pdfContent = `
        Cotización: ${quote.quote_number}
        Cliente: ${quote.client?.name || 'N/A'}
        Total: $${quote.total}
        Fecha: ${quote.quote_date}
      `;
      
      return new Blob([pdfContent], { type: 'text/plain' });
    } catch (error) {
      console.error('Error al generar PDF blob:', error);
      return null;
    }
  }, []);

  const generatePDFBase64 = useCallback(async (quote: ProductQuote): Promise<string | null> => {
    try {
      const blob = await generatePDFBlob(quote);
      if (!blob) return null;
      
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
  }, [generatePDFBlob]);

  const openPDFInNewTab = useCallback(async (quote: ProductQuote) => {
    try {
      const blob = await generatePDFBlob(quote);
      if (!blob) return false;
      
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
  }, [generatePDFBlob]);

  return {
    generateAndDownloadPDF,
    generatePDFBlob,
    generatePDFBase64,
    openPDFInNewTab
  };
};
