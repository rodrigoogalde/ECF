/* eslint-disable @typescript-eslint/no-explicit-any */

import { CRUDError, NotFoundError, UniqueConstraintError } from '../errors'

export interface BaseFilter {
  [key: string]: any
}

export interface FilterOperators {
  lt?: any
  lte?: any
  gt?: any
  gte?: any
  contains?: string
  startsWith?: string
  endsWith?: string
  in?: any[]
  notIn?: any[]
  not?: any
}

export interface QueryOptions {
  skip?: number
  take?: number
  orderBy?: any
  include?: any
  select?: any
}

export interface FilterCondition {
  [field: string]: any | FilterOperators
}

export class BaseCRUD<TModel, TCreateInput, TUpdateInput, TWhereInput = any> {
  protected modelName: string
  protected prismaDelegate: any

  constructor(modelName: string, prismaDelegate: any) {
    this.modelName = modelName
    this.prismaDelegate = prismaDelegate
  }

  protected buildWhereConditions(filters: TWhereInput | BaseFilter | any): any {
    const conditions: any = {}

    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) continue

      // Handle operator-based filtering (e.g., age__gt: 18)
      if (key.includes('__')) {
        const [field, operator] = key.split('__')
        
        if (!conditions[field]) {
          conditions[field] = {}
        }

        switch (operator) {
          case 'lt':
            conditions[field].lt = value
            break
          case 'lte':
            conditions[field].lte = value
            break
          case 'gt':
            conditions[field].gt = value
            break
          case 'gte':
            conditions[field].gte = value
            break
          case 'contains':
            conditions[field].contains = value
            break
          case 'startsWith':
            conditions[field].startsWith = value
            break
          case 'endsWith':
            conditions[field].endsWith = value
            break
          case 'in':
            conditions[field].in = Array.isArray(value) ? value : [value]
            break
          case 'notIn':
            conditions[field].notIn = Array.isArray(value) ? value : [value]
            break
          case 'not':
            conditions[field].not = value
            break
          default:
            // If operator not recognized, treat as equality
            conditions[field] = value
        }
      } else {
        // Handle direct field filtering
        if (typeof value === 'string') {
          // For string fields, use case-insensitive contains by default
          conditions[key] = {
            contains: value,
            mode: 'insensitive'
          }
        } else {
          // For non-string fields, use direct equality
          conditions[key] = value
        }
      }
    }

    return conditions
  }

  async getOne(
    whereConditions: TWhereInput | BaseFilter,
    options: Omit<QueryOptions, 'skip' | 'take'> = {}
  ): Promise<TModel> {
    try {
      console.log(`Retrieving one record from ${this.modelName}`)
      
      const where = this.buildWhereConditions(whereConditions)
      
      const record = await this.prismaDelegate.findFirst({
        where,
        include: options.include,
        select: options.select,
        orderBy: options.orderBy
      })

      if (!record) {
        throw new NotFoundError(this.modelName)
      }

      return record
    } catch (error) {
      if (error instanceof CRUDError) {
        throw error
      }
      console.error(`Error retrieving ${this.modelName}:`, error)
      throw new CRUDError(`Error retrieving ${this.modelName}`, 500)
    }
  }

  async getAll(
    whereConditions: TWhereInput | BaseFilter = {},
    options: QueryOptions = {}
  ): Promise<TModel[]> {
    try {
      const {
        skip = 0,
        take,
        orderBy,
        include,
        select
      } = options

      console.log(
        `Retrieving multiple records from ${this.modelName} (skip=${skip}, take=${take})`
      )

      const where = this.buildWhereConditions(whereConditions)

      const records = await this.prismaDelegate.findMany({
        where,
        skip,
        take,
        orderBy,
        include,
        select
      })

      return records
    } catch (error) {
      console.error(`Error retrieving ${this.modelName} records:`, error)
      throw new CRUDError(`Error retrieving ${this.modelName} records`, 500)
    }
  }

  async create(data: TCreateInput, options: Omit<QueryOptions, 'skip' | 'take'> = {}): Promise<TModel> {
    try {
      console.log(`Creating ${this.modelName} record with data:`, data)

      return await this.prismaDelegate.create({
        data,
        include: options.include,
        select: options.select
      })
    } catch (error: any) {
      console.error(`Error creating ${this.modelName}:`, error)
      
      // Handle Prisma unique constraint violations
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'unknown field'
        throw new UniqueConstraintError(this.modelName, field)
      }
      
      // Handle other Prisma errors
      if (error.code?.startsWith('P')) {
        throw new CRUDError(`Database error while creating ${this.modelName}: ${error.message}`, 400)
      }

      throw new CRUDError(`Unexpected error while creating ${this.modelName}`, 500)
    }
  }

  async update(
    id: string,
    data: TUpdateInput,
    options: Omit<QueryOptions, 'skip' | 'take'> = {}
  ): Promise<TModel> {
    try {
      console.log(`Updating ${this.modelName} record with data:`, data)

      await this.getOne({ id } as TWhereInput)

      const record = await this.prismaDelegate.update({
        where: { id },
        data,
        include: options.include,
        select: options.select
      })

      return record
    } catch (error: any) {
      if (error instanceof CRUDError) {
        throw error
      }

      console.error(`Error updating ${this.modelName}:`, error)
      
      // Handle Prisma unique constraint violations
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'unknown field'
        throw new UniqueConstraintError(this.modelName, field)
      }
      
      // Handle other Prisma errors
      if (error.code?.startsWith('P')) {
        throw new CRUDError(`Database error while updating ${this.modelName}: ${error.message}`, 400)
      }

      throw new CRUDError(`Unexpected error while updating ${this.modelName}`, 500)
    }
  }

  async delete(id: string, isSoft: boolean = true): Promise<TModel> {
    try {
      console.log(`Deleting ${this.modelName} record (id=${id}, soft=${isSoft})`)

      await this.getOne({ id } as TWhereInput)

      if (isSoft) {
        const record = await this.prismaDelegate.update({
          where: { id },
          data: { 
            deleted: true,
            deletedAt: new Date()
          }
        })
        return record
      } else {
        const record = await this.prismaDelegate.delete({
          where: { id }
        })
        return record
      }
    } catch (error: any) {
      if (error instanceof CRUDError) {
        throw error
      }

      console.error(`Error deleting ${this.modelName}:`, error)
      throw new CRUDError(`Unexpected error while deleting ${this.modelName}`, 500)
    }
  }
}