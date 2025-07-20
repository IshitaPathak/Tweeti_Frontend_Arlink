'use client';

export async function saveXCredentials({
  github_username,
  access_token,
  access_secret,
}: {
  github_username: string;
  access_token: string;
  access_secret: string;
}) {
  const response = await fetch(`https://tweeti-backend.vercel.app/api/save-x-credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      github_username,
      access_token,
      access_secret,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error('Failed to save credentials');
  }

  return { success: true };
}
