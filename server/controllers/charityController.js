const Charity = require('../models/Charity');

exports.getCharities = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const charities = await Charity.find(filter).sort({ featured: -1, name: 1 });
    res.json({ success: true, data: charities });
  } catch (error) { next(error); }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const charities = await Charity.find({ featured: true }).limit(5);
    res.json({ success: true, data: charities });
  } catch (error) { next(error); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ slug: req.params.slug });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: charity });
  } catch (error) { next(error); }
};

exports.createCharity = async (req, res, next) => {
  try {
    const { name, description, website, category, featured, images, upcomingEvents } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const charity = await Charity.create({ name, slug, description, website, category, featured, images, upcomingEvents });
    res.status(201).json({ success: true, data: charity });
  } catch (error) { next(error); }
};

exports.updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: charity });
  } catch (error) { next(error); }
};

exports.deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found', code: 'NOT_FOUND' });
    res.json({ success: true, message: 'Charity deleted' });
  } catch (error) { next(error); }
};
