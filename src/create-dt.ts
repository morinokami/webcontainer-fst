// Create a new DirectoryTree from a path

import dirTree from 'directory-tree';

type DirectoryTree = FileNodeDt | DirectoryNodeDt;

type FileNodeDt = {
	path: string;
	name: string;
	extension: string;
};

type DirectoryNodeDt = {
	path: string;
	name: string;
	children: DirectoryTree[];
};

class InvalidPathError extends Error {
	constructor(path: string) {
		super(`Invalid path ${path}`);
	}
}

export function createDt(path: string): DirectoryTree {
	const tree = dirTree(path, { attributes: ['type', 'extension'] });
	if (!tree) {
		throw new InvalidPathError(path);
	}
	return {
		path: tree.path,
		name: tree.name,
		...(tree.type === 'file'
			? { extension: tree.extension ?? '' }
			: {
					children: tree.children?.map((child) => createDt(child.path)) ?? [],
			  }),
	};
}
