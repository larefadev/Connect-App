import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  pdf
} from '@react-pdf/renderer';
import { ProductQuote } from '@/types/quote';

// Registrar fuentes (opcional, pero mejora la apariencia)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf', fontWeight: 'bold' }
  ]
});

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #e53e3e',
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  quoteInfo: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  quoteNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 5,
  },
  quoteDate: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottom: '1 solid #ddd',
    paddingBottom: 5,
  },
  clientCompanyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clientInfo: {
    flex: 1,
    marginRight: 20,
  },
  companyInfoSection: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  itemsTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: '1 solid #ddd',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: '1 solid #eee',
  },
  col1: { width: '40%' }, // Producto
  col2: { width: '15%', textAlign: 'center' }, // Cantidad
  col3: { width: '20%', textAlign: 'right' }, // Precio Unitario
  col4: { width: '15%', textAlign: 'right' }, // Descuento
  col5: { width: '10%', textAlign: 'right' }, // Subtotal
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  cellText: {
    fontSize: 10,
    color: '#666',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e53e3e',
    borderTop: '1 solid #ddd',
    paddingTop: 5,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesText: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #ddd',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#e53e3e',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 'auto',
  },
});

interface QuotePDFProps {
  quote: ProductQuote;
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'sent': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'expired': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'BORRADOR';
      case 'sent': return 'ENVIADA';
      case 'approved': return 'APROBADA';
      case 'rejected': return 'RECHAZADA';
      case 'expired': return 'EXPIRADA';
      default: return 'BORRADOR';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {quote.company?.name || 'Nombre de la Empresa'}
              </Text>
              <Text style={styles.companyDetails}>
                {quote.company?.address || 'Dirección de la empresa'}
              </Text>
              <Text style={styles.companyDetails}>
                Tel: {quote.company?.phone || 'Teléfono'}
              </Text>
              <Text style={styles.companyDetails}>
                Email: {quote.company?.email || 'email@empresa.com'}
              </Text>
            </View>
            <View style={styles.quoteInfo}>
              <Text style={styles.quoteTitle}>COTIZACIÓN</Text>
              <Text style={styles.quoteNumber}>{quote.quote_number}</Text>
              <Text style={styles.quoteDate}>
                Fecha: {formatDate(quote.quote_date || '')}
              </Text>
              {quote.expiration_date && (
                <Text style={styles.quoteDate}>
                  Válida hasta: {formatDate(quote.expiration_date)}
                </Text>
              )}
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(quote.status) }]}>
                <Text style={styles.headerText}>
                  {getStatusText(quote.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cliente y Empresa */}
        <View style={styles.clientCompanyGrid}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{quote.client?.name || 'N/A'}</Text>
            
            <Text style={styles.infoLabel}>Dirección:</Text>
            <Text style={styles.infoValue}>{quote.client?.address || 'N/A'}</Text>
            
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{quote.client?.mobile_phone || 'N/A'}</Text>
            
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{quote.client?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Tabla de Items */}
        <View style={styles.itemsTable}>
          <Text style={styles.sectionTitle}>DETALLE DE PRODUCTOS</Text>
          
          {/* Header de la tabla */}
          <View style={styles.tableHeader}>
            <View style={styles.col1}>
              <Text style={styles.headerText}>PRODUCTO</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.headerText}>CANT.</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.headerText}>PRECIO UNIT.</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.headerText}>DESCUENTO</Text>
            </View>
            <View style={styles.col5}>
              <Text style={styles.headerText}>SUBTOTAL</Text>
            </View>
          </View>

          {/* Filas de productos */}
          {quote.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={styles.cellText}>
                  {item.product_sku || `Producto ${index + 1}`}
                </Text>
                {item.item_notes && (
                  <Text style={[styles.cellText, { fontSize: 8, color: '#999' }]}>
                    {item.item_notes}
                  </Text>
                )}
              </View>
              <View style={styles.col2}>
                <Text style={styles.cellText}>{item.quantity}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.cellText}>{formatCurrency(item.unit_price)}</Text>
              </View>
              <View style={styles.col4}>
                <Text style={styles.cellText}>
                  {formatCurrency(item.item_discount || 0)}
                </Text>
              </View>
              <View style={styles.col5}>
                <Text style={styles.cellText}>
                  {formatCurrency((item.quantity * item.unit_price) - (item.item_discount || 0))}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (16%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.taxes)}</Text>
          </View>
          {quote.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Descuento:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(quote.discount)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>TOTAL:</Text>
            <Text style={styles.grandTotal}>{formatCurrency(quote.total)}</Text>
          </View>
        </View>

        {/* Notas y Términos */}
        {quote.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>NOTAS</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {quote.terms_conditions && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>TÉRMINOS Y CONDICIONES</Text>
            <Text style={styles.notesText}>{quote.terms_conditions}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Esta cotización es válida por 30 días desde la fecha de emisión.
          </Text>
          <Text style={styles.footerText}>
            Para cualquier consulta, contacte a {quote.company?.name || 'nuestra empresa'}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDF;
