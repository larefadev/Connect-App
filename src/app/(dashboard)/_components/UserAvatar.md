# UserAvatar Component

## Descripción
El componente `UserAvatar` ahora está integrado con el sistema de imágenes de perfil. Muestra automáticamente la foto de perfil del usuario cuando está disponible, o las iniciales del email cuando no hay imagen.

## Funcionalidades

### ✅ Características Implementadas
- **Imagen de perfil**: Muestra la foto de perfil del usuario desde Supabase Storage
- **Fallback a iniciales**: Cuando no hay imagen, muestra las iniciales del email
- **Manejo de errores**: Si la imagen falla al cargar, automáticamente muestra las iniciales
- **Integración automática**: Se conecta con el hook `usePerson` para obtener datos actualizados
- **Responsive**: Se adapta al tamaño especificado en las props

### 🔄 Flujo de Funcionamiento

1. **Verificación de imagen**: El componente verifica si existe `person.profile_image`
2. **Renderizado condicional**:
   - **Con imagen**: Muestra la imagen de perfil en un contenedor redondo
   - **Sin imagen**: Muestra las iniciales del email en un círculo rojo
3. **Manejo de errores**: Si la imagen falla al cargar, se activa `imageError` y se muestran las iniciales

## Uso

```tsx
import { UserAvatar } from './UserAvatar';

// Uso básico
<UserAvatar email="usuario@ejemplo.com" size={32} />

// Con tamaño personalizado
<UserAvatar email="usuario@ejemplo.com" size={48} />
```

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `email` | `string` | ✅ | - | Email del usuario para generar iniciales |
| `size` | `number` | ❌ | `32` | Tamaño del avatar en píxeles |

## Estados Visuales

### 🖼️ Con Imagen de Perfil
- Contenedor redondo con la imagen del usuario
- Clase CSS: `rounded-full overflow-hidden`
- Imagen optimizada con `next/image`

### 🔤 Con Iniciales
- Círculo rojo con las iniciales del email
- Clase CSS: `bg-red-500 rounded-full`
- Texto blanco en negrita
- Tamaño de fuente proporcional al tamaño del avatar

## Integración con usePerson

El componente utiliza el hook `usePerson` para obtener:
- `person.profile_image`: URL de la imagen de perfil
- Estado automático de actualización cuando cambia la imagen

## Ejemplos de Renderizado

### Email: "usuario@ejemplo.com"
- **Con imagen**: Muestra la foto de perfil del usuario
- **Sin imagen**: Muestra "U" en un círculo rojo

### Email: "maria.garcia@empresa.com"
- **Con imagen**: Muestra la foto de perfil del usuario
- **Sin imagen**: Muestra "M" en un círculo rojo

## Consideraciones Técnicas

- **Optimización de imágenes**: Usa `next/image` para mejor rendimiento
- **Manejo de errores**: Fallback automático a iniciales si la imagen falla
- **Estado reactivo**: Se actualiza automáticamente cuando cambia la imagen de perfil
- **Performance**: Solo se re-renderiza cuando cambian los datos relevantes

## Dependencias

- `@/hooks/Person/usePerson` - Para obtener datos del usuario
- `next/image` - Para optimización de imágenes
- `react` - Para hooks y estado
