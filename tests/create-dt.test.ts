import mock from 'mock-fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createDt } from '../src/create-dt';

describe('createDt', () => {
	beforeEach(() => {
		mock({
			'foo.txt': 'foo',
			dir0: {
				'bar.txt': 'bar',
				dir1: {
					'baz.txt': 'baz',
				},
			},
			empty: {},
		});
	});

	afterEach(() => {
		mock.restore();
	});

	it('should create a DirectoryTree from a file path', () => {
		expect(createDt('foo.txt')).toEqual({
			path: 'foo.txt',
			name: 'foo.txt',
			extension: '.txt',
		});
	});

	it('should create a DirectoryTree from a directory path', () => {
		expect(createDt('dir0')).toEqual({
			path: 'dir0',
			name: 'dir0',
			children: [
				{
					path: 'dir0/bar.txt',
					name: 'bar.txt',
					extension: '.txt',
				},
				{
					path: 'dir0/dir1',
					name: 'dir1',
					children: [
						{
							path: 'dir0/dir1/baz.txt',
							name: 'baz.txt',
							extension: '.txt',
						},
					],
				},
			],
		});
	});

	it('should create a DirectoryTree from an empty directory path', () => {
		expect(createDt('empty')).toEqual({
			path: 'empty',
			name: 'empty',
			children: [],
		});
	});

	it('throws an InvalidPathError if the path is invalid', () => {
		expect(() => createDt('invalid')).toThrowError('Invalid path invalid');
	});
});
