/**
 * Shared TypeScript types for the frontend.
 * Keeping types in one place makes the code easier to read and maintain.
 */

export type Student = {
    id: string; // domain student id (user-entered)
    firstName: string;
    lastName: string;
    completedCreditHours: number;
};