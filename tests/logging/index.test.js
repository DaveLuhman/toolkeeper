import winston from 'winston';

import { Log } from '../../models/index.models.js';
import { getLogsByTenant } from '../../logging/index';

jest.mock('winston');
jest.mock('winston-mongodb');
jest.mock(Log);

describe('getLogsByTenant', () => {
  it('should expose a function', () => {
		expect(getLogsByTenant).toBeDefined();
	});

  it('getLogsByTenant should return expected output', async () => {
    const retValue = await getLogsByTenant(tenantId);
    expect(retValue).toBeTruthy();
  });
});