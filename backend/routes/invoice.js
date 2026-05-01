const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

router.get('/download/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Tell the browser/app that this is a PDF file to download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order._id}.pdf`);
        doc.pipe(res);

        // --- Design the PDF ---
        doc.fontSize(25).text('WMT Food Delivery', { align: 'center' }).moveDown();
        doc.fontSize(20).text('INVOICE', { align: 'center', underline: true }).moveDown();

        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.moveDown();

        doc.fontSize(14).text('Customer Details:');
        doc.fontSize(12).text(`Name: ${order.customerName}`);
        doc.text(`Address: ${order.address}`);
        doc.moveDown();

        doc.text('------------------------------------------------------------------');
        doc.fontSize(14).text('Order Items:').moveDown(0.5);
        doc.fontSize(12);
        order.items.forEach(item => {
            doc.text(`${item.quantity}x ${item.name} - Rs. ${(item.price * item.quantity)}`);
        });
        doc.text('------------------------------------------------------------------').moveDown();

        doc.text(`Total Discount: Rs. ${order.discount}`);
        doc.fontSize(16).text(`Total Paid: Rs. ${order.totalAmount}`, { bold: true });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error("Invoice Error:", error);
        res.status(500).send("Server error generating invoice");
    }
});

module.exports = router;