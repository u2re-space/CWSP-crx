import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import tls from "node:tls";

export const defaultFolder = "local";

export const domainToFolderMapping = {
    "localhost": "local",
    "127.0.0.1": "local",
    "::1": "local",
    "45.147.121.152": "local",
    "2a06:1301:4210:10dc:792f:77a2:5c70:34e3": "local",
    "192.168.0.1": "local",
    "192.168.0.100": "local",
    "192.168.0.110": "local",
    "192.168.0.196": "local",
    "192.168.0.200": "local",
    "192.168.0.208": "local",
    "devbox.localroute": "devbox"
};

export const normalizeDomain = (value) => {
    if (!value || typeof value !== "string") {
        return "";
    }

    let domain = value.trim().toLowerCase();
    if (!domain || domain === "0.0.0.0" || domain === "::") {
        return "";
    }

    if (domain.startsWith("[")) {
        const end = domain.indexOf("]");
        domain = end === -1 ? domain.slice(1) : domain.slice(1, end);
        return domain;
    }

    const lastColon = domain.lastIndexOf(":");
    if (lastColon > 0 && domain.indexOf(":") === lastColon) {
        return domain.slice(0, lastColon);
    }

    return domain;
};

export const resolveFolderForDomain = (
    domain,
    mapping = domainToFolderMapping,
    fallback = defaultFolder
) => {
    const normalized = normalizeDomain(domain);
    if (!normalized) {
        return fallback;
    }

    return mapping[normalized] ?? fallback;
};

export const resolveDevDomain = (env = process.env) => {
    const explicit = env.SALON_HTTPS_DOMAIN ?? env.VITE_HMR_HOST;
    const normalized = normalizeDomain(explicit ?? "");
    if (normalized) {
        return normalized;
    }

    return normalizeDomain(os.hostname()) || "localhost";
};

const probeDirectory = async (dirList, subpath = "", testFile = "rootCA.crt") => {
    for (const dir of dirList) {
        try {
            const candidate = path.resolve(import.meta.dirname, dir, subpath, testFile);
            await fs.stat(candidate);
            return path.resolve(import.meta.dirname, dir);
        } catch {
            continue;
        }
    }

    return path.resolve(import.meta.dirname, dirList[0]);
};

const httpsRoot = await probeDirectory([
    "./",
    "./https/",
    "../https/"
], "local/");

const loadTextFile = async (filePath) => {
    const bytes = await fs.readFile(filePath);
    return new TextDecoder().decode(bytes);
};

const resolveFolderDir = async (folder) => {
    const candidates = [
        path.resolve(httpsRoot, folder),
        path.resolve(httpsRoot, "private", folder)
    ];

    for (const candidate of candidates) {
        try {
            await fs.stat(path.join(candidate, "multi.crt"));
            return candidate;
        } catch {
            continue;
        }
    }

    return path.resolve(httpsRoot, folder);
};

const loadCertificateBundle = async (folder) => {
    const folderDir = await resolveFolderDir(folder);
    const readFromFolder = async (name) => loadTextFile(path.resolve(folderDir, name));

    let ca;
    try {
        ca = await readFromFolder("rootCA.crt");
    } catch {
        const localDir = await resolveFolderDir(defaultFolder);
        ca = await loadTextFile(path.resolve(localDir, "rootCA.crt"));
    }

    const [key, cert] = await Promise.all([
        readFromFolder("multi.key"),
        readFromFolder("multi.crt")
    ]);

    return { ca, key, cert, folder, folderDir };
};

const uniqueFolders = [...new Set([defaultFolder, ...Object.values(domainToFolderMapping)])];
const bundlesByFolder = Object.fromEntries(
    await Promise.all(uniqueFolders.map(async (folder) => [folder, await loadCertificateBundle(folder)]))
);

const contextsByFolder = Object.fromEntries(
    Object.entries(bundlesByFolder).map(([folder, bundle]) => [
        folder,
        tls.createSecureContext({
            key: bundle.key,
            cert: bundle.cert,
            ca: bundle.ca
        })
    ])
);

const resolveSecureContext = (servername) => {
    const folder = resolveFolderForDomain(servername);
    return contextsByFolder[folder] ?? contextsByFolder[defaultFolder];
};

export const activeDomain = resolveDevDomain(process.env);
export const activeFolder = resolveFolderForDomain(activeDomain);
export const activeBundle = bundlesByFolder[activeFolder];

export const resolveRootCaRelativePath = (domain) => {
    const folder = resolveFolderForDomain(domain);
    return `https/${folder}/rootCA.crt`;
};

export const createHttpsServerOptions = ({ domain } = {}) => {
    const folder = resolveFolderForDomain(domain ?? resolveDevDomain(process.env));
    const bundle = bundlesByFolder[folder];

    return {
        key: bundle.key,
        cert: bundle.cert,
        ca: bundle.ca,
        SNICallback: (servername, callback) => {
            try {
                callback(null, resolveSecureContext(servername));
            } catch (error) {
                callback(error instanceof Error ? error : new Error(String(error)));
            }
        }
    };
};

export default createHttpsServerOptions();
