// Create a directory object
// https://github.com/mihneadb/node-directory-tree

import fs from 'node:fs';
import _path from 'node:path';
import typeUtils from 'node:util/types';

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return typeUtils.isNativeError(error);
}

function safeReadDirSync(path: string) {
	try {
		return fs.readdirSync(path);
	} catch (err: unknown) {
		if (isNodeError(err) && (err.code == 'EACCES' || err.code == 'EPERM')) {
			return null;
		} else {
			throw err;
		}
	}
}

interface Node {
	path: string;
	name: string;
	type: 'directory' | 'file';
	children?: Node[];
	extension?: string;
}

export function createTree(path: string): Node | null {
	const name = _path.basename(path);
	const result: Node = { path, name, type: 'file' };

	let stats: fs.Stats;
	try {
		stats = fs.statSync(path);
	} catch (e) {
		return null;
	}

	if (stats.isFile()) {
		result.extension = _path.extname(path).toLowerCase();
	} else if (stats.isDirectory()) {
		const dir = safeReadDirSync(path);
		if (dir === null) {
			return null;
		}
		result.type = 'directory';
		result.children = dir
			.map((child) => createTree(_path.join(path, child)))
			.filter((dt): dt is Node => !!dt);
	} else {
		// TODO: handle symlinks
		return null;
	}
	return result;
}
