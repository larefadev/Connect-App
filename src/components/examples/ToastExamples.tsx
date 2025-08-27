"use client";

import { Button } from '@/components/ui/button';
import { useToastContext } from '@/components/providers/ToastProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ToastExamples = () => {
  const { 
    success, 
    error, 
    info, 
    warning, 
    addToCart, 
    orderCreated, 
    networkError,
    removeAllToasts 
  } = useToastContext();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Ejemplos de Toast Notifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toast Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => success('¡Operación completada exitosamente!')}
              className="w-full"
            >
              Success Toast
            </Button>
            
            <Button 
              onClick={() => error('Algo salió mal, por favor intenta de nuevo')}
              variant="destructive"
              className="w-full"
            >
              Error Toast
            </Button>
            
            <Button 
              onClick={() => info('Esta es una notificación informativa')}
              variant="outline"
              className="w-full"
            >
              Info Toast
            </Button>
            
            <Button 
              onClick={() => warning('Ten cuidado con esta acción')}
              variant="outline"
              className="w-full"
            >
              Warning Toast
            </Button>
          </CardContent>
        </Card>

        {/* Toast Especializados */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Especializados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => addToCart('Filtro de Aceite')}
              className="w-full"
            >
              Producto Agregado al Carrito
            </Button>
            
            <Button 
              onClick={() => addToCart('Bujías NGK', 3)}
              className="w-full"
            >
              Múltiples Productos Agregados
            </Button>
            
            <Button 
              onClick={() => orderCreated('ORD-2025-000001')}
              variant="outline"
              className="w-full"
            >
              Pedido Creado
            </Button>
            
            <Button 
              onClick={() => networkError('No se pudo conectar al servidor')}
              variant="destructive"
              className="w-full"
            >
              Error de Red
            </Button>
          </CardContent>
        </Card>

        {/* Toast con Opciones Avanzadas */}
        <Card>
          <CardHeader>
            <CardTitle>Toast con Opciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => success('Mensaje personalizado', {
                title: 'Título Personalizado',
                duration: 10000,
                action: {
                  label: 'Ver Detalles',
                  onClick: () => console.log('Ver detalles...')
                }
              })}
              className="w-full"
            >
              Toast con Título y Acción
            </Button>
            
            <Button 
              onClick={() => info('Este toast durará 2 segundos', {
                duration: 2000
              })}
              variant="outline"
              className="w-full"
            >
              Toast de 2 Segundos
            </Button>
            
            <Button 
              onClick={() => warning('Toast sin auto-cierre', {
                duration: 0
              })}
              variant="outline"
              className="w-full"
            >
              Toast Persistente
            </Button>
          </CardContent>
        </Card>

        {/* Gestión de Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => {
                // Crear múltiples toasts rápidamente
                for (let i = 1; i <= 5; i++) {
                  setTimeout(() => {
                    info(`Toast #${i} - ${new Date().toLocaleTimeString()}`);
                  }, i * 200);
                }
              }}
              className="w-full"
            >
              Crear 5 Toasts
            </Button>
            
            <Button 
              onClick={removeAllToasts}
              variant="destructive"
              className="w-full"
            >
              Limpiar Todos los Toasts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Características del Sistema de Toast</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Posiciones:</strong> top-right, top-left, bottom-right, bottom-left, top-center, bottom-center</li>
            <li><strong>Tipos:</strong> success, error, info, warning</li>
            <li><strong>Características:</strong> Títulos, acciones, barras de progreso, auto-cierre</li>
            <li><strong>Límite:</strong> Máximo 5 toasts simultáneos (configurable)</li>
            <li><strong>Animaciones:</strong> Entrada/salida suave con transiciones</li>
            <li><strong>Accesibilidad:</strong> Iconos descriptivos y botones de cierre</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
