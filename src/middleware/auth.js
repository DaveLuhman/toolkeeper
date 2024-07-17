

import { initAuth } from '@propelauth/express';

const {
    requireUser,
    fetchUserMetadataByUserId,
} = initAuth({
    authUrl: process.env.PROPELAUTH_AUTH_URL,
    apiKey: process.env.PROPELAUTH_API_KEY, 
});
export { requireUser, fetchUserMetadataByUserId };
export async function postPropelAuth(req, res) {
  console.log('postPropelAuth')
  console.log(req.user)
  res.json(req)
}