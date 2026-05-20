import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Public Tracking API integration tests', () => {
  it('GET /tracking should return 200 and render the track parcel form', async () => {
    const res = await request(app).get('/tracking');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Track Parcel');
    expect(res.text).toContain('Parcel Tracker');
  });

  it('POST /tracking with empty tracking number should show validation error', async () => {
    const res = await request(app)
      .post('/tracking')
      .send({ trackingNumber: '' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Please enter a tracking number.');
  });

  it('POST /tracking with invalid/non-existent tracking number should show 404 error view message', async () => {
    const res = await request(app)
      .post('/tracking')
      .send({ trackingNumber: 'INVALID-TRACK-NUMBER-123' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('No parcel found with tracking number');
  });
});
