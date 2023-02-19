// Create a new DirectoryTree from a path

export type DirectoryTree = FileNodeDt | DirectoryNodeDt;

type FileNodeDt = {
	path: string;
	name: string;
	extension: string;
};

type DirectoryNodeDt = {
	path: string;
	name: string;
	children: DirectoryTree;
};

export function createDt(path: string): DirectoryTree {
	// TODO: Implement
	return {} as DirectoryTree;
}
