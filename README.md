# cinnamon-plugin-cors
A Cinnamon plugin that simplifies setting Cross-Origin-Resource-Sharing (CORS)
policies.

**By default**, this makes no change *in production mode* and sets the
following defaults on all requests *in development mode*:
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: *
Access-Control-Expose-Headers: *
```

See the [configuration](#configuration) section for more information on
customizing this behavior.

## Installation
1. `yarn add @apollosoftwarexyz/cinnamon-plugin-cors`
2. Update your Cinnamon project's `src/main.ts` to include the plugin in the
   `load` hook:
```ts
import { CinnamonCors } from '@apollosoftwarexyz/cinnamon-plugin-cors';

// ...

await Cinnamon.initialize({
    async load(framework) {
        // Sets lenient CORS policies for development mode.
        framework.use(new CinnamonCors(framework));
    }
});

// ...
```

## Configuration

For greater control over the cross-origin policy, you can specify options to
the constructor:

```ts
// ...

        framework.use(new CinnamonCors(framework, {
          // Your options go here.
        }));

// ...
```

If you want to use the development CORS policies in production mode too, you
can use the following configuration:

```ts
// ...

        framework.use(new CinnamonCors(framework, {
          allowCredentials: true,
          allowOrigins: 'any',
          allowHeaders: 'any',
          allowMethods: 'any',
          exposeHeaders: 'any'
        }));

// ...
```

### Options

| Name               | Description                                                  | Possible Values                                              | Default Value                           |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| `allowCredentials` | This option is used to control Cinnamon's default handling of the [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) header in responses.<br />Per MDN: this header is used to tell browsers whether to expose the response to front-end JavaScript code when the request's credentials mode (`Request.credentials`) is `'include'` – in which case, browswers only expose the response if the value of the `Access-Control-Allow-Credentials` header is set to true.<br /><br />If set, this option must be set to true. If you do not need credentials, simply do not set this option which will cause it to be omitted. | `true` or not set.                                           | **Prod:** Not set.<br />**Dev:** `true` |
| `allowOrigins`     | This option is used to control Cinnamon's default handling of the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) header in responses.<br />Per MDN: this response header is used to indicate to the browser whether the response can be shared with requesting code from the given origin.<br /><br />If set to `'*' ` or `‘any'`, `Access-Control-Allow-Origin: *` will be returned in responses.<br />If set to an array with a single value, that single value will be set for all responses.<br />If set to an array, the request origin (as set by the `Origin` request header, falling back to the `Host` request header) will be checked to see if one matches, if a request origin matches, the `Access-Control-Allow-Origin` response header will be set to the request origin. | `"*"` or `"any"` or <br />an array of one or more strings<br />or not set | **Prod:** Not set.<br />**Dev:** `*`    |
| `allowHeaders`     | This option is used to control Cinnamon's default handling of the [`Access-Control-Allow-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) header in responses.<br />Per MDN: this header is used in response to a preflight request which includes `Access-Control-Request-Headers` to indicate which HTTP headers are permitted during the actual request.<br /><br />If set to `'*' ` or `‘any'`, `Access-Control-Allow-Headers: *` will be returned in responses.<br />If set to an array, the comma-separated list of values will be returned for `Access-Control-Allow-Headers` instead. | `"*"` or `"any"`<br />or an array of strings<br />or not set | **Prod:** Not set.<br />**Dev:** `*`    |
| `allowMethods`     | This option is used to control Cinnamon's default handling of the [`Access-Control-Allow-Methods`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) header in responses.<br />Per MDN: this header is used in response to a preflight request to indicate which methods are permitted during the actual request.<br /><br />If set to `'*' ` or `‘any'`, `Access-Control-Allow-Methods: *` will be returned in responses.<br />If set to an array, the comma-separated list of values will be returned for `Access-Control-Allow-Methods` instead. | `"*"` or `"any"`<br />or an array of strings<br />or not set | **Prod:** Not set.<br />**Dev:** `*`    |
| `exposeHeaders`    | This option is used to control Cinnamon's default handling of the [`Access-Control-Expose-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) header in responses.<br />Per MDN: this header is used to allow a server to indicate which response headers should be made available to scripts running in the browser, in response to a cross-origin request.<br /><br />If set to `'*' ` or `‘any'`, `Access-Control-Expose-Headers: *` will be returned in responses.<br />If set to an array, the comma-separated list of values will be returned for `Access-Control-Expose-Headers` instead. | `"*"` or `"any"`<br />or an array of strings<br />or not set | **Prod:** Not set.<br />**Dev:** `*`    |
| `ignoreDevMode`    | If set to `true`, the Cinnamon CORS plugin will ignore the framework’s environment, enforcing the CORS policy for all environments.<br />Otherwise (if set to `false`, or not set), Cinnamon sets lenient defaults for development mode. (See above.) | `true`, `false`                                              | `false`                                 |



## License

[MIT License](./LICENSE)
