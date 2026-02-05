const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors({
    origin: "*"
}));


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/convert", upload.array("images"), async (req, res) => {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=images.pdf");

    doc.pipe(res);

    req.files.forEach((file, index) => {
        if (index !== 0) doc.addPage();
        doc.image(file.buffer, {
            fit: [500, 700],
            align: "center",
            valign: "center",
        });
    });

    doc.end();
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
