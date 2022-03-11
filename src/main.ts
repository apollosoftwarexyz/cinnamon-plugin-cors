import Cinnamon, {
    CinnamonPlugin,
    CinnamonWebServerModulePlugin,
    WebServer,
} from "@apollosoftwarexyz/cinnamon";

/**
 * Defines the possible options that may be passed to the CinnamonCors plugin.
 */
export interface CinnamonCorsOptions {
    /**
     * This option is used to control Cinnamon's default handling of the
     * Access-Control-Allow-Credentials header in responses.
     *
     * Per MDN: this header is used to tell browsers whether to expose the
     * response to front-end JavaScript code when the request's credentials
     * mode (Request.credentials) is 'include' – in which case, browswers only
     * expose the response if the value of the Access-Control-Allow-Credentials
     * header is set to true.
     *
     * If set, this option must be set to true. If you do not need credentials,
     * simply do not set this option which will cause it to be omitted.
     */
    allowCredentials?: true;

    /**
     * This option is used to control Cinnamon's default handling of the
     * Access-Control-Allow-Origin header in responses.
     *
     * Per MDN: this response header is used to indicate to the browser whether
     * the response can be shared with requesting code from the given origin.
     *
     * If set to '*' or 'any', this will result in the
     * "Access-Control-Allow-Origin: *" header being returned in responses.
     *
     * Otherwise, if set to an array with one element, that element will be
     * set for all responses.
     *
     * If set to multiple origins, the request origin will be checked to see
     * if one matches, if a request origin matches the
     * Access-Control-Allow-Origin header will be set to that request origin.
     *
     * If omitted or if multiple origins are set and one does not match, the
     * Access-Control-Allow-Origin response header will not be set (unless the
     * framework is in development mode and ignoreDevMode is not set to true.)
     * (This is the default behavior.)
     */
    allowOrigins?: "*" | "any" | string[];

    /**
     * This option is used to control Cinnamon's default handling of the
     * Access-Control-Allow-Headers header in responses.
     *
     * Per MDN: this header is used in response to a preflight request which
     * includes Access-Control-Request-Headers to indicate which HTTP headers
     * are permitted during the actual request.
     *
     * If set to '*' or 'any', this will result in the
     * "Access-Control-Allow-Headers: *" header being returned in responses.
     *
     * Otherwise, the list of headers specified will be returned for the
     * Access-Control-Allow-Headers response header instead.
     *
     * If omitted, the Access-Control-Allow-Headers response header will not
     * be set (unless the framework is in development mode and ignoreDevMode is
     * not set to true). (This is the default behavior.)
     */
    allowHeaders?: "*" | "any" | string[];

    /**
     * This option is used to control Cinnamon's default handling of the
     * Access-Control-Allow-Methods header in responses.
     *
     * Per MDN: this header is used in response to a preflight request to
     * indicate which methods are permitted during the actual request.
     *
     * If set to '*' or 'any', this will result in the
     * "Access-Control-Allow-Methods: *" header being returned in responses.
     *
     * Otherwise, the list of methods specified will be returned for the
     * Access-Control-Allow-Methods response header instead.
     *
     * If omitted, the Access-Control-Allow-Methods response header will not be
     * set (unless the framework is in development mode and ignoreDevMode is
     * not set to true). (This is the default behavior.)
     */
    allowMethods?: "*" | "any" | string[];

    /**
     * This option is used to control Cinnamon's default handling of the
     * Access-Control-Expose-Headers header in responses.
     *
     * Per MDN: this header is used to allow a server to indicate which
     * response headers should be made available to scripts running in the
     * browser, in response to a cross-origin request.
     *
     * By default, only CORS-safelisted response headers are exposed. Other
     * headers must be explicitly whitelisted for clients to be able to access
     * them.
     *
     * If set to '*' or 'any', this will result in the
     * "Access-Control-Expose-Headers: *" header being returned in responses.
     *
     * Otherwise, the list of headers specified will be returned for the
     * Access-Control-Expose-Headers response header instead.
     *
     * If omitted, the Access-Control-Expose-Headers response header will not
     * be set (unless the framework is in development mode and ignoreDevMode is
     * not set to true). (This is the default behavior.)
     */
    exposeHeaders?: "*" | "any" | string[];

    /**
     * If set to true, the Cinnamon CORS plugin will ignore the framework's
     * environment, enforcing the CORS policy for all environments.
     *
     * This value is considered false by default, in which case Cinnamon
     * returns lenient defaults for each of the cross-origin policies.
     */
    ignoreDevMode?: boolean;
}

export class CinnamonCors
    extends CinnamonPlugin
    implements CinnamonWebServerModulePlugin
{
    private options: CinnamonCorsOptions;

    constructor(framework: Cinnamon, options?: CinnamonCorsOptions) {
        super(framework, "xyz.apollosoftware", "cinnamon.cors");

        if (options) {
            this.options = options;

            // If 'ignoreDevMode' has not been explicitly set, we'll initialize
            // it to false.
            if (this.options.ignoreDevMode !== true) {
                this.options.ignoreDevMode = false;
            }
        } else this.options = {
            ignoreDevMode: false,
        };

        // If the origins are set, convert them to lowercase to ensure they are
        // matched correctly.
        if (Array.isArray(this.options.allowOrigins))
            this.options.allowOrigins = this.options.allowOrigins.map(
                origin => origin.toLowerCase()
            );
    }

    /**
     * Checks if the 'dev mode override' is applicable; if ignoreDevMode is not
     * set AND the framework is in development mode, we can automatically set
     * all the cross-origin policies to lenient values.
     */
    private get devModeOverride() : boolean {
        return !this.options.ignoreDevMode && this.framework.inDevMode;
    }

    async onInitialize() {
        return true;
    }

    async beforeRegisterControllers() {
        // If the 'dev mode override' is active, we exit early with lenient
        // values for all the cross-origin policies.
        if (this.devModeOverride) {
            this.framework
                .getModule<WebServer>(WebServer.prototype)
                .server.use(async (ctx, next) => {
                    // For unconventional configurations, such as ones where
                    // you wish to expose the authorization header as well,
                    // you'll need to explictly specify as such by passing an
                    // array with ["*", "Authorization"].

                    // For more information, refer to the relevant
                    // documentation:
                    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers

                    ctx.response.set(
                        "access-control-allow-credentials",
                        "true"
                    );
                    ctx.response.set("access-control-allow-origin", "*");
                    ctx.response.set("access-control-allow-headers", "*");
                    ctx.response.set("access-control-allow-methods", "*");
                    ctx.response.set("access-control-expose-headers", "*");

                    return next();
                });

            return;
        }

        this.framework
            .getModule<WebServer>(WebServer.prototype)
            .server.use(async (ctx, next) => {
                ctx.response.set("access-control-allow-origin", "*");

                if (this.options.allowCredentials) {
                    ctx.response.set(
                        "access-control-allow-credentials",
                        "true"
                    );
                }

                if (this.options.allowOrigins) {
                    if (typeof this.options.allowOrigins === "string" &&
                        ["*", "any"].includes(this.options.allowOrigins)) {
                        ctx.response.set(
                            "access-control-allow-origin",
                            "*"
                        );
                    } else {
                        if (typeof this.options.allowOrigins === "string") {
                            ctx.response.set(
                                "access-control-allow-origin",
                                this.options.allowOrigins
                            );
                        } else {

                            if (Array.isArray(this.options.allowOrigins)) {
                                if (this.options.allowOrigins.length === 1) {
                                    ctx.response.set(
                                        "access-control-allow-origin",
                                        this.options.allowOrigins[0]
                                    );
                                } else if (this.options.allowOrigins.length > 1) {

                                    // Check the request origin.
                                    const requestOrigin = (ctx.request.get('Origin') ?? ctx.request.get('Host')).toLowerCase();
                                    if (this.options.allowOrigins.includes(requestOrigin)) {
                                        // If the request origin is included in
                                        // allowOrigins, add it to the response
                                        // headers.
                                        ctx.response.set(
                                            "access-control-allow-origin",
                                            requestOrigin
                                        );
                                    }

                                }
                            }

                        }
                    }
                }

                if (this.options.allowHeaders) {
                    ctx.response.set(
                        "access-control-allow-headers",
                        // If 'allowHeaders' is a string that is equal to * or
                        // 'any', set the value to *.
                        (typeof this.options.allowHeaders === "string" &&
                            ["*", "any"].includes(this.options.allowHeaders))
                            ? "*"
                            // Otherwise, set it to the specified value of
                            // 'allowHeaders'.
                            : typeof this.options.allowHeaders === "string"
                                // If it's somehow set to a string that is not
                                // 'any' or *, we'll deal with that gracefully.
                                ? this.options.allowHeaders
                                // Otherwise, if 'allowHeaders' is an array,
                                // we'll call.join to 'stringify' it.
                                : this.options.allowHeaders.join(", ")
                    );
                }

                if (this.options.allowMethods) {
                    ctx.response.set(
                        "access-control-allow-methods",
                        // If 'allowMethods' is a string that is equal to * or
                        // 'any', set the value to *.
                        (typeof this.options.allowMethods === "string" &&
                            ["*", "any"].includes(this.options.allowMethods))
                            ? "*"
                            // Otherwise, set it to the specified value of
                            // 'allowMethods'.
                            : typeof this.options.allowMethods === "string"
                                // If it's somehow set to a string that is not
                                // 'any' or *, we'll deal with that gracefully.
                                ? this.options.allowMethods
                                // Otherwise, if 'allowMethods' is an array,
                                // we'll call.join to 'stringify' it.
                                : this.options.allowMethods.join(", ")
                    );
                }

                if (this.options.exposeHeaders) {
                    ctx.response.set(
                        "access-control-expose-headers",
                        // If 'exposeHeaders' is a string that is equal to * or
                        // 'any', set the value to *.
                        typeof this.options.exposeHeaders === "string" &&
                            ["*", "any"].includes(this.options.exposeHeaders)
                            ? "*"
                            : // Otherwise, set it to the specified value of
                            // 'exposeHeaders'.
                            typeof this.options.exposeHeaders === "string"
                            ? // If it's somehow set to a string that is not
                              // 'any' or *, we'll deal with that gracefully.
                              this.options.exposeHeaders
                            : // Otherwise, if 'exposeHeaders' is an array,
                              // we'll call.join to 'stringify' it.
                              this.options.exposeHeaders.join(", ")
                    );
                }

                return next();
            });
    }
}
