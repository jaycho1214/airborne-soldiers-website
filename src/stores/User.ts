import { Instance, types } from 'mobx-state-tree';

export const Rank = [
  '이병',
  '일병',
  '상병',
  '병장',
  '하사',
  '중사',
  '상사',
  '원사',
  '소위',
  '중위',
  '대위',
  '소령',
  '중령',
];

export const User = types.model('User', {
  uid: types.identifier,
  serviceNumber: types.string,
  unit: types.string,
  rank: types.enumeration('rank', Rank),
  name: types.string,
  verified: types.boolean,
  leader: types.optional(types.boolean, false),
  counselor: types.optional(types.boolean, false),
  chatBanned: types.maybeNull(types.string),
});

export interface IUser extends Instance<typeof User> {}
