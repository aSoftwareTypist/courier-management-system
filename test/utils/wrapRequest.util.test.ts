import { describe, it, expect, vi } from 'vitest';
import wrapRequestFunction from '../../src/utils/wrapRequest.util.js';
import type { Request, Response, NextFunction } from 'express';

describe('wrapRequest Utility', () => {
  // 1. WHAT ARE WE TESTING?
  // The wrapRequestFunction is designed to catch any errors that happen inside an Express controller
  // and pass them to the "next()" function so the global error handler can deal with them.

  it('should call the original controller function', async () => {
    // We create a "mock" function. A mock is a fake function that lets us track if it was called.
    const mockController = vi.fn();
    
    // We create fake Express request, response, and next objects.
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    // We wrap our fake controller
    const wrapped = wrapRequestFunction(mockController);

    // We execute the wrapped controller
    await wrapped(req, res, next);

    // We EXPECT that our fake controller was actually called by the wrapper!
    expect(mockController).toHaveBeenCalled();
  });

  it('should catch errors and pass them to the next() function', async () => {
    // Here we create a controller that intentionally throws an error
    const errorController = async () => {
      throw new Error('Database exploded!');
    };

    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction; // We track if next() is called

    const wrapped = wrapRequestFunction(errorController);

    // We execute the wrapped controller
    await wrapped(req, res, next);

    // We EXPECT that the wrapper caught the error and called next(error) instead of crashing the server
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Database exploded!');
  });
});
