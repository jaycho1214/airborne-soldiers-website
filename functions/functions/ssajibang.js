const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

exports.pickApplicants = functions.pubsub
  .schedule('56 20 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    const app = admin.initializeApp();
    const now = moment().utcOffset('+09:00');
    const year = now.year();
    const month = now.month();
    const day = now.date();
    const history = await app
      .database()
      .ref(`ssajibang/records/${year}-${month}`)
      .get();
    const counts = {};
    if (!history.exists()) return;
    Object.entries(history.val()).forEach(([d, { results }]) => {
      if (results == null) return;
      results.forEach((uid) => {
        if (counts[uid] == null) {
          counts[uid] = 0;
        }
        if (parseInt(d, 10) === day) return;
        counts[uid] += 1;
      });
    });
    const todayApplicants = history.val()[day.toString()]?.applicants ?? [];
    if (todayApplicants.length === 0) return;
    let selected = [];
    if (todayApplicants.length <= 2) {
      selected = todayApplicants;
    } else {
      const todayApplicantsCounts = _.map(todayApplicants, (uid) => ({
        uid,
        count: counts[uid] ?? 0,
      }));
      const sorted = _.sortBy(_.shuffle(todayApplicantsCounts), 'count');
      selected = [sorted[0].uid, sorted[1].uid];
    }
    await app
      .database()
      .ref(`ssajibang/records/${year}-${month}/${day}/results`)
      .set(selected);
  });
