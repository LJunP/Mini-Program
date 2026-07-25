// pages/agreement/agreement.js
const tracker = require('../../utils/tracker.js');

Page({
  data: {},

  onLoad() {
    tracker.track('page_view', { page_path: 'pages/agreement/agreement' });
  }
});