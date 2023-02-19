import { describe, expect, it } from 'vitest';

import { foobar } from '../src/index';

describe('foobar', () => {
	it('should return the correct string', () => {
		expect(foobar()).toBe('foobar');
	});
});
