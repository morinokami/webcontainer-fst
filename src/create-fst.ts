// Create a new FileSystemTree from a DirectoryTree

import type { FileSystemTree } from '@webcontainer/api';

import { createDt } from './create-dt';

export function createFst(path: string): FileSystemTree {
	const dt = createDt(path);
	// TODO: Implement
	return {};
}
