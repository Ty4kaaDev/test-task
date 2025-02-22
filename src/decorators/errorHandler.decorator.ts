import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod'; // Импортируем ZodError
import logger from '../utils/logger';

export function ErrorHandlerDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      await originalMethod.call(this, req, res, next);
    } catch (err: any) {
      logger.error(`Error in ${propertyKey}: ${err.message}`, { stack: err.stack });

      // Обработка ошибок валидации Zod
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      // Обработка других ошибок
      const errorMessage = err.message || 'Something went wrong';
      res.status(500).json({ message: errorMessage });
    }
  };

  return descriptor;
}