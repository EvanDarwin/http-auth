import EventEmitter = NodeJS.EventEmitter;
import * as express from "express";
import * as koa from "koa";
import * as passport from "passport";
import * as hapi from "hapi";

declare module "http-auth" {
    interface HttpAuth {
        basic: (options: HttpAuthOptions, checker: HttpAuthCallback) => any;

        digest: (options: HttpAuthOptions, checker: HttpAuthCallback) => any;

        connect: (auth: HttpAuthBasic | HttpAuthDigest) => express.RequestHandler;

        koa: (auth: HttpAuthBasic | HttpAuthDigest) => koa.Middleware;

        passport: (auth: HttpAuthBasic | HttpAuthDigest) => passport.Strategy;

        hapi: () => hapi.Plugin<any>;
    }

    export interface HttpAuthBase extends EventEmitter {
        constructor(options: HttpAuthOptions, checker: HttpAuthCallback);

        processLine(userLine: string): void;

        parseAuthorization(header: string): string;

        ask(res: express.Response, result: any): express.Response;

        check(req: express.Request, res: express.Response, callback): any;

        isAuthenticated(req, callback): any;

        loadUsers(): any;
    }

    export interface HttpAuthBasic extends HttpAuthBase {
        validate(hash, password): boolean;

        generateHeader(): string;

        findUser(req: express.Request, hash: string, callback: HttpAuthCallback): void;
    }

    export interface HttpAuthDigest extends HttpAuthBase {
        validate(ha2: string, config: HttpAuthOptions, hash: string): boolean;

        findUser(req: express.Request, clientOptions: HttpAuthOptions, callback: HttpAuthCallback): void;

        removeNonces(noncesToRemove: string[]): void;

        validateNonce(nonce: string, qop?: boolean, nc?: string): void;

        askNonce(): string;

        generateHeader(result: { stale: boolean }): string;
    }

    export interface HttpAuthOptions {
        msg401?: string;
        msg407?: string;
        contentType?: string;
        realm?: string;
        file?: string;
        algorithm?: "MD5" | "MD5-sess";
        qop?: "auth" | "none";
        skipUser?: boolean;
    }

    export type HttpAuthCallback = (username: string, password: string, callback: (res: boolean) => void) => void;

    export default HttpAuth;
}
