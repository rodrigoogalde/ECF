export class CRUDError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'CRUDError'
  }
}

export class NotFoundError extends CRUDError {
  constructor(modelName: string, identifier?: string | number) {
    const message = identifier 
      ? `${modelName} with identifier ${identifier} not found`
      : `${modelName} not found`
    super(message, 404, 'NOT_FOUND')
  }
}

export class UniqueConstraintError extends CRUDError {
  constructor(modelName: string, field?: string) {
    const message = field 
      ? `${modelName} unique constraint violated on field: ${field}`
      : `${modelName} unique constraint violated`
    super(message, 400, 'UNIQUE_CONSTRAINT_VIOLATION')
  }
}