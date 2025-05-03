/**
 * A custom error class for Fetch API
 */
export class FetchError extends Error {
  code?: string
  status?: number
  response?: Response
  data?: any
  request?: Request

  constructor({
    message,
    code,
    status,
    response,
    request,
  }: {
    message: string
    code?: string
    status?: number
    response?: Response
    request?: Request
  }) {
    super(message)
    this.name = 'FetchError'
    this.code = code
    this.status = status
    this.response = response
    this.request = request

    // Ensure that instanceof works correctly
    Object.setPrototypeOf(this, FetchError.prototype)
  }

  /**
   * Create a FetchError from a Response object
   */
  static fromResponse(response: Response, request?: Request): FetchError {
    return new FetchError({
      message: `Request failed with status code ${response.status}`,
      code: `ERR_STATUS_${response.status}`,
      status: response.status,
      response,
      request,
    })
  }

  /**
   * Create a network error
   */
  static networkError(error: Error, request?: Request): FetchError {
    return new FetchError({
      message: error.message || 'Network Error',
      code: 'ERR_NETWORK',
      request,
    })
  }

  /**
   * Create a timeout error
   */
  static timeoutError(request?: Request): FetchError {
    return new FetchError({
      message: 'Request timeout',
      code: 'ERR_TIMEOUT',
      request,
    })
  }

  /**
   * Check if an error is a FetchError
   */
  static isFetchError(error: unknown): error is FetchError {
    return error instanceof FetchError
  }

  static isHttpError(error: unknown, statusCode: number): boolean {
    return FetchError.isFetchError(error) && error.status === statusCode
  }

  /**
   * Helper to check if an error is a client error (4xx)
   */
  static isClientError(error: unknown): boolean {
    return (
      FetchError.isFetchError(error) &&
      error.status !== undefined &&
      error.status >= 400 &&
      error.status < 500
    )
  }

  /**
   * Helper to check if an error is a server error (5xx)
   */
  static isServerError(error: unknown): boolean {
    return (
      FetchError.isFetchError(error) &&
      error.status !== undefined &&
      error.status >= 500 &&
      error.status < 600
    )
  }

  /**
   * Helper to check if an error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    return FetchError.isFetchError(error) && error.code === 'ERR_NETWORK'
  }
}
