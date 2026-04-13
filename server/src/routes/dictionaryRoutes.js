const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyAdmin } = require("../middlewares/authMiddleware");

const query = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows;
};

const normalizeActive = (value) => (Number(value) ? 1 : 0);

const handleSqlError = (res, error, fallbackMessage) => {
  console.error(error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ message: "Mã đã tồn tại trong hệ thống" });
  }

  return res.status(500).json({ message: fallbackMessage });
};

router.get("/dictionaries/form-options", async (_req, res) => {
  try {
    const schools = await query(`
      SELECT id, school_code AS code, school_name AS name
      FROM high_schools
      WHERE is_active = 1
      ORDER BY school_name
    `);

    const majors = await query(`
      SELECT id, major_code AS code, major_name AS name
      FROM admission_majors
      WHERE is_active = 1
      ORDER BY major_name
    `);

    const subjectCombinations = await query(`
      SELECT id, combination_code AS code, combination_name AS name
      FROM subject_combinations
      WHERE is_active = 1
      ORDER BY combination_code
    `);

    const methods = await query(`
      SELECT id, method_code AS code, method_name AS name
      FROM admission_methods
      WHERE is_active = 1
      ORDER BY method_name
    `);

    const periods = await query(`
      SELECT id, period_name, start_at, end_at, is_active
      FROM registration_periods
      ORDER BY start_at DESC
    `);

    return res.json({
      schools,
      majors,
      subjectCombinations,
      methods,
      periods,
      priorityAreas: [
        { code: "", name: "-- Chọn khu vực ưu tiên --" },
        { code: "KV1", name: "KV1" },
        { code: "KV2NT", name: "KV2-NT" },
        { code: "KV2", name: "KV2" },
        { code: "KV3", name: "KV3" },
      ],
      priorityObjects: [
        { code: "", name: "-- Chọn đối tượng ưu tiên --" },
        { code: "00", name: "Không ưu tiên" },
        { code: "01", name: "Đối tượng 01" },
        { code: "02", name: "Đối tượng 02" },
        { code: "03", name: "Đối tượng 03" },
        { code: "04", name: "Đối tượng 04" },
        { code: "05", name: "Đối tượng 05" },
        { code: "06", name: "Đối tượng 06" },
        { code: "07", name: "Đối tượng 07" },
      ],
    });
  } catch (error) {
    console.error("form-options error:", error);
    return res.status(500).json({ message: "Không tải được danh mục" });
  }
});

router.get(
  "/dictionaries/admin/catalogs/summary",
  verifyAdmin,
  async (_req, res) => {
    try {
      const schools = await query(`
      SELECT id, school_code, school_name, is_active, created_at, updated_at
      FROM high_schools
      ORDER BY id DESC
    `);

      const majors = await query(`
      SELECT id, major_code, major_name, is_active, created_at, updated_at
      FROM admission_majors
      ORDER BY id DESC
    `);

      const subjectCombinations = await query(`
      SELECT id, combination_code, combination_name, is_active, created_at, updated_at
      FROM subject_combinations
      ORDER BY id DESC
    `);

      const methods = await query(`
      SELECT id, method_code, method_name, is_active, created_at, updated_at
      FROM admission_methods
      ORDER BY id DESC
    `);

      const periods = await query(`
      SELECT id, period_name, start_at, end_at, is_active, created_at, updated_at
      FROM registration_periods
      ORDER BY start_at DESC
    `);

      return res.json({
        schools,
        majors,
        subjectCombinations,
        methods,
        periods,
      });
    } catch (error) {
      return handleSqlError(res, error, "Không tải được dữ liệu danh mục");
    }
  }
);

router.post(
  "/dictionaries/admin/high-schools",
  verifyAdmin,
  async (req, res) => {
    try {
      const { schoolCode, schoolName, isActive = 1 } = req.body || {};

      if (
        !String(schoolCode || "").trim() ||
        !String(schoolName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã trường hoặc tên trường" });
      }

      const result = await query(
        `
      INSERT INTO high_schools (school_code, school_name, is_active)
      VALUES (?, ?, ?)
      `,
        [
          String(schoolCode).trim(),
          String(schoolName).trim(),
          normalizeActive(isActive),
        ]
      );

      return res.json({ id: result.insertId, message: "Đã thêm trường THPT" });
    } catch (error) {
      return handleSqlError(res, error, "Không thêm được trường THPT");
    }
  }
);

router.put(
  "/dictionaries/admin/high-schools/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { schoolCode, schoolName, isActive = 1 } = req.body || {};

      if (
        !String(schoolCode || "").trim() ||
        !String(schoolName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã trường hoặc tên trường" });
      }

      await query(
        `
      UPDATE high_schools
      SET school_code = ?, school_name = ?, is_active = ?
      WHERE id = ?
      `,
        [
          String(schoolCode).trim(),
          String(schoolName).trim(),
          normalizeActive(isActive),
          req.params.id,
        ]
      );

      return res.json({ message: "Đã cập nhật trường THPT" });
    } catch (error) {
      return handleSqlError(res, error, "Không cập nhật được trường THPT");
    }
  }
);

router.delete(
  "/dictionaries/admin/high-schools/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      await query(`DELETE FROM high_schools WHERE id = ?`, [req.params.id]);
      return res.json({ message: "Đã xóa trường THPT" });
    } catch (error) {
      return handleSqlError(res, error, "Không xóa được trường THPT");
    }
  }
);

router.post("/dictionaries/admin/majors", verifyAdmin, async (req, res) => {
  try {
    const { majorCode, majorName, isActive = 1 } = req.body || {};

    if (!String(majorCode || "").trim() || !String(majorName || "").trim()) {
      return res.status(400).json({ message: "Thiếu mã ngành hoặc tên ngành" });
    }

    const result = await query(
      `
      INSERT INTO admission_majors (major_code, major_name, is_active)
      VALUES (?, ?, ?)
      `,
      [
        String(majorCode).trim(),
        String(majorName).trim(),
        normalizeActive(isActive),
      ]
    );

    return res.json({ id: result.insertId, message: "Đã thêm ngành" });
  } catch (error) {
    return handleSqlError(res, error, "Không thêm được ngành");
  }
});

router.put("/dictionaries/admin/majors/:id", verifyAdmin, async (req, res) => {
  try {
    const { majorCode, majorName, isActive = 1 } = req.body || {};

    if (!String(majorCode || "").trim() || !String(majorName || "").trim()) {
      return res.status(400).json({ message: "Thiếu mã ngành hoặc tên ngành" });
    }

    await query(
      `
      UPDATE admission_majors
      SET major_code = ?, major_name = ?, is_active = ?
      WHERE id = ?
      `,
      [
        String(majorCode).trim(),
        String(majorName).trim(),
        normalizeActive(isActive),
        req.params.id,
      ]
    );

    return res.json({ message: "Đã cập nhật ngành" });
  } catch (error) {
    return handleSqlError(res, error, "Không cập nhật được ngành");
  }
});

router.delete(
  "/dictionaries/admin/majors/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      await query(`DELETE FROM admission_majors WHERE id = ?`, [req.params.id]);
      return res.json({ message: "Đã xóa ngành" });
    } catch (error) {
      return handleSqlError(res, error, "Không xóa được ngành");
    }
  }
);

router.post(
  "/dictionaries/admin/subject-combinations",
  verifyAdmin,
  async (req, res) => {
    try {
      const { combinationCode, combinationName, isActive = 1 } = req.body || {};

      if (
        !String(combinationCode || "").trim() ||
        !String(combinationName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã tổ hợp hoặc tên tổ hợp" });
      }

      const result = await query(
        `
      INSERT INTO subject_combinations (combination_code, combination_name, is_active)
      VALUES (?, ?, ?)
      `,
        [
          String(combinationCode).trim(),
          String(combinationName).trim(),
          normalizeActive(isActive),
        ]
      );

      return res.json({ id: result.insertId, message: "Đã thêm tổ hợp môn" });
    } catch (error) {
      return handleSqlError(res, error, "Không thêm được tổ hợp môn");
    }
  }
);

router.put(
  "/dictionaries/admin/subject-combinations/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { combinationCode, combinationName, isActive = 1 } = req.body || {};

      if (
        !String(combinationCode || "").trim() ||
        !String(combinationName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã tổ hợp hoặc tên tổ hợp" });
      }

      await query(
        `
      UPDATE subject_combinations
      SET combination_code = ?, combination_name = ?, is_active = ?
      WHERE id = ?
      `,
        [
          String(combinationCode).trim(),
          String(combinationName).trim(),
          normalizeActive(isActive),
          req.params.id,
        ]
      );

      return res.json({ message: "Đã cập nhật tổ hợp môn" });
    } catch (error) {
      return handleSqlError(res, error, "Không cập nhật được tổ hợp môn");
    }
  }
);

router.delete(
  "/dictionaries/admin/subject-combinations/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      await query(`DELETE FROM subject_combinations WHERE id = ?`, [
        req.params.id,
      ]);
      return res.json({ message: "Đã xóa tổ hợp môn" });
    } catch (error) {
      return handleSqlError(res, error, "Không xóa được tổ hợp môn");
    }
  }
);

router.post(
  "/dictionaries/admin/admission-methods",
  verifyAdmin,
  async (req, res) => {
    try {
      const { methodCode, methodName, isActive = 1 } = req.body || {};

      if (
        !String(methodCode || "").trim() ||
        !String(methodName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã phương thức hoặc tên phương thức" });
      }

      const result = await query(
        `
      INSERT INTO admission_methods (method_code, method_name, is_active)
      VALUES (?, ?, ?)
      `,
        [
          String(methodCode).trim(),
          String(methodName).trim(),
          normalizeActive(isActive),
        ]
      );

      return res.json({
        id: result.insertId,
        message: "Đã thêm phương thức xét tuyển",
      });
    } catch (error) {
      return handleSqlError(
        res,
        error,
        "Không thêm được phương thức xét tuyển"
      );
    }
  }
);

router.put(
  "/dictionaries/admin/admission-methods/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { methodCode, methodName, isActive = 1 } = req.body || {};

      if (
        !String(methodCode || "").trim() ||
        !String(methodName || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu mã phương thức hoặc tên phương thức" });
      }

      await query(
        `
      UPDATE admission_methods
      SET method_code = ?, method_name = ?, is_active = ?
      WHERE id = ?
      `,
        [
          String(methodCode).trim(),
          String(methodName).trim(),
          normalizeActive(isActive),
          req.params.id,
        ]
      );

      return res.json({ message: "Đã cập nhật phương thức xét tuyển" });
    } catch (error) {
      return handleSqlError(
        res,
        error,
        "Không cập nhật được phương thức xét tuyển"
      );
    }
  }
);

router.delete(
  "/dictionaries/admin/admission-methods/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      await query(`DELETE FROM admission_methods WHERE id = ?`, [
        req.params.id,
      ]);
      return res.json({ message: "Đã xóa phương thức xét tuyển" });
    } catch (error) {
      return handleSqlError(res, error, "Không xóa được phương thức xét tuyển");
    }
  }
);

router.post(
  "/dictionaries/admin/registration-periods",
  verifyAdmin,
  async (req, res) => {
    try {
      const { periodName, startAt, endAt, isActive = 1 } = req.body || {};

      if (
        !String(periodName || "").trim() ||
        !String(startAt || "").trim() ||
        !String(endAt || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu tên đợt hoặc thời gian mở/đóng" });
      }

      const result = await query(
        `
      INSERT INTO registration_periods (period_name, start_at, end_at, is_active)
      VALUES (?, ?, ?, ?)
      `,
        [String(periodName).trim(), startAt, endAt, normalizeActive(isActive)]
      );

      return res.json({ id: result.insertId, message: "Đã thêm đợt đăng ký" });
    } catch (error) {
      return handleSqlError(res, error, "Không thêm được đợt đăng ký");
    }
  }
);

router.put(
  "/dictionaries/admin/registration-periods/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { periodName, startAt, endAt, isActive = 1 } = req.body || {};

      if (
        !String(periodName || "").trim() ||
        !String(startAt || "").trim() ||
        !String(endAt || "").trim()
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu tên đợt hoặc thời gian mở/đóng" });
      }

      await query(
        `
      UPDATE registration_periods
      SET period_name = ?, start_at = ?, end_at = ?, is_active = ?
      WHERE id = ?
      `,
        [
          String(periodName).trim(),
          startAt,
          endAt,
          normalizeActive(isActive),
          req.params.id,
        ]
      );

      return res.json({ message: "Đã cập nhật đợt đăng ký" });
    } catch (error) {
      return handleSqlError(res, error, "Không cập nhật được đợt đăng ký");
    }
  }
);

router.delete(
  "/dictionaries/admin/registration-periods/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      await query(`DELETE FROM registration_periods WHERE id = ?`, [
        req.params.id,
      ]);
      return res.json({ message: "Đã xóa đợt đăng ký" });
    } catch (error) {
      return handleSqlError(res, error, "Không xóa được đợt đăng ký");
    }
  }
);

module.exports = router;
