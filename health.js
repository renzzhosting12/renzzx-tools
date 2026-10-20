module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    success: true,
    name: "RenzX Tools API",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString()
  });
};