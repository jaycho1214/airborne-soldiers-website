import { Instance, cast, flow, types } from 'mobx-state-tree';
import { IUser, User } from './User';
import { DataSnapshot, child, get, ref } from 'firebase/database';
import { database } from '@/api';

export const UserStore = types
  .model('User', {
    user: types.maybeNull(User),
    loading: types.optional(types.boolean, true),
    cachedUsers: types.array(User),
  })
  .actions((self) => ({
    setLoading(value: boolean) {
      self.loading = value;
    },
    updateUser(newUser: IUser | null) {
      self.user = newUser;
    },
    fetchUser: flow(function* (uid: string) {
      const cachedRes = self.cachedUsers.find((u) => u.uid === uid);
      if (cachedRes) return cachedRes;
      const snapshot: DataSnapshot = yield get(
        child(ref(database), `users/${uid}`),
      );
      if (snapshot.exists()) {
        const newUser = User.create(snapshot.val());
        self.cachedUsers = cast([...self.cachedUsers, newUser]);
        return newUser;
      }
      return null;
    }),
  }))
  .create({});

export interface IUserStore extends Instance<typeof UserStore> {}
