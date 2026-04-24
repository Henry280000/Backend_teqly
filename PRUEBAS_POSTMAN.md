# 🧪 Pruebas de Endpoints en Postman

## 📌 Requisitos Previos
- Servidor iniciado: `npm run dev`
- URL base: `http://localhost:5000`
- Postman instalado

---

## 👤 CRUD de Usuarios - Prueba Completa

### 1️⃣ CREATE - Registrar Usuario

**Método:** `POST`  
**URL:** `http://localhost:5000/api/usuarios/registro`

**Headers:**
```
Content-Type: application/json
```

**Body (raw - JSON):**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@test.com",
  "contraseña": "password123"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@test.com",
    "rol": "usuario"
  }
}
```

**⚠️ Guarda el `token` para los siguientes pasos** ➡️ Usarás el token en las próximas pruebas

---

### 2️⃣ READ - Obtener Perfil del Usuario

**Método:** `GET`  
**URL:** `http://localhost:5000/api/usuarios/miPerfil`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token_del_paso_anterior}
```

**Body:** (vacío)

**Respuesta esperada (200):**
```json
{
  "success": true,
  "usuario": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@test.com",
    "rol": "usuario",
    "activo": true,
    "createdAt": "2024-04-23T10:30:00.000Z",
    "updatedAt": "2024-04-23T10:30:00.000Z"
  }
}
```

---

### 3️⃣ UPDATE - Actualizar Usuario (SU PROPIO PERFIL)

**Método:** `PUT`  
**URL:** `http://localhost:5000/api/usuarios/507f1f77bcf86cd799439011`  
(Reemplaza con el ID de tu perfil)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token_del_usuario}
```

**✅ Nota importante:** 
- **Usuarios normales:** Pueden actualizar SOLO SU PROPIO perfil
- **Admins:** Pueden actualizar cualquier usuario
- El campo `rol` solo puede ser cambiado por admins

**Body (raw - JSON):**
```json
{
  "nombre": "Juan Carlos Pérez",
  "email": "juancarlos@test.com"
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "mensaje": "Usuario actualizado exitosamente",
  "usuario": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Carlos Pérez",
    "email": "juancarlos@test.com",
    "rol": "usuario",
    "activo": true,
    "createdAt": "2024-04-23T10:30:00.000Z",
    "updatedAt": "2024-04-23T11:45:00.000Z"
  }
}
```

**Si intentas actualizar otro usuario (no siendo admin):**
```json
{
  "success": false,
  "mensaje": "No puedes actualizar el perfil de otro usuario"
}
```

---

### 4️⃣ DELETE - Eliminar Usuario (SU PROPIA CUENTA)

**Método:** `DELETE`  
**URL:** `http://localhost:5000/api/usuarios/507f1f77bcf86cd799439011`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token_del_usuario}
```

**✅ Nota importante:**
- **Usuarios normales:** Pueden eliminar SOLO SU PROPIA cuenta
- **Admins:** Pueden eliminar cualquier usuario

**Body:** (vacío)

**Respuesta esperada (200):**
```json
{
  "success": true,
  "mensaje": "Usuario eliminado exitosamente"
}
```

**Si intentas eliminar otra cuenta (no siendo admin):**
```json
{
  "success": false,
  "mensaje": "No puedes eliminar la cuenta de otro usuario"
}
```

---

## 🔐 Flujo de Permisos - Usuario vs Admin

### Usuario Normal
- ✅ Registrarse
- ✅ Iniciar sesión
- ✅ Ver su perfil
- ✅ **Actualizar su propio perfil**
- ✅ **Eliminar su propia cuenta**
- ❌ Ver otros usuarios
- ❌ Actualizar otros perfiles
- ❌ Gestionar productos

### Administrador
- ✅ Todo lo anterior +
- ✅ Ver todos los usuarios
- ✅ Actualizar cualquier usuario
- ✅ Cambiar rol de usuarios
- ✅ Eliminar cualquier usuario
- ✅ Crear/Actualizar/Eliminar productos

---

## 🔧 Crear Usuario Admin (Opcional)

**Solo si necesitas probar funciones especiales de admin:**

**1. Acceso a MongoDB:**
```javascript
db.users.insertOne({
  nombre: "Admin",
  email: "admin@test.com",
  contraseña: "admin123",
  rol: "admin"
})
```

**2. O crea manualmente en Postman y luego cambia el rol en MongoDB:**
```
POST /api/usuarios/registro
```

---

## 📦 CRUD de Productos - Prueba Rápida

### CREATE - Crear Producto (Admin)
```
POST http://localhost:5000/api/productos
Authorization: Bearer {token_admin}

{
  "categoria": "celulares",
  "nombre": "iPhone 16",
  "marca": "Apple",
  "precio": 20000,
  "imagen": "https://...",
  "sistema_operativo": "iOS 18",
  "procesador": "A18",
  "ram": "8GB",
  "almacenamiento": "256GB",
  "pantalla": "6.1 pulgadas",
  "camara": "48MP",
  "bateria": "3500mAh",
  "caracteristicas_especiales": ["Dynamic Island", "USB-C"]
}
```

### READ - Listar Productos
```
GET http://localhost:5000/api/productos
```

### READ - Filtrar por Categoría
```
GET http://localhost:5000/api/productos?categoria=celulares
```

### READ - Buscar Productos
```
GET http://localhost:5000/api/productos/buscar?q=samsung
```

### UPDATE - Actualizar Producto
```
PUT http://localhost:5000/api/productos/{id}
Authorization: Bearer {token_admin}

{
  "precio": 18000,
  "disponible": true
}
```

### DELETE - Eliminar Producto
```
DELETE http://localhost:5000/api/productos/{id}
Authorization: Bearer {token_admin}
```

---

## ✅ Checklist de Pruebas

### Usuarios
- [ ] POST /registro - Crear usuario ✅
- [ ] GET /miPerfil - Obtener perfil ✅
- [ ] PUT /:id - Actualizar usuario ✅
- [ ] DELETE /:id - Eliminar usuario ✅

### Productos
- [ ] GET / - Listar todos ✅
- [ ] GET /?categoria=celulares - Filtrar ✅
- [ ] GET /buscar?q=samsung - Buscar ✅
- [ ] GET /estadisticas - Estadísticas ✅
- [ ] POST - Crear (admin) ✅
- [ ] PUT /:id - Actualizar (admin) ✅
- [ ] DELETE /:id - Eliminar (admin) ✅

### Teléfonos
- [ ] GET - Listar ✅
- [ ] POST - Crear (admin) ✅
- [ ] PUT - Actualizar (admin) ✅
- [ ] DELETE - Eliminar (admin) ✅

---

## 🔴 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `401 - No autorizado` | Falta token | Agrega header `Authorization: Bearer {token}` |
| `403 - Forbidden` | No eres admin | Usa credenciales de admin |
| `404 - No encontrado` | ID inválido | Verifica que el ID existe |
| `400 - Bad Request` | Campos faltantes | Completa todos los campos requeridos |

---

## 💡 Tips

1. **Guarda la colección en Postman** - File → Ctrl+S
2. **Usa variables** - Guarda el token en una variable:
   - `{{token}}`
3. **Orden de pruebas recomendado:**
   1. Registrar usuario
   2. Obtener perfil
   3. Listar productos
   4. Filtrar por categoría
   5. Actualizar usuario
   6. Eliminar usuario

---

¡Listo para probar! 🚀
