// Create a FileSystemTree from the given path

import { Stats } from 'node:fs';
import fs from 'node:fs/promises';
import _path from 'node:path';
import typeUtils from 'node:util/types';

import type { FileSystemTree } from '@webcontainer/api';
import { isText } from 'istextorbinary';

export async function createFst(
	path: string,
	childrenOnly = true,
): Promise<FileSystemTree> {
	const name = _path.basename(path);

	let stats: Stats;
	try {
		stats = await fs.stat(path);
	} catch (e) {
		return {};
	}

	if (stats.isFile()) {
		const contents = await readFile(path);
		return {
			[name]: {
				file: {
					contents,
				},
			},
		};
	} else if (stats.isDirectory()) {
		const dirContents = await readDir(path);
		const children = await dirContents.reduce(
			async (acc, child) => ({
				...(await acc),
				...(await createFst(_path.join(path, child), false)),
			}),
			Promise.resolve({}),
		);
		return childrenOnly
			? children
			: {
					[name]: {
						directory: children,
					},
			  };
	} else {
		// TODO: Handle symlinks
		return {};
	}
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return typeUtils.isNativeError(error);
}

async function readDir(path: string): Promise<string[]> {
	try {
		return await fs.readdir(path);
	} catch (err: unknown) {
		if (isNodeError(err) && (err.code == 'EACCES' || err.code == 'EPERM')) {
			return [];
		} else {
			throw err;
		}
	}
}

async function readFile(path: string): Promise<string | Uint8Array> {
	const fileData = await fs.readFile(path);
	if (isText(path, fileData)) {
		return fileData.toString('utf-8');
	} else {
		return new Uint8Array(fileData);
	}
}
