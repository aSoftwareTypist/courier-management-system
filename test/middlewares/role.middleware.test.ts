import { describe, it, expect, vi } from 'vitest';
import { roleMiddleware } from '../../src/middlewares/role.middleware.js';
import type { Request, Response, NextFunction } from 'express';

describe('Role Authorization Middleware', () => {
  // 1. WHAT ARE WE TESTING?
  // We want to ensure that if a user tries to visit an Admin page (like Settings),
  // they are blocked if they are a STAFF member, and allowed if they are an ADMIN.

  it('should redirect to login if the user is not logged in at all', () => {
    // We create fake Express objects. Notice that `req.session.user` is undefined.
    const req = { session: {} } as Request;
    const res = { redirect: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    // We configure the middleware to only allow ADMINs
    const middleware = roleMiddleware('ADMIN');
    
    // We run it
    middleware(req, res, next);

    // We EXPECT the user to be redirected to the /login page
    expect(res.redirect).toHaveBeenCalledWith('/login');
    // We EXPECT the next function to NOT be called, meaning the request stops here!
    expect(next).not.toHaveBeenCalled();
  });

  it('should block a STAFF user from accessing an ADMIN-only route', () => {
    // This time, the user is logged in, but their role is 'STAFF'
    const req = { session: { user: { role: 'STAFF' } } } as unknown as Request;
    
    // We mock the status and render functions of the response
    const renderMock = vi.fn();
    const res = { 
      status: vi.fn().mockReturnValue({ render: renderMock }) 
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const middleware = roleMiddleware('ADMIN');
    middleware(req, res, next);

    // We EXPECT a 403 Forbidden status
    expect(res.status).toHaveBeenCalledWith(403);
    // We EXPECT the error page to be rendered
    expect(renderMock).toHaveBeenCalled();
    // We EXPECT the request to be stopped (next is not called)
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow an ADMIN user to pass through', () => {
    // User is logged in as 'ADMIN'
    const req = { session: { user: { role: 'ADMIN' } } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = roleMiddleware('ADMIN');
    middleware(req, res, next);

    // We EXPECT the next() function to be called, allowing the user to view the page!
    expect(next).toHaveBeenCalled();
  });
});
