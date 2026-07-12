// Cargamos las variables del archivo .env
require("dotenv").config();

// Importamos mongoose para conectar con MongoDB
const mongoose = require("mongoose");

// Importamos xlsx para leer archivos Excel
const xlsx = require("xlsx");

// Importamos el modelo de la Master de Spools
const SpoolMaster = require("./models/SpoolMaster");

// Ruta del archivo Excel
const archivoExcel = "./data/master_spools.xlsx";

// Función principal
async function importarExcel() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Conectado a MongoDB");

    const workbook = xlsx.readFile(archivoExcel);

    const nombreHoja = workbook.SheetNames[0];

    const hoja = workbook.Sheets[nombreHoja];

    // Convertimos la hoja a arreglo de filas
    const filas = xlsx.utils.sheet_to_json(hoja, {
      header: 1,
      defval: "",
    });

    // Buscamos la fila donde está el encabezado "CC"
    const indiceEncabezado = filas.findIndex((fila) =>
      fila.includes("CC")
    );

    if (indiceEncabezado === -1) {
      console.log("No se encontró la fila de encabezados con CC");
      await mongoose.disconnect();
      return;
    }

    // Los encabezados reales están en esa fila
    const encabezados = filas[indiceEncabezado];

    // Los datos empiezan una fila después
    const filasDatos = filas.slice(indiceEncabezado + 1);

    console.log("Encabezados encontrados:");
    console.log(encabezados);

    console.log(`Filas de datos encontradas: ${filasDatos.length}`);

    const spools = filasDatos
      .filter((fila) => fila[0] && fila[1])
      .map((fila) => ({
        codigoCorto: String(fila[0]).trim().toUpperCase(),
        spool: String(fila[1]).trim().toUpperCase(),
        linea: String(fila[2]).trim().toUpperCase(),
        isometrico: String(fila[3]).trim().toUpperCase(),
        diametro: Number(fila[4]) || 0,
        superficieM2: Number(fila[5]) || 0,
        pesoKg: Number(fila[6]) || 0,
        colorSistema: String(fila[7]).trim().toUpperCase(),
        area: String(fila[8]).trim().toUpperCase(),
        material: String(fila[9]).trim().toUpperCase(),
        pl: String(fila[10]).trim().toUpperCase(),
        servicio: String(fila[11]).trim().toUpperCase(),
        zona: String(fila[12]).trim().toUpperCase(),
        recubrimiento: String(fila[13]).trim().toUpperCase(),
      }));

    console.log(`Spools listos para importar: ${spools.length}`);

    // Limpia la colección antes de importar
    await SpoolMaster.deleteMany({});

    // Inserta los spools en MongoDB
    await SpoolMaster.insertMany(spools);

    console.log("Importación terminada correctamente");

    await mongoose.disconnect();
  } catch (error) {
    console.log("Error al importar Excel:", error.message);
  }
}

importarExcel();