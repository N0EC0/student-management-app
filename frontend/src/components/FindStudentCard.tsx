/**
 * FindStudentCard
 * - Lets the user input a student ID and fetch a student.
 * - Shows loading/error/success states clearly.
 */

import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { Student } from "../types";

type Props = {
    onFind: (id: string) => Promise<Student | null>;
};

export default function FindStudentCard({ onFind }: Props) {
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [found, setFound] = useState<Student | null | undefined>(undefined);

    async function handleFind() {
        const trimmed = searchId.trim();
        if (!trimmed) return;

        try {
            setError(null);
            setLoading(true);
            setFound(undefined);

            const student = await onFind(trimmed);
            setFound(student);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 750 }}>
                Find Student by ID
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    mt: 2,
                    flexDirection: { xs: "column", sm: "row" },
                }}
            >
                <TextField
                    fullWidth
                    label="Student ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="e.g., S12345"
                />
                <Button
                    variant="contained"
                    onClick={handleFind}
                    disabled={!searchId.trim()}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    Find
                </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
                {loading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress size={18} />
                        <Typography variant="body2">Searching…</Typography>
                    </Box>
                )}

                {error && <Alert severity="error">Search failed: {error}</Alert>}

                {!loading && !error && found !== undefined && (
                    <>
                        {found ? (
                            <Alert severity="success">
                                <strong>
                                    {found.firstName} {found.lastName}
                                </strong>{" "}
                                — {found.completedCreditHours} credits
                                <br />
                                <small>student id: {found.id}</small>
                            </Alert>
                        ) : (
                            <Alert severity="info">No student found for that ID.</Alert>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}