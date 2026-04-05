/**
 * Student Management System (Backend)
 * Technology used: TypeScript + Express + Apollo Server (GraphQL) + MongoDB
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { MongoClient, ObjectId } from "mongodb";

// GraphQL-facing type (what the API returns)
type Student = {
    id: string;
    firstName: string;
    lastName: string;
    completedCreditHours: number;
};

// MongoDB document types
type StudentDoc = {
    _id: ObjectId;
    studentId: string;
    firstName: string;
    lastName: string;
    completedCreditHours: number;
};

type StudentInsert = {
    studentId: string;
    firstName: string;
    lastName: string;
    completedCreditHours: number;
};

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in environment (.env).");

const DB_NAME = process.env.MONGODB_DB || "a3";
const COLLECTION = "students";

const client = new MongoClient(MONGODB_URI);

// Map Mongo doc -> GraphQL Student
function toStudent(doc: StudentDoc): Student {
    return {
        id: doc.studentId,
        firstName: doc.firstName,
        lastName: doc.lastName,
        completedCreditHours: doc.completedCreditHours,
    };
}

// GraphQL schema (SDL)
const typeDefs = `#graphql
  type Student {
    # Domain student ID (NOT MongoDB _id)
    id: ID!
    firstName: String!
    lastName: String!
    completedCreditHours: Int!
  }

  type Query {
    # 1) Retrieve all students
    students: [Student!]!

    # 2) Retrieve a student by ID (domain student ID)
    student(id: ID!): Student
  }

  type Mutation {
    # 3) Add new student (domain student ID is user-entered)
    addStudent(
      id: ID!
      firstName: String!
      lastName: String!
      completedCreditHours: Int!
    ): Student!
  }
`;

// Resolvers
const resolvers = {
    Query: {
        students: async (): Promise<Student[]> => {
            const collection = client.db(DB_NAME).collection<StudentDoc>(COLLECTION);
            const docs = await collection.find({}).toArray();
            return docs.map(toStudent);
        },

        student: async (
            _parent: unknown,
            args: { id: string }
        ): Promise<Student | null> => {
            const collection = client.db(DB_NAME).collection<StudentDoc>(COLLECTION);

            // Query by domain studentId
            const doc = await collection.findOne({ studentId: args.id });
            return doc ? toStudent(doc) : null;
        },
    },

    Mutation: {
        addStudent: async (
            _parent: unknown,
            args: { id: string; firstName: string; lastName: string; completedCreditHours: number }
        ): Promise<Student> => {
            const trimmedId = args.id.trim();
            const trimmedFirst = args.firstName.trim();
            const trimmedLast = args.lastName.trim();

            // Minimal validation (server-side)
            if (!trimmedId) throw new Error("Student id cannot be empty.");
            if (!trimmedFirst) throw new Error("firstName cannot be empty.");
            if (!trimmedLast) throw new Error("lastName cannot be empty.");
            if (!Number.isFinite(args.completedCreditHours) || args.completedCreditHours < 0) {
                throw new Error("completedCreditHours must be a non-negative number.");
            }

            // Ensure uniqueness of domain studentId
            const readCollection = client.db(DB_NAME).collection<StudentDoc>(COLLECTION);
            const existing = await readCollection.findOne({ studentId: trimmedId });
            if (existing) {
                throw new Error(`Student id "${trimmedId}" already exists.`);
            }

            // Insert uses StudentInsert
            const insertCollection = client.db(DB_NAME).collection<StudentInsert>(COLLECTION);

            try {
                await insertCollection.insertOne({
                    studentId: trimmedId,
                    firstName: trimmedFirst,
                    lastName: trimmedLast,
                    completedCreditHours: args.completedCreditHours,
                });
            } catch (err: unknown) {
                // Mongo duplicate key error (unique index violation)
                if (err && typeof err === "object" && "code" in err && (err as any).code === 11000) {
                    throw new Error(`Student id "${trimmedId}" already exists.`);
                }
                throw err;
            }

            // Return the created student (GraphQL view)
            return {
                id: trimmedId,
                firstName: trimmedFirst,
                lastName: trimmedLast,
                completedCreditHours: args.completedCreditHours,
            };
        },
    },
};

async function bootstrap() {
    await client.connect();

    // Ensure studentId is unique at the database level.
    // This prevents duplicates even if two requests happen at the same time.
    await client
        .db(DB_NAME)
        .collection<StudentDoc>(COLLECTION)
        .createIndex({ studentId: 1 }, { unique: true });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/graphql", expressMiddleware(server));

    const port = process.env.PORT ? Number(process.env.PORT) : 4000;

    app.listen(port, () => {
        console.log(`GraphQL running at http://localhost:${port}/graphql`);
        console.log(`Connected to MongoDB database "${DB_NAME}"`);
        console.log(`Ensured unique index on students.studentId`);
    });
}

process.on("SIGINT", async () => {
    await client.close();
    process.exit(0);
});

bootstrap().catch((err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
});