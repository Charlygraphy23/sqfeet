import { UserModel } from 'database/model';

type Account = {
  provider: string;
  expires_at: number;
  refresh_token: string;
  id_token: string;
};
type Profile = {
  email_verfied: boolean;
  name: string;
  given_name: string;
  family_name: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

interface HandleLoginType {
  account: Account;
  profile: Profile;
  user: User;
}

const signUp = (params: HandleLoginType) => {
  const { profile, user, account } = params;

  return UserModel.create({
    firstName: profile?.given_name,
    lastName: profile?.family_name,
    email: user?.email,
    googleId: user?.id,
    loginType: account?.provider,
    profileImage: user?.image,
  });
};

// eslint-disable-next-line import/prefer-default-export
export const handleLogin = async (params: HandleLoginType) => {
  const { user } = params;
  const foundUser = await UserModel._findByGoogleId(user.id);

  if (!foundUser) {
    return signUp(params);
  }
  console.log({ foundUser });
  return foundUser;
};
