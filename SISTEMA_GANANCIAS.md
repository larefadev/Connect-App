# Sistema de Ganancias para Productos

## Descripción General

Se ha implementado un sistema completo de gestión de ganancias para productos en el catálogo. Este sistema permite a los usuarios definir un porcentaje de ganancia para cada producto, calculando automáticamente el precio final de venta.

## Características Implementadas

### 1. Campo de Ganancia
- **Nuevo campo**: `Ganancia` en la interfaz `Product`
- **Tipo**: Número (porcentaje)
- **Ejemplo**: 25 = 25% de ganancia

### 2. Formulario de Configuración de Ganancia
- **Precio del Producto**: Campo de solo lectura que muestra el precio actual en la base de datos
- **Ganancia (%)**: **ÚNICO campo editable** para definir el porcentaje de ganancia
- **Precio con Ganancia**: Se calcula automáticamente (Precio Actual + Ganancia%)
- **Validación**: No se permiten ganancias negativas
- **Importante**: Solo se modifica el campo Ganancia, todos los demás datos del producto son de solo lectura

### 3. Visualización en Tarjetas de Productos
- **Badge de ganancia**: Muestra el porcentaje de ganancia en la esquina superior derecha
- **Información detallada**: Muestra precio base, ganancia y precio final
- **Indicadores visuales**: Colores diferenciados para ganancia (azul) y stock (verde)

### 4. Filtros por Ganancia
- **Rango de ganancia**: Filtros mínimo y máximo para porcentajes de ganancia
- **Integración**: Se integra con el sistema de filtros existente

### 5. Estadísticas del Catálogo
- **Total de productos**: Contador general
- **Productos con ganancia**: Cuenta productos que tienen ganancia definida
- **Ganancia promedio**: Calcula el promedio de ganancias del catálogo

## Fórmulas de Cálculo

### Precio con Ganancia Aplicada
```
Precio con Ganancia = Precio del Producto × (1 + Ganancia / 100)
```

### Ejemplo
- Precio del producto: $100.00
- Ganancia: 25%
- Precio con ganancia: $100.00 × (1 + 25/100) = $125.00

## Flujo de Trabajo

1. **Configurar Ganancia**: El usuario hace clic en el botón de editar (configurar ganancia)
2. **Ver Información del Producto**: Se muestran todos los datos del producto en modo solo lectura
3. **Establecer Ganancia**: Define el porcentaje de ganancia deseado (único campo editable)
4. **Ver Precio con Ganancia**: El sistema calcula y muestra automáticamente el precio con ganancia aplicada
5. **Guardar Ganancia**: Solo se actualiza el campo Ganancia en la base de datos, todos los demás datos permanecen inalterados

## Beneficios del Sistema

- **Transparencia**: Los usuarios pueden ver claramente el margen de ganancia
- **Flexibilidad**: Cada producto puede tener su propio porcentaje de ganancia
- **Automatización**: Los cálculos se realizan automáticamente
- **Control**: Permite gestionar la rentabilidad por producto
- **Análisis**: Proporciona estadísticas sobre la estructura de ganancias

## Consideraciones Técnicas

- **Base de datos**: El campo `Ganancia` se almacena como número decimal
- **Precio del producto**: **NO se modifica** en la base de datos, solo se actualiza el campo Ganancia
- **Validación**: Se valida que la ganancia no sea negativa
- **Interfaz**: Se mantiene la consistencia visual con el diseño existente
- **Performance**: Los cálculos se realizan en tiempo real sin afectar la velocidad
- **Integridad**: El precio original del producto se preserva para auditoría y trazabilidad

## Próximas Mejoras

- **Ganancia por defecto**: Aplicar automáticamente ganancia estándar a productos nuevos
- **Historial de cambios**: Registrar cambios en ganancias a lo largo del tiempo
- **Reportes**: Generar reportes de rentabilidad por categoría o marca
- **Importación masiva**: Permitir actualizar ganancias de múltiples productos
- **Plantillas de ganancia**: Crear plantillas predefinidas para diferentes tipos de productos

## Uso Recomendado

1. **Establecer ganancias base**: Definir porcentajes estándar por categoría
2. **Revisar regularmente**: Ajustar ganancias según cambios en costos o mercado
3. **Analizar rentabilidad**: Usar las estadísticas para optimizar la estructura de precios
4. **Mantener consistencia**: Aplicar lógica similar a productos de la misma categoría
