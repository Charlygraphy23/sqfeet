/* eslint-disable no-param-reassign */
import MONGO_DB, { ClientError } from 'config/db.config';
import { handleLogin } from 'database/helper';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.CLIENT_ID ?? '',
        clientSecret: process.env.CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),

      // ...add more providers here
    ],
    callbacks: {
      async signIn({ account, profile, user }) {
        await MONGO_DB.connect(res);

        try {
          // @ts-expect-error
          await handleLogin({ account, profile, user });

          return '/dashboard';
        } catch (err: any) {
          await MONGO_DB.disconnect();
          ClientError({ message: err?.message, status: 401, res });
          return '/';
        }
      },
      async session({ user, session }) {
        // @ts-expect-error
        session.user.id = user.id;
        return session;
      },
    },

    pages: {
      signIn: '/',
      error: '/',
    },
  });
}
