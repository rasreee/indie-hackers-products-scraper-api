export type RequestOptions = {
  /**
   * If the given request should persist on the cache. Keep in mind,
   * that some methods may have this option enabled by default.
   */
  readonly cacheable?: boolean;

  /**
   * Custom timeout for the request. Note that, in normal situacions
   * the given timeout will be applied. But the transporter layer may
   * increase this timeout if there is need for it.
   */
  readonly timeout?: number;

  /**
   * Custom headers for the request. This headers are
   * going to be merged the transporter headers.
   */
  readonly headers?: Readonly<Record<string, string>>;

  /**
   * Custom query parameters for the request. This query parameters are
   * going to be merged the transporter query parameters.
   */
  readonly queryParameters?: Record<string, any>;

  /**
   * Custom data for the request. This data are
   * going to be merged the transporter data.
   */
  readonly data?: Record<string, any>;

  /**
   * Additional request body values. It's only taken in
   * consideration in `POST` and `PUT` requests.
   */
  [key: string]: any;
};

import { Logger } from './logger';
import { Requester } from './requestor';

export type Timeouts = {
  /**
   * The timeout to stablish a connection with the server.
   */
  readonly connect: number;

  /**
   * The timeout to receive the response on read requests.
   */
  readonly read: number;

  /**
   * The timeout to receive the response on write requests.
   */
  readonly write: number;
};

export type Headers = Readonly<Record<string, string>>;

export type UserAgentOptions = {
  /**
   * The segment. Usually the integration name.
   */
  readonly segment: string;

  /**
   * The version. Usually the integration version.
   */
  readonly version?: string;
};

export type UserAgent = {
  /**
   * The raw value of the user agent.
   *
   * @readonly
   */
  value: string;

  /**
   * Mutates the current user agent ading the given user agent options.
   */
  readonly add: (options: UserAgentOptions) => UserAgent;
};

export type QueryParameters = Readonly<Record<string, string>>;

export const CallEnum: Readonly<Record<string, CallType>> = {
  /**
   * If the host is read only.
   */
  Read: 1,

  /**
   * If the host is write only.
   */
  Write: 2,

  /**
   * If the host is both read and write.
   */
  Any: 3,
};

export type CallType = 1 | 2 | 3;

export type StatelessHost = {
  /**
   * The protocol of the stateless host. Between `http` and `https`.
   */
  readonly protocol: string;

  /**
   * The url, without protocol.
   */
  readonly url: string;

  /**
   * The type of the host.
   */
  readonly accept: CallType;
};

export type Transporter = {
  /**
   * The cache of the hosts. Usually used to persist
   * the state of the host when its down.
   */
  readonly hostsCache: Cache;

  /**
   * The logger instance to send events of the transporter.
   */
  readonly logger: Logger;

  /**
   * The underlying requester used. Should differ
   * depending of the enviroment where the client
   * will be used.
   */
  readonly requester: Requester;

  /**
   * The cache of the requests. When requests are
   * `cacheable`, the returned promised persists
   * in this cache to shared in similar resquests
   * before being resolved.
   */
  readonly requestsCache: Cache;

  /**
   * The cache of the responses. When requests are
   * `cacheable`, the returned responses persists
   * in this cache to shared in similar resquests.
   */
  readonly responsesCache: Cache;

  /**
   * The timeouts used by the requester. The transporter
   * layer may increase this timeouts as defined on the
   * retry strategy.
   */
  readonly timeouts: Timeouts;

  /**
   * The user agent used. Sent on query parameters.
   */
  readonly userAgent: UserAgent;

  /**
   * The headers used on each request.
   */
  readonly headers: Headers;

  /**
   * The query parameters used on each request.
   */
  readonly queryParameters: QueryParameters;

  /**
   * The hosts used by the retry strategy.
   *
   * @readonly
   */
  hosts: readonly StatelessHost[];

  /**
   * Performs a read request using read hosts.
   */
  readonly read: <TResponse>(request: Request, requestOptions?: RequestOptions) => Readonly<Promise<TResponse>>;

  /**
   * Performs a write request using write hosts.
   */
  readonly write: <TResponse>(request: Request, requestOptions?: RequestOptions) => Readonly<Promise<TResponse>>;
};
