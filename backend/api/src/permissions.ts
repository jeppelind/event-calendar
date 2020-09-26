export enum Roles {
  READ,
  WRITE,
  MODIFY,
}

export const authorize = (userRole: number, requiredRole: number) => {
  if (userRole === undefined || userRole < requiredRole) {
    throw new Error('Unauthorized');
  }
}
