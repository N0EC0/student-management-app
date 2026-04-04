/**
 * Student Management System (Backend)
 * Tech: TypeScript + Express + Apollo Server (GraphQL) + MongoDB
 *
 * Requirements implemented:
 * 1) Retrieve all students
 * 2) Retrieve a student by ID
 * 3) Add new student
 *
 * MongoDB:
 * - Uses the official MongoDB driver (mongodb package)
 * - Loads MONGODB_URI (and optional MONGODB_DB) from .env
 *
 * Notes:
 * - This is intentionally minimal and only implements the required operations.
 */

import "dotenv/config"; // Loads environment variables from .env into process.env
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { MongoClient, ObjectId } from "mongodb";

// --------------------
// Types (TypeScript)
// --------------------

// GraphQL-facing type (what the API returns)
type Student = {
    id: string;
    name: string;
    completedCreditHours: number;
};

// MongoDB document type (what is stored/read from MongoDB)
type StudentDoc = {
    _id: ObjectId;
    name: string;
    completedCreditHours: number;
};

// MongoDB insert type (what we send to insertOne; MongoDB generates _id)
type StudentInsert = {
    name: string;
    completedCreditHours: number;
};

// --------------------
// MongoDB setup
// --------------------
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment (.env).");
}

// Optional DB name override (useful with Atlas URIs that don't specify a default DB)
const DB_NAME = process.env.MONGODB_DB || "a3";
const COLLECTION = "students";

const client = new MongoClient(MONGODB_URI);

// Helper: map MongoDB document => GraphQL Student
function toStudent(doc: StudentDoc): Student {
    return {
        id: doc._id.toHexString(),
        name: doc.name,
        completedCreditHours: doc.completedCreditHours,
    };
}

// --------------------
// GraphQL schema (SDL)
// --------------------
const typeDefs = `#graphql
  type Student {
    id: ID!
    name: String!
    completedCreditHours: Int!
  }

  type Query {
    # 1) Retrieve all students
    students: [Student!]!

    # 2) Retrieve a student by ID
    student(id: ID!): Student
  }

  type Mutation {
    # 3) Add new student
    addStudent(name: String!, completedCreditHours: Int!): Student!
  }
`;

// --------------------
// Resolvers
// --------------------
const resolvers = {
    Query: {
        // 1) Retrieve all students
        students: async (): Promise<Student[]> => {
            const collection = client.db(DB_NAME).collection<StudentDoc>(COLLECTION);

            const docs = await collection.find({}).toArray();
            return docs.map(toStudent);
        },

        // 2) Retrieve a student by ID
        student: async (
            _parent: unknown,
            args: { id: string }
        ): Promise<Student | null> => {
            const collection = client.db(DB_NAME).collection<StudentDoc>(COLLECTION);

            // If the provided ID isn't a valid MongoDB ObjectId, return null.
            if (!ObjectId.isValid(args.id)) return null;

            const doc = await collection.findOne({ _id: new ObjectId(args.id) });
            return doc ? toStudent(doc) : null;
        },
    },

    Mutation: {
        // 3) Add new student
        addStudent: async (
            _parent: unknown,
            args: { name: string; completedCreditHours: number }
        ): Promise<Student> => {
            // Use StudentInsert here (no _id) because MongoDB generates _id for inserts.
            const collection = client.db(DB_NAME).collection<StudentInsert>(COLLECTION);

            const result = await collection.insertOne({
                name: args.name,
                completedCreditHours: args.completedCreditHours,
            });

            return {
                id: result.insertedId.toHexString(),
                name: args.name,
                completedCreditHours: args.completedCreditHours,
            };
        },
    },
};

async function bootstrap() {
    // Connect once on startup and reuse the same connection.
    await client.connect();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // GraphQL endpoint
    app.use("/graphql", expressMiddleware(server));

    const port = process.env.PORT ? Number(process.env.PORT) : 4000;

    app.listen(port, () => {
        console.log(`✅ GraphQL running at http://localhost:${port}/graphql`);
        console.log(`✅ Connected to MongoDB database "${DB_NAME}"`);
    });
}

// Graceful shutdown (helpful during development)
process.on("SIGINT", async () => {
    await client.close();
    process.exit(0);
});

bootstrap().catch((err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
});