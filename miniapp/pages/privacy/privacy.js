// pages/privacy/privacy.js
const tracker = require('../../utils/tracker.js');

Page({
  data: {},

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/privacy/privacy' });
  }
});