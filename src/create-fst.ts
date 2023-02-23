// Create a new FileSystemTree from a DirectoryTree

import fs from 'node:fs/promises';

import type { FileSystemTree } from '@webcontainer/api';
import { isText } from 'istextorbinary';

import { createDt } from './create-dt';

export async function createFst(
	path: string,
	childrenOnly = true,
): Promise<FileSystemTree> {
	const dt = createDt(path);

	if (dt.type === 'file') {
		const contents = await readFile(dt.path);
		return {
			[dt.name]: {
				file: {
					contents,
				},
			},
		};
	} else {
		// TODO: Use childrenOnly
		return {
			[dt.name]: {
				directory: await dt.children.reduce(
					async (acc, child) => ({
						...(await acc),
						...(await createFst(child.path)),
					}),
					{} as Promise<FileSystemTree>,
				),
			},
		};
	}
}

async function readFile(path: string): Promise<string | Uint8Array> {
	const fileData = await fs.readFile(path);
	if (await isText(path)) {
		return fileData.toString('utf-8');
	} else {
		return new Uint8Array(fileData);
	}
}
