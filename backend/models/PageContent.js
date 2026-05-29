const mongoose = require('mongoose');

// Stores all editable page content as key-value pairs in MongoDB
// key format: "page__section__field"  e.g. "home__hero__title"
const pageContentSchema = new mongoose.Schema({
  page:    { type: String, required: true },   // home | product | policy | global
  section: { type: String, required: true },   // hero | why | results | reviews | faq ...
  field:   { type: String, required: true },   // title | subtitle | body | cta | stat1 ...
  value:   { type: String, default: '' },
}, { timestamps: true });

pageContentSchema.index({ page: 1, section: 1, field: 1 }, { unique: true });

module.exports = mongoose.model('PageContent', pageContentSchema);