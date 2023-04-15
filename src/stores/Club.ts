import { Instance, types } from 'mobx-state-tree';

export const ClubMember = types.model('ClubMember', {
  uid: types.string,
  approved: types.boolean,
  rejected: types.maybeNull(types.string),
});

export const Club = types.model('Club', {
  id: types.string,
  name: types.string,
  description: types.string,
  president: types.string,
  members: types.array(ClubMember),
});

export interface IClub extends Instance<typeof Club> {}
export interface IClubMember extends Instance<typeof ClubMember> {}
