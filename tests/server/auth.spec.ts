import type { H3Event } from 'h3';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { requireAdminUser } from '~/server/utils/auth';

const mockGetUser = vi.fn();

vi.mock('~/server/utils/supabase', () => ({
  getSupabaseAdminClient: (): { auth: { getUser: typeof mockGetUser } } => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}));

describe('requireAdminUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lève une erreur 401 si le token Authorization est absent', async () => {
    const event = {
      node: {
        req: {
          headers: {},
        },
      },
    } as unknown as H3Event;

    await expect(requireAdminUser(event)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Non authentifié',
    });
  });

  it('lève une erreur 401 si le token est invalide auprès de Supabase', async () => {
    const event = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer invalid-token',
          },
        },
      },
    } as unknown as H3Event;

    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('Token invalide') });

    await expect(requireAdminUser(event)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Session invalide',
    });
  });

  it("lève une erreur 403 si l'utilisateur authentifié n'est pas administrateur", async () => {
    const event = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      },
    } as unknown as H3Event;

    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'random@test.com',
          app_metadata: {},
        },
      },
      error: null,
    });

    await expect(requireAdminUser(event)).rejects.toMatchObject({
      statusCode: 403,
      statusMessage: 'Accès interdit : privilèges administrateur requis',
    });
  });

  it("autorise l'accès si l'email fait partie de la liste blanche administrateur", async () => {
    const event = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      },
    } as unknown as H3Event;

    const adminUser = {
      id: 'admin-123',
      email: 'plaumond@yahoo.fr',
      app_metadata: {},
    };

    mockGetUser.mockResolvedValue({
      data: { user: adminUser },
      error: null,
    });

    const result = await requireAdminUser(event);
    expect(result).toEqual(adminUser);
  });

  it("autorise l'accès si app_metadata contient le rôle admin", async () => {
    const event = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      },
    } as unknown as H3Event;

    const roleAdminUser = {
      id: 'admin-456',
      email: 'otheradmin@domain.com',
      app_metadata: { role: 'admin' },
    };

    mockGetUser.mockResolvedValue({
      data: { user: roleAdminUser },
      error: null,
    });

    const result = await requireAdminUser(event);
    expect(result).toEqual(roleAdminUser);
  });
});
