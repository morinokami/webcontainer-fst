import mock from 'mock-fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createFst } from '../src';

describe('createFst', () => {
	beforeEach(() => {
		mock({
			'foo.txt': 'foo',
			dir0: {
				'bar.txt': 'bar',
				dir1: {
					'baz.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
				},
			},
			empty: {},
		});
	});

	afterEach(() => {
		mock.restore();
	});

	it('should create a FileSystemTree from a file path', async () => {
		expect(await createFst('foo.txt')).toEqual({
			'foo.txt': {
				file: {
					contents: 'foo',
				},
			},
		});
	});

	it('should create a FileSystemTree from a directory path', async () => {
		expect(await createFst('dir0', false)).toEqual({
			dir0: {
				directory: {
					'bar.txt': {
						file: {
							contents: 'bar',
						},
					},
					dir1: {
						directory: {
							'baz.png': {
								file: {
									contents: new Uint8Array([8, 6, 7, 5, 3, 0, 9]),
								},
							},
						},
					},
				},
			},
		});
	});

	it('should contain only the contents of a directory if childrenOnly is true', async () => {
		expect(await createFst('dir0')).toEqual({
			'bar.txt': {
				file: {
					contents: 'bar',
				},
			},
			dir1: {
				directory: {
					'baz.png': {
						file: {
							contents: new Uint8Array([8, 6, 7, 5, 3, 0, 9]),
						},
					},
				},
			},
		});
	});

	it('should create a FileSystemTree from an empty directory path', async () => {
		expect(await createFst('empty', false)).toEqual({
			empty: {
				directory: {},
			},
		});
	});
});
