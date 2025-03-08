
import Router from 'express';
import Application from '../models/Application';
const exceljs = require('exceljs');

const router = Router();
router.get('/export-applications', async (req, res) => {
  try {
    const { companyId, date } = req.query;
    if (!companyId || !date) {
      return res.status(400).json({ error: 'Company ID and date are required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const applications = await Application.find({
      company: companyId,
      dateApplied: { $gte: startOfDay, $lte: endOfDay }
    });

    if (applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for the specified date' });
    }

    // Create Excel file
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
      { header: 'Applicant Name', key: 'applicantName', width: 25 },
      { header: 'Position', key: 'position', width: 25 },
      { header: 'Date Applied', key: 'dateApplied', width: 20 }
    ];

    // Add rows
    applications.forEach(app => {
      worksheet.addRow({
        applicantName: app.applicantName,
        position: app.position,
        dateApplied: app.dateApplied.toISOString().split('T')[0]
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=applications_${companyId}_${date}.xlsx`);

    // Send the file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
