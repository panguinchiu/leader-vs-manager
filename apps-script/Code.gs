// 領導人 vs. 經理人 測驗 — 接收作答並寫入試算表
var QUESTION_COUNT = 10;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var dims = ['personality', 'goals', 'work', 'relationship', 'identity'];

    if (sheet.getLastRow() === 0) {
      var headers = ['時間', '姓名', '年級'];
      for (var i = 1; i <= QUESTION_COUNT; i++) headers.push('Q' + i);
      headers = headers.concat(['領導人分數', '經理人分數', '領導人比例(%)']);
      dims.forEach(function (d) { headers.push(d + '_領導人', d + '_經理人'); });
      headers = headers.concat(['結果類型', '結果名稱']);
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }

    var row = [data.timestamp ? new Date(data.timestamp) : new Date(), data.name || '', data.grade || ''];
    var answers = data.answers || [];
    for (var j = 0; j < QUESTION_COUNT; j++) row.push(answers[j] || '');
    row.push(data.leaderScore, data.managerScore, data.leaderPct);
    var ds = data.dimScores || {};
    dims.forEach(function (d) {
      row.push(ds[d] ? ds[d].leader : '', ds[d] ? ds[d].manager : '');
    });
    row.push(data.personaType || '', data.personaTitle || '');
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
