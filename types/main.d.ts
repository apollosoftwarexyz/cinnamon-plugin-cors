import Cinnamon, { CinnamonPlugin, CinnamonWebServerModulePlugin } from "@apollosoftwarexyz/cinnamon";
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
export declare class CinnamonCors extends CinnamonPlugin implements CinnamonWebServerModulePlugin {
    private options;
    constructor(framework: Cinnamon, options?: CinnamonCorsOptions);
    /**
     * Checks if the 'dev mode override' is applicable; if ignoreDevMode is not
     * set AND the framework is in development mode, we can automatically set
     * all the cross-origin policies to lenient values.
     */
    private get devModeOverride();
    onInitialize(): Promise<boolean>;
    beforeRegisterControllers(): Promise<void>;
}
