# Integración de Supabase OTP en el Flujo de Registro

## Resumen de Cambios

Se ha integrado Supabase OTP en el flujo de registro existente, reemplazando los mocks con llamadas reales a la API de Supabase.

## Cambios Implementados

### 1. Store de Registro (`src/stores/registrationFlowStore.ts`)

#### `handleRegister`
- **Antes:** Mock con `setTimeout`
- **Ahora:** Usa `supabase.auth.signInWithOtp()` para enviar código de verificación
- **Funcionalidad:** Envía un código de 6 dígitos al email del usuario

```typescript
const { error } = await supabase.auth.signInWithOtp({
    email: userData.email!,
    options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
    }
})
```

#### `handleVerifyCode`
- **Antes:** Mock con `setTimeout`
- **Ahora:** Usa `supabase.auth.verifyOtp()` para validar el código
- **Funcionalidad:** Verifica el código y inicia sesión automáticamente

```typescript
const { data, error } = await supabase.auth.verifyOtp({
    email: verificationData.email,
    token: code,
    type: 'email'
})
```

#### `handleResendCode` (Nueva función)
- **Funcionalidad:** Reenvía el código de verificación
- **Uso:** Llamada desde el hook `useVerifyCode`

### 2. Hook de Verificación (`src/hooks/Auth/useVerifyCode.ts`)

#### Cambios en OTP:
- **Antes:** 4 dígitos
- **Ahora:** 6 dígitos
- **Actualización:** Array de estado y validaciones actualizadas

#### Funcionalidades:
- Manejo de entrada de 6 dígitos
- Navegación automática entre campos
- Soporte para pegar código de 6 dígitos
- Integración con `handleResendCode` del store

### 3. Componente de Verificación (`src/Modules/Confirm/Components/VerifyCode.tsx`)

#### Cambios visuales:
- **Antes:** 4 inputs grandes (14x14)
- **Ahora:** 6 inputs más pequeños (12x12)
- **Espaciado:** Reducido para acomodar 6 dígitos

### 4. Tipos (`src/types/auth.ts`)

#### Nuevas funciones agregadas:
```typescript
handleResendCode: () => Promise<void>
```

## Flujo de Verificación

### Paso 1: Registro
1. Usuario ingresa email, password y username
2. Se llama a `handleRegister`
3. Supabase envía código de 6 dígitos por email
4. Usuario es redirigido a la pantalla de verificación

### Paso 2: Verificación
1. Usuario ingresa el código de 6 dígitos
2. Se llama a `handleVerifyCode`
3. Supabase valida el código
4. Si es válido:
   - Se inicia sesión automáticamente
   - Se actualiza el estado de verificación
   - Se redirige al siguiente paso del flujo

### Paso 3: Reenvío (Opcional)
1. Usuario puede solicitar reenvío del código
2. Se llama a `handleResendCode`
3. Supabase envía un nuevo código
4. Timer se reinicia a 30 segundos

## Manejo de Errores

### Errores de Supabase:
- **Email inválido:** "Invalid email address"
- **Código incorrecto:** "Invalid OTP"
- **Código expirado:** "OTP expired"
- **Rate limiting:** "Too many requests"

### Errores de UI:
- **Código incompleto:** Validación local antes de enviar
- **Timer activo:** Prevención de spam en reenvío
- **Estados de carga:** Feedback visual durante operaciones

## Configuración de Supabase

### Variables de Entorno Requeridas:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Configuración en Dashboard:
1. **Authentication > Settings:**
   - Habilitar "Enable email confirmations"
   - Configurar URLs de redirección

2. **Authentication > Email Templates:**
   - Personalizar template "Magic Link"
   - Asegurar que muestre el código de 6 dígitos

## Ventajas de la Integración

### Seguridad:
- Códigos de verificación de 6 dígitos
- Expiración automática (1 hora)
- Rate limiting integrado
- Validación en servidor

### UX:
- Feedback inmediato de errores
- Timer para reenvío
- Navegación automática entre campos
- Estados de carga claros

### Mantenibilidad:
- Código TypeScript tipado
- Manejo centralizado de errores
- Estructura de hooks reutilizable
- Integración con Zustand persist

## Pruebas

### Casos de Prueba:
1. **Registro exitoso:** Email válido → código enviado
2. **Verificación exitosa:** Código correcto → sesión iniciada
3. **Código incorrecto:** Error mostrado en UI
4. **Reenvío:** Nuevo código enviado
5. **Email inválido:** Error de validación
6. **Rate limiting:** Manejo de límites de Supabase

### Página de Prueba:
Visita el flujo de registro normal para probar la integración completa.

## Notas Técnicas

- Los códigos OTP de Supabase son de 6 dígitos por defecto
- El tipo `'email'` se usa para verificación de email
- La sesión se inicia automáticamente después de verificar
- Los datos del usuario se almacenan en Zustand persist
- El flujo mantiene la estructura existente de hooks y stores
