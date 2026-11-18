# Bitácora — cafe-origen-analitica

## Diccionario de datos

Fuente: arreglo `ventas` en `src/datos.js` (12 registros). Cada registro es una línea de venta: un cliente compra un producto en una fecha.

| Propiedad  | Tipo              | Significado                                                                 | Ejemplo                |
|------------|-------------------|-----------------------------------------------------------------------------|------------------------|
| `id`       | `number` (entero) | Identificador único de la venta. Es consecutivo (1 a 12).                   | `5`                    |
| `fecha`    | `string`          | Fecha de la venta en formato ISO `AAAA-MM-DD`. Es texto, no un objeto `Date`. | `"2026-09-03"`         |
| `cliente`  | `string`          | Código del cliente (`C` + dos dígitos). Un cliente puede tener varias ventas. | `"C01"`                |
| `producto` | `string`          | Nombre del producto. En los cafés incluye el origen y el peso.              | `"Origen Huila 500 g"` |
| `ciudad`   | `string`          | Ciudad de la venta. Se escribe sin tildes (`Medellin`, `Bogota`).           | `"Cali"`               |
| `cantidad` | `number` (entero) | Unidades del producto vendidas en esa venta.                                | `2`                    |

Notas:
- No hay campo de precio, así que con estos datos solo se pueden analizar unidades, no ingresos.
- Hay dos tipos de producto: café (`Origen Huila 500 g`, `Origen Narino 250 g`, `Origen Sierra 500 g`) y accesorios (`Prensa francesa`, `Molino manual`).

## Casos borde detectados


### 1. Venta con `cantidad: 0`
- Dónde: la venta `id: 8` (cliente C06, Origen Huila 500 g, Cali).
- Riesgo: una venta de 0 unidades no es una venta real (puede ser un error de captura o una venta anulada). Si la cuento, se inflan el número de ventas y el número de clientes: C06 aparecería como cliente aunque no compró nada.
- Decisión: solo cuento como válidas las ventas con `cantidad > 0`. La venta 8 queda fuera de los conteos y la reporto aparte como registro excluido. También rechazo cantidades negativas o que no sean un número entero.

### 2. Clientes que se repiten
- Dónde: C01 aparece en las ventas 1, 4 y 11; C02 en las ventas 2 y 7; C03 en las ventas 3 y 9.
- Riesgo: los datos no tienen errores, pero hay una trampa en el análisis: el número de ventas (12) no es el número de clientes. Si uso `ventas.length` como "clientes", cuento de más.
- Decisión: para contar clientes, cuento los códigos únicos (`new Set(ventas.map(v => v.cliente)).size`). Hay 8 clientes en total y 7 si excluyo la venta de cantidad 0 (C06). Las métricas "ventas", "unidades" y "clientes" las calculo por separado.
