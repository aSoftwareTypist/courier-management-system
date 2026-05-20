import { describe, it, expect, vi } from 'vitest';
import wrapRequestFunction from '../../src/utils/wrapRequest.util.js';
import type { Request, Response, NextFunction } from 'express';

describe('wrapRequest Utility', () => {
  it('should call the original controller function', async () => {
    // Fake the controller and Express params
    const mockController = vi.fn();
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const wrapped = wrapRequestFunction(mockController);
    await wrapped(req, res, next);

    // Check if the wrapped controller was executed
    expect(mockController).toHaveBeenCalled();
  });

  it('should catch errors and pass them to the next() function', async () => {
    // Controller that always fails
    const errorController = async () => {
      throw new Error('Database exploded!');
    };

    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const wrapped = wrapRequestFunction(errorController);
    await wrapped(req, res, next);

    // Confirm error was caught and sent to Express next handler
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Database exploded!');
  });
});
