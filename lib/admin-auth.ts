/* eslint-disable @typescript-eslint/no-explicit-any */

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminAc } from "better-auth/plugins/admin/access";

export async function requireAdmin() {
  const reqHeaders = await headers();
  const sessionResult = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionResult) {
    redirect('/signin');
  }

  const userPermissions = await auth.api.userHasPermission({
    body: {
      userId: sessionResult.session.userId,
      permissions: adminAc.statements as any
    },
  });

  if (!userPermissions.success) {
    redirect('/posts'); // Redirect to posts listing page
  }

  return sessionResult.session;
}

export async function checkIsAdmin() {
  const reqHeaders = await headers();
  const sessionResult = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionResult) {
    return false;
  }

  const userPermissions = await auth.api.userHasPermission({
    body: {
      userId: sessionResult.session.userId,
      permissions: adminAc.statements as any
    },
  });

  return userPermissions.success;
}
