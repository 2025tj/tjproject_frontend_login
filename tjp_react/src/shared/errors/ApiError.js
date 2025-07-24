export class ApiError extends Error {
  constructor({ message, code = 'UNKNOWN_ERROR', timestamp, path, errors = [] }) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.timestamp = timestamp || new Date().toISOString()
    this.path = path || ''
    this.errors = errors // ValidationError[]: { field, message, rejectedValue }
  }
}
