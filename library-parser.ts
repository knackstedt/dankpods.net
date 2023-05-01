import fs from "fs-extra";
import * as Path from 'path';
import { IAudioMetadata, parseFile } from 'music-metadata';

const getFilesInFolder:
    (folder: string, showHidden: boolean, recurse?: number) => Promise<{
        dirs: {
            contents: any,
            path: string,
            name: string,
            kind: "directory";
        }[],
        files: {
            stats: Partial<fs.Stats>,
            path: string,
            name: string,
            ext: string,
            kind: "file";
        }[];
    }>
    = async (folder: string, showHidden = false, recurse = 2) => {
        if (!folder.endsWith('/')) folder += '/';

        const contents = await fs.readdir(folder, { withFileTypes: true }).catch(e => ([]));

        const dirs = await Promise.all(
            contents.filter(f => f.isDirectory())
                .filter(f => !f.name.startsWith('.'))
                .map(async p => ({
                    contents: recurse - 1 > 0 ? await getFilesInFolder(folder + p.name + '/', showHidden) : null,
                    path: folder,
                    name: p.name,
                    kind: "directory" as "directory"
                }))
        );

        const files = await Promise.all(
            contents.filter(f => f.isFile())
                .filter(f => !f.name.startsWith('.'))
                .map(async p => {
                    let stats = await fs.stat(folder + p.name).catch(e => null);

                    if (!stats) return null;

                    return {
                        stats: {
                            size: stats.size,
                            atimeMs: stats.atimeMs,
                            mtimeMs: stats.mtimeMs,
                            ctimeMs: stats.ctimeMs,
                            birthtimeMs: stats.birthtimeMs
                        },
                        path: folder,
                        name: p.name,
                        ext: p.name.split('.').pop(),
                        kind: "file" as "file"
                    };
                })
        ).then(files => files.filter(e => !!e));

        return { dirs, files };
    };

const getFilesInFolderFlat = async (folder: string, showHidden?: boolean, depth: number = 20) => {
    let structured = await getFilesInFolder(folder, showHidden, depth);

    function r_files({ dirs, files }) {
        return [
            ...dirs.map(d => r_files(d.contents)).flat(),
            ...files
        ];
    }
    return r_files(structured) as {
        stats: Partial<fs.Stats>,
        path: string,
        name: string,
        ext: string,
        kind: "file";
    }[];
};

const scanLibrary = async (dir: string) => {
    const files = await getFilesInFolderFlat(dir);

    let count = 0;
    let dbEntries = [];

    // Iterate through all files.
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const file = f.path + f.name;
        const meta: IAudioMetadata = await parseFile(file).catch(e => (null));
        if (!meta) continue;

        let images = [];
        for (let j = 0; j < meta.common.picture?.length; j++) {
            let picture = meta.common.picture[j];
            const type =
                picture.type?.includes("front") && "front" ||
                picture.type?.includes("back") && "back" ||
                "other";

            let out = file + "_" + type + "." + picture.format.split('/').pop();
            images.push(out.replace(dir, ''));
            await fs.outputFile(out, picture.data);
        }

        const entry = {
            path: f.path.replace(dir, ''),
            name: f.name,
            duration: meta.format.duration,
            images,
            ...meta,
        };

        // Clear out image buffers from native metadata
        Object.keys(entry.native).forEach(nk => {
            entry.native[nk].forEach(e => {
                if (typeof e.value == "object")
                    e.value.data = undefined;
            });
        });

        // Clear normal picture data.
        entry.common.picture?.forEach(p => {
            p.data = undefined;
        });
        entry.quality = undefined;

        dbEntries.push(entry);

        count++;
    }

    return dbEntries;
}

(async () => {
    // Custom JSON replacer to encode buffers as simple objects.
    function replacer(key, value) {
        if (Buffer.isBuffer(value)) return `Buffer[${value.byteLength}]`;
        if (key == "quality") return undefined;
        if (key == "native") return undefined;
        return value;
    }

    const scannedFiles = await scanLibrary(Path.join(__dirname, "src/assets/music"));
    const outData = scannedFiles.map(f => JSON.stringify(f, replacer));

    await fs.outputJson(Path.join(__dirname, "src/assets/library.json"), scannedFiles)

})()
