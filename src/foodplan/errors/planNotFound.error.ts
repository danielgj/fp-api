export class PlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Plan with id ${id} not found`);
    Object.setPrototypeOf(this, PlanNotFoundError.prototype);
  }
}
