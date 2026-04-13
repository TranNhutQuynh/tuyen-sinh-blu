const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createCandidate } = require("../controllers/candidateController");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "report-card-evidence");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("reportCardEvidenceFiles", 20), createCandidate);

module.exports = router;
