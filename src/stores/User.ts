import { Instance, types } from 'mobx-state-tree';

export const User = types.model('User', {
  uid: types.identifier,
  unit: types.string,
  name: types.string,
  verified: types.string,
});

export interface IUser extends Instance<typeof User> {}
