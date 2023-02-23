# webcontainer-fst

webcontainer-fst creates a WebContainer-compatible [FileSystemTree](https://webcontainers.io/api#filesystemtree) from a given path.

Suppose the directory you want to [mount](https://webcontainers.io/api#%E2%96%B8-mount) on WebContainer has the following file structure:

```
src
├── index.js
└── package.json
```

To obtain the FileStructureTree corresponding to this src directory, execute the `createFst` function as follows:

```js
import { createFst } from 'webcontainer-fst';

const fst = await createFst('./src');
console.log(fst);
// Output:
// {
//   "index.js": {
//     "file": {
//       "contents": "import express from 'express';\nconst app = express();\nconst port = 3111;\n\napp.get('/', (req, res) => {\n  res.send('Welcome to a WebContainers app! 🥳');\n});\n\napp.listen(port, () => {\n  console.log(`App is live at http://localhost:${port}`);\n});"
//     }
//   },
//   "package.json": {
//     "file": {
//       "contents": "{\n  \"name\": \"example-app\",\n  \"type\": \"module\",\n  \"dependencies\": {\n    \"express\": \"latest\",\n    \"nodemon\": \"latest\"\n  },\n  \"scripts\": {\n    \"start\": \"nodemon index.js\"\n  }\n}"
//     }
//   }
// }
```

The `fst` variable created here can be mounted directly on a WebContainer instance:

```js
webcontainerInstance = await WebContainer.boot();
await webcontainerInstance.mount(fst);
```

## Installation

```bash
npm install webcontainer-fst
```
