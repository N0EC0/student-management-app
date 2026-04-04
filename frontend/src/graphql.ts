/**
 * GraphQL helper utilities (fetch-based).
 * We keep GraphQL strings and the fetch wrapper here so UI components stay clean.
 */

import type { Student } from "./types";

// Backend GraphQL endpoint (same as your backend)
export const GRAPHQL_URL = "http://localhost:4000/graphql";

/**
 * Generic helper to call GraphQL via HTTP POST.
 * - Throws on network errors or GraphQL errors.
 * - Returns the `data` object typed as TData.
 */
export async function graphqlFetch<
    TData,
    TVars extends Record<string, unknown> | undefined
>(query: string, variables?: TVars): Promise<TData> {
    const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`Network error: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as {
        data?: TData;
        errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) {
        throw new Error(json.errors.map((e) => e.message).join(" | "));
    }

    if (!json.data) {
        throw new Error("No data returned from GraphQL.");
    }

    return json.data;
}

// --------------------
// GraphQL operation strings
// --------------------

export const Q_ALL = `
  query GetAllStudents {
    students {
      id
      firstName
      lastName
      completedCreditHours
    }
  }
`;

export const Q_BY_ID = `
  query GetStudentById($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
      completedCreditHours
    }
  }
`;

export const M_ADD = `
  mutation AddStudent($id: ID!, $firstName: String!, $lastName: String!, $completedCreditHours: Int!) {
    addStudent(id: $id, firstName: $firstName, lastName: $lastName, completedCreditHours: $completedCreditHours) {
      id
      firstName
      lastName
      completedCreditHours
    }
  }
`;

// --------------------
// Convenience typed API calls (optional but nice)
// --------------------

export async function fetchAllStudents(): Promise<Student[]> {
    const data = await graphqlFetch<{ students: Student[] }, undefined>(Q_ALL);
    return data.students;
}

export async function fetchStudentById(id: string): Promise<Student | null> {
    const data = await graphqlFetch<{ student: Student | null }, { id: string }>(Q_BY_ID, { id });
    return data.student;
}

export async function createStudent(input: {
    id: string;
    firstName: string;
    lastName: string;
    completedCreditHours: number;
}): Promise<Student> {
    const data = await graphqlFetch<
        { addStudent: Student },
        { id: string; firstName: string; lastName: string; completedCreditHours: number }
    >(M_ADD, input);

    return data.addStudent;
}