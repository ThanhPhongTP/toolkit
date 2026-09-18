export interface HttpStatusEntry {
  code: number
  text: string
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
  description: string
}

const RAW_STATUSES: [number, string, string][] = [
  [100, 'Continue', 'The initial part of a request has been received and the client should continue.'],
  [101, 'Switching Protocols', 'The server is switching protocols as requested by the client.'],
  [102, 'Processing', 'The server has received and is processing the request, but no response is available yet.'],
  [200, 'OK', 'The request has succeeded.'],
  [201, 'Created', 'The request has succeeded and a new resource has been created.'],
  [202, 'Accepted', 'The request has been accepted for processing, but processing is not complete.'],
  [204, 'No Content', 'The server successfully processed the request and is not returning any content.'],
  [206, 'Partial Content', 'The server is delivering only part of the resource due to a range header.'],
  [300, 'Multiple Choices', 'The request has more than one possible response.'],
  [301, 'Moved Permanently', 'The resource has been permanently moved to a new URL.'],
  [302, 'Found', 'The resource resides temporarily under a different URL.'],
  [304, 'Not Modified', 'The resource has not been modified since the last request.'],
  [307, 'Temporary Redirect', 'The request should be repeated with another URL, keeping the method.'],
  [308, 'Permanent Redirect', 'The resource has permanently moved, keeping the method for the retry.'],
  [400, 'Bad Request', 'The server cannot process the request due to a client error.'],
  [401, 'Unauthorized', 'Authentication is required and has failed or not been provided.'],
  [403, 'Forbidden', 'The client does not have access rights to the content.'],
  [404, 'Not Found', 'The server cannot find the requested resource.'],
  [405, 'Method Not Allowed', 'The request method is known but not supported by the target resource.'],
  [408, 'Request Timeout', 'The server timed out waiting for the request.'],
  [409, 'Conflict', 'The request conflicts with the current state of the target resource.'],
  [410, 'Gone', 'The requested resource is no longer available and will not be available again.'],
  [415, 'Unsupported Media Type', 'The media format of the requested data is not supported.'],
  [422, 'Unprocessable Entity', 'The request was well-formed but contains semantic errors.'],
  [429, 'Too Many Requests', 'The user has sent too many requests in a given amount of time.'],
  [500, 'Internal Server Error', 'The server encountered an unexpected condition.'],
  [501, 'Not Implemented', 'The server does not support the functionality required.'],
  [502, 'Bad Gateway', 'The server received an invalid response from an upstream server.'],
  [503, 'Service Unavailable', 'The server is not ready to handle the request.'],
  [504, 'Gateway Timeout', 'The server did not get a response in time from an upstream server.'],
]

function categoryOf(code: number): HttpStatusEntry['category'] {
  return `${Math.floor(code / 100)}xx` as HttpStatusEntry['category']
}

export const HTTP_STATUS_CODES: HttpStatusEntry[] = RAW_STATUSES.map(([code, text, description]) => ({
  code,
  text,
  description,
  category: categoryOf(code),
}))

export function findHttpStatus(code: number): HttpStatusEntry | undefined {
  return HTTP_STATUS_CODES.find((entry) => entry.code === code)
}

export function searchHttpStatuses(query: string): HttpStatusEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return HTTP_STATUS_CODES
  return HTTP_STATUS_CODES.filter(
    (entry) => entry.code.toString().includes(q) || entry.text.toLowerCase().includes(q),
  )
}
