import { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment';
import _ from 'underscore';
import { database } from '@/api';
import { get, ref, set } from 'firebase/database';

export default async function pickApplicant(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const now = moment().utcOffset('+09:00');
    const year = now.year();
    const month = now.month();
    const day = now.date();
    const history = await get(
      ref(database, `ssajibang/records/${year}-${month}`),
    );
    const counts = {} as { [uid: string]: number };
    const value = history.val() as { [d: string]: { applicants?: string[] } };
    if (!history.exists()) return res.status(200).end('Empty History');
    Object.entries(value).forEach(([d, { applicants }]) => {
      applicants?.forEach((applicant) => {
        if (counts[applicant] == null) {
          counts[applicant] = 0;
        }
        if (parseInt(d, 10) === day) return;
        counts[applicant] += 1;
      });
    });
    const todayApplicants = value[day.toString()]?.applicants ?? [];
    if (!todayApplicants) return;
    let selected = [];
    if (todayApplicants.length <= 2) {
      selected = todayApplicants;
    } else {
      const todayApplicantsCounts = _.map(todayApplicants, (uid: string) => ({
        uid,
        count: counts?.uid ?? 0,
      }));
      const minCount = _.min(todayApplicantsCounts, 'count')?.count ?? 0;
      const candidates = _.filter(
        todayApplicantsCounts,
        (candidate) => candidate.count == minCount,
      );
      selected = _.sample(candidates, 2).map((candidate) => candidate.uid);
    }
    await set(
      ref(database, `ssajibang/records/${year}-${month}/${day}/results`),
      selected,
    );
    res.status(200).end('Succesfully Set!');
  } catch (e) {
    res.status(500).end(e.toString());
  }
}
