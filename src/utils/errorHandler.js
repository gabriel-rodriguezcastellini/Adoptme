export class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const errorDictionary = {
  USER_NOT_FOUND: { message: "User not found", status: 404 },
  PET_NOT_FOUND: { message: "Pet not found", status: 404 },
  INCOMPLETE_VALUES: { message: "Incomplete values", status: 400 },
  PET_ALREADY_ADOPTED: { message: "Pet is already adopted", status: 400 },
};

export const createError = (errorKey) => {
  const error = errorDictionary[errorKey];
  if (error) {
    return new CustomError(error.message, error.status);
  }
  return new CustomError("Unknown error", 500);
};
