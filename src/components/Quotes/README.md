# Sistema de Cotizaciones

Este sistema permite crear, gestionar y generar PDFs de cotizaciones para tu negocio.

## Características

- ✅ **CRUD completo** de cotizaciones
- ✅ **Generación de PDFs** profesionales
- ✅ **Gestión de estados** (borrador, enviada, aprobada, rechazada, expirada)
- ✅ **Búsqueda** de cotizaciones
- ✅ **Vista previa** detallada
- ✅ **Descarga** de PDFs
- ✅ **Integración** con Supabase

## Estructura de Base de Datos

El sistema utiliza las siguientes tablas en Supabase:

### `client_quote_test`
- Información del cliente (nombre, dirección, teléfono, email)

### `company_quote_test`
- Información de la empresa (nombre, dirección, teléfono, email)

### `product_quote_test`
- Cotización principal (número, fechas, estado, totales, notas)

### `quote_items_test`
- Items de la cotización (productos, cantidades, precios, descuentos)

## Componentes

### `QuotationPage`
Página principal que contiene:
- Formulario para crear cotizaciones
- Historial de cotizaciones existentes
- Búsqueda y filtrado

### `QuotePreviewModal`
Modal para visualizar y gestionar cotizaciones:
- Vista detallada de la cotización
- Cambio de estado
- Generación de PDF
- Edición

### `QuotePDF`
Componente para generar PDFs profesionales con:
- Header con información de la empresa
- Detalles del cliente
- Tabla de productos
- Totales y cálculos
- Notas y términos

## Hooks

### `useQuotes`
Hook principal para operaciones CRUD:
- `createQuote()` - Crear nueva cotización
- `updateQuote()` - Actualizar cotización existente
- `deleteQuote()` - Eliminar cotización
- `updateQuoteStatus()` - Cambiar estado
- `searchQuotes()` - Buscar cotizaciones
- `fetchQuotes()` - Obtener todas las cotizaciones

### `useQuotePDF`
Hook para generación de PDFs:
- `generateAndDownloadPDF()` - Generar y descargar PDF
- `generatePDFBlob()` - Generar PDF como blob
- `generatePDFBase64()` - Generar PDF como base64
- `openPDFInNewTab()` - Abrir PDF en nueva pestaña

## Uso

### Crear una Cotización

```tsx
import { useQuotes } from '@/hooks/Quotes';

const { createQuote } = useQuotes();

const handleCreate = async () => {
  const quoteData = {
    client: {
      name: 'Juan Pérez',
      address: 'Calle 123, Ciudad',
      mobile_phone: '123-456-7890',
      email: 'juan@email.com'
    },
    company: {
      name: 'Mi Empresa',
      address: 'Av. Principal 456',
      phone: '098-765-4321',
      email: 'info@miempresa.com'
    },
    items: [
      {
        product_sku: 'PROD-001',
        quantity: 2,
        unit_price: 100.00,
        item_discount: 0,
        item_notes: 'Producto de alta calidad'
      }
    ],
    notes: 'Cotización válida por 30 días',
    terms_conditions: 'Términos estándar de la empresa'
  };

  const newQuote = await createQuote(quoteData);
};
```

### Generar PDF

```tsx
import { useQuotePDF } from '@/hooks/Quotes';

const { generateAndDownloadPDF } = useQuotePDF();

const handleDownload = async (quote) => {
  await generateAndDownloadPDF(quote);
};
```

### Cambiar Estado

```tsx
const { updateQuoteStatus } = useQuotes();

const handleStatusChange = async (quoteId, newStatus) => {
  await updateQuoteStatus(quoteId, newStatus);
};
```

## Estados de Cotización

- **`draft`** - Borrador (editable)
- **`sent`** - Enviada al cliente
- **`approved`** - Aprobada por el cliente
- **`rejected`** - Rechazada por el cliente
- **`expired`** - Expirada

## Personalización

### Estilos del PDF
Los estilos del PDF se pueden personalizar en `QuotePDF.tsx` modificando el objeto `styles`.

### Campos del Formulario
Puedes agregar o quitar campos del formulario modificando el estado `formData` en `QuotationPage.tsx`.

### Validaciones
Las validaciones se pueden personalizar en la función `handleCreateQuote`.

## Dependencias

- `@react-pdf/renderer` - Generación de PDFs
- `lucide-react` - Iconos
- `@/lib/Supabase` - Cliente de Supabase

## Notas Importantes

1. **Autenticación**: El sistema requiere un usuario autenticado en Supabase
2. **Permisos**: Asegúrate de que las políticas RLS estén configuradas correctamente
3. **Fuentes**: El PDF usa fuentes web de Google Fonts para mejor apariencia
4. **Cálculos**: Los totales se calculan automáticamente incluyendo IVA del 16%
5. **Números únicos**: Los números de cotización se generan automáticamente

## Solución de Problemas

### Error al generar PDF
- Verifica que `@react-pdf/renderer` esté instalado correctamente
- Asegúrate de que el navegador soporte Blob y FileReader

### Error de conexión con Supabase
- Verifica las variables de entorno
- Comprueba la configuración del cliente de Supabase
- Revisa las políticas RLS de las tablas

### Problemas de renderizado
- Verifica que todos los campos requeridos estén presentes
- Comprueba que los tipos de datos sean correctos
