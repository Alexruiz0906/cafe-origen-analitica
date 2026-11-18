const ventas = require("./datos.js");
console.log("REGISTROS TOTALES:",ventas.length);
console.log("PRIMERA VENTA:",ventas[0])
console.log("ULTIMA VENTA:",ventas[11])
console.log("CUARTA PRODUCTO:",ventas[4].producto)
console.table(ventas)