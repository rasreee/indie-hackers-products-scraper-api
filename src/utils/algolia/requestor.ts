import { MethodType } from './types';

export type Response = {
  /**
   * The raw response from the server.
   */
  content: string;

  /**
   * If the request timeouted.
   */
  isTimedOut: boolean;

  /**
   * The http status code.
   */
  status: number;
};

export type Request = {
  /**
   * The headers of the request.
   */
  readonly headers: Readonly<Record<string, string>>;

  /**
   * The method of the request. `GET`, etc.
   */
  readonly method: MethodType;

  /**
   * The complete url of the request, with the protocol.
   */
  readonly url: string;

  /**
   * The timeout to stablish a connection with the server.
   */
  readonly connectTimeout: number;

  /**
   * The timeout to receive the response.
   */
  readonly responseTimeout: number;

  /**
   * The data to be transfered to the server.
   */
  readonly data: string | undefined;
};

export type Requester = {
  /**
   * Sends the given `request` to the server.
   */
  readonly send: (request: Request) => Readonly<Promise<Response>>;
};
