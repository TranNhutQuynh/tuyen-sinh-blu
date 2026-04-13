const express = require("express");
const {
  exportCandidates,
  getCandidateDetail,
  listCandidates,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(verifyAdmin);

router.get("/candidates", listCandidates);
router.get("/candidates/:id", getCandidateDetail);
router.put("/candidates/:id", updateCandidate);
router.delete("/candidates/:id", deleteCandidate);
router.get("/export/:type", exportCandidates);

module.exports = router;
