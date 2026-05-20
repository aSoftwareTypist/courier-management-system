import { describe, it, expect, vi } from 'vitest';
import { roleMiddleware } from '../../src/middlewares/role.middleware.js';
import type { Request, Response, NextFunction } from 'express';

describe('Role Authorization Middleware', () => {
  it('should redirect to login if the user is not logged in at all', () => {
    // Session is empty (no logged-in user)
    const req = { session: {} } as Request;
    const res = { redirect: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const middleware = roleMiddleware('ADMIN');
    middleware(req, res, next);

    // Verify it redirects and halts further execution
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('should block a STAFF user from accessing an ADMIN-only route', () => {
    // User is logged in as STAFF
    const req = { session: { user: { role: 'STAFF' } } } as unknown as Request;
    const renderMock = vi.fn();
    const res = { 
      status: vi.fn().mockReturnValue({ render: renderMock }) 
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const middleware = roleMiddleware('ADMIN');
    middleware(req, res, next);

    // Verify it blocks with 403 Forbidden and error page
    expect(res.status).toHaveBeenCalledWith(403);
    expect(renderMock).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow an ADMIN user to pass through', () => {
    // User is logged in as ADMIN
    const req = { session: { user: { role: 'ADMIN' } } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = roleMiddleware('ADMIN');
    middleware(req, res, next);

    // Verify it lets the request continue
    expect(next).toHaveBeenCalled();
  });
});
