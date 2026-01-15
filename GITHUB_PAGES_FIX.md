# Solución para imágenes no encontradas en GitHub Pages

## Problema

Las imágenes del slider no se cargaban en GitHub Pages con error 404:

```
Failed to load resource: the server responded with a status of 404 ()
https://kevinj0.github.io/_Portafolio/dist/img/works_images/...
```

## Causa

El proyecto está en una subcarpeta (`_Portafolio`) en GitHub Pages, pero las rutas de las imágenes en el HTML usan rutas relativas (`dist/img/...`) que son válidas localmente pero no en GitHub Pages.

## Solución implementada

Se agregó un sistema automático de corrección de rutas que:

1. **Detecta el entorno**: Identifica si el sitio se está ejecutando en GitHub Pages o localmente
2. **Calcula la ruta base**: Extrae automáticamente el nombre del repositorio de la URL
3. **Corrige todas las rutas**: Ajusta dinámicamente todas las referencias a recursos (`img`, CSS, scripts, etc.)

## Archivos modificados

### 1. `index.html`

- Se agregó un script inline que detecta GitHub Pages inmediatamente
- Se incluyó `js/path-fixer.js` para la corrección dinámica

### 2. `js/path-fixer.js` (nuevo)

- Script que se ejecuta automáticamente al cargar la página
- Corrige rutas de:
  - Imágenes (`<img>` tags)
  - Favicon
  - CSS (tanto en tags como en rules internos)
  - Scripts
  - Detecta y corrige imágenes agregadas dinámicamente

## Cómo funciona

1. Cuando la página carga en GitHub Pages, el script detecta que `window.location.hostname === 'kevinj0.github.io'`
2. Extrae `_Portafolio` de la URL: `https://kevinj0.github.io/_Portafolio/`
3. Establece la ruta base como `/_Portafolio/`
4. Todas las rutas que comienzan con `dist/` se convierten a `/_Portafolio/dist/`

## Ejemplo de transformación

```
Local:        dist/img/works_images/centromedico_cliente/home (1).png
GitHub Pages: /_Portafolio/dist/img/works_images/centromedico_cliente/home (1).png
```

## Ventajas

✅ Funciona tanto localmente como en GitHub Pages  
✅ No requiere cambios manuales en 54 referencias de imágenes  
✅ Automático: no necesita configuración adicional  
✅ También corrige imágenes de fondo en CSS  
✅ Soporta elementos agregados dinámicamente

## Testing

Para verificar que funciona:

1. Abre el sitio localmente: debe funcionar normalmente
2. Sube a GitHub Pages: las imágenes deben cargarse correctamente
3. Revisa la consola del navegador para confirmar que no hay errores 404

## Notas técnicas

- El script se ejecuta lo antes posible para interceptar cargas de recursos
- Usa MutationObserver para detectar cambios dinámicos en el DOM
- Compatible con todos los navegadores modernos
- Tiene manejo de errores para stylesheets de origen cruzado
