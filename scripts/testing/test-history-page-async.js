const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

async function main() {
  let definition;
  const pending = [];
  const history = {
    getHistoryList: () => new Promise(resolve => pending.push(resolve)),
    getRecordKey: item => `${item.domain}_${item.refId}`,
  };
  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,
    '../../miniapp/pages/history/history.js'), 'utf8'), {
    Page: value => { definition = value; },
    require: name => name.endsWith('/history.js') ? history : {},
  });
  const page = { ...definition, data: {}, setData(value) { Object.assign(this.data, value); } };
  const first = page._loadHistory();
  assert.strictEqual(page.data.historyList, undefined);
  pending.shift()([{ domain: 'tea', refId: 'tea_001', name: '测试记录' }]);
  await first;
  assert.strictEqual(page.data.totalCount, 1);
  assert.strictEqual(page.data.historyList[0].key, 'tea_tea_001');

  const stale = page._loadHistory();
  const current = page._loadHistory();
  const resolveStale = pending.shift();
  pending.shift()([]);
  await current;
  resolveStale([{ domain: 'tea', refId: 'old' }]);
  await stale;
  assert.strictEqual(page.data.totalCount, 0);

  const unloaded = page._loadHistory();
  page.onUnload();
  pending.shift()([{ domain: 'tea', refId: 'late' }]);
  await unloaded;
  assert.strictEqual(page.data.totalCount, 0);
  console.log('History page async tests: 3 flows passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
