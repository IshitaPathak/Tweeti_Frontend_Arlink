'use server';

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function saveXCredentials({
  github_username,
  access_token,
  access_secret,
}: {
  github_username: string;
  access_token: string;
  access_secret: string;
}) {
  await sql`
    INSERT INTO x_credentials (
      github_username,
      access_token,
      access_secret,
      created_at
    )
    VALUES (
      ${github_username},
      ${access_token},
      ${access_secret},
      NOW()
    );
  `;

  return { success: true };
}
