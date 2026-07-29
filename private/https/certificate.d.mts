import type { SecureContext } from "node:tls";

export type CertificateBundle = {
    ca: string;
    key: string;
    cert: string;
    folder: string;
    folderDir: string;
};

export type HttpsServerCertificateOptions = {
    ca: string;
    key: string;
    cert: string;
    SNICallback?: (
        servername: string,
        callback: (error: Error | null, context?: SecureContext) => void
    ) => void;
};

export declare const defaultFolder: string;

export declare const domainToFolderMapping: Record<string, string>;

export declare const normalizeDomain: (value: string | undefined) => string;

export declare const resolveFolderForDomain: (
    domain: string | undefined,
    mapping?: Record<string, string>,
    fallback?: string
) => string;

export declare const resolveDevDomain: (env?: NodeJS.ProcessEnv) => string;

export declare const activeDomain: string;

export declare const activeFolder: string;

export declare const activeBundle: CertificateBundle;

export declare const resolveRootCaRelativePath: (domain: string | undefined) => string;

export declare const createHttpsServerOptions: (options?: { domain?: string }) => HttpsServerCertificateOptions;

declare const certificate: HttpsServerCertificateOptions;

export default certificate;
