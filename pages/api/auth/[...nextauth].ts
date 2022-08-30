/* eslint-disable no-param-reassign */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  secret: process.env.AUTH_SECRET,
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
      console.log({ account, profile, user });
      // account -> provider
      // account -> type
      // account -> id_token
      // user -> name
      // user -> email
      // user -> image
      // user -> id

      // TODO save details in mongodb with google id
      // ? if user already exists then signin or signup

      return false;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
});
