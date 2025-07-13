// app/actions/saveGithubCredentials.ts
'use client';

export async function saveGithubCredentials({
  github_username,
  access_token,
  access_secret,
}: {
  github_username: string;
  access_token: string;
  access_secret: string;
}): Promise<{ userId: number }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-x-credentials`, {
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

  if (!response.ok) {
    throw new Error('Failed to save credentials');
  }

  const data = await response.json();
  return data;
}
