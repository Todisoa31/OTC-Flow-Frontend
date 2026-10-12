const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.min.js");
const destination = path.resolve(__dirname, "../public/pdf.worker.min.js");

fs.copyFile(source, destination, (err) => {
  if (err) {
    console.error(" Erreur lors de la copie du pdf.worker.min.js :", err);
  } else {
    console.log(" pdf.worker.min.js copié avec succès dans /public");
  }
});
