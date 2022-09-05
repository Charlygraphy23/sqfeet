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
    ],

    callbacks: {
      async jwt({ token, account }) {
        if (account?.access_token) {
          token.accessToken = account?.id_token;
        }
        return token;
      },
      async session({ session, token }) {
        // @ts-expect-error
        session.user.userId = token.sub;
        session.accessToken = token.accessToken;
        return session;
      },
      async signIn({ account, profile, user }) {
        await MONGO_DB.connect(res);

        try {
          // @ts-expect-error
          await handleLogin({ account, profile, user });

          await MONGO_DB.disconnect();
          return true;
        } catch (err: any) {
          await MONGO_DB.disconnect();
          ClientError({ message: err?.message, status: 401, res });
          return '/';
        }
      },
    },
    pages: {
      signIn: '/',
      error: '/',
    },

    secret: process.env.AUTH_SECRET,
  });
}
