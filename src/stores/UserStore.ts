import { Instance, types } from 'mobx-state-tree';
import { IUser, User } from './User';

export const UserStore = types
  .model('User', {
    user: types.maybeNull(User),
    loading: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setLoading(value: boolean) {
      self.loading = value;
    },
    updateUser(newUser: IUser | null) {
      self.user = newUser;
    },
  }))
  .create({});

export interface IUserStore extends Instance<typeof UserStore> {}
