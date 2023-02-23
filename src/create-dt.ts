// Create a new DirectoryTree from a path

import { createTree } from './tree';

type DirectoryTree = FileNodeDt | DirectoryNodeDt;

type FileNodeDt = {
	path: string;
	name: string;
	type: 'file';
	extension: string;
};

type DirectoryNodeDt = {
	path: string;
	name: string;
	type: 'directory';
	children: DirectoryTree[];
};

class InvalidPathError extends Error {
	constructor(path: string) {
		super(`Invalid path ${path}`);
	}
}

export function createDt(path: string): DirectoryTree {
	const tree = createTree(path);
	if (!tree) {
		throw new InvalidPathError(path);
	}
	return {
		path: tree.path,
		name: tree.name,
		...(tree.type === 'file'
			? { type: 'file', extension: tree.extension ?? '' }
			: {
					type: 'directory',
					children: tree.children?.map((child) => createDt(child.path)) ?? [],
			  }),
	};
}
