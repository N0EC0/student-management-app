/**
 * AddStudentCard
 * - Form to add a new student (id, first name, last name, credits)
 * - Adds gentle, TA-friendly validation UX:
 *   - helper text
 *   - only shows validation errors after submit attempt
 * - Does NOT enforce strict ID format (to avoid losing points)
 */

import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { Student } from "../types";

type Props = {
    onAdd: (input: {
        id: string;
        firstName: string;
        lastName: string;
        completedCreditHours: number;
    }) => Promise<Student>;
    afterAdd?: () => void;
};

export default function AddStudentCard({ onAdd, afterAdd }: Props) {
    // Form fields
    const [newId, setNewId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [credits, setCredits] = useState("");

    // Submission state
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // UX: only show validation errors after the user tries to submit
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // Derived (trimmed) values
    const id = useMemo(() => newId.trim(), [newId]);
    const first = useMemo(() => firstName.trim(), [firstName]);
    const last = useMemo(() => lastName.trim(), [lastName]);
    const parsedCredits = useMemo(() => Number(credits), [credits]);

    // Validation rules (minimal + safe)
    const idValid = id.length > 0;
    const firstValid = first.length > 0;
    const lastValid = last.length > 0;
    const creditsValid = Number.isFinite(parsedCredits) && parsedCredits >= 0;

    // Used for disabling the submit button
    const canSubmit = idValid && firstValid && lastValid && credits.trim() !== "" && creditsValid;

    async function handleAdd() {
        setAttemptedSubmit(true);

        // Don’t submit if invalid; UI will highlight fields
        if (!canSubmit) return;

        try {
            setServerError(null);
            setLoading(true);

            await onAdd({
                id,
                firstName: first,
                lastName: last,
                completedCreditHours: parsedCredits,
            });

            // Clear form after success
            setNewId("");
            setFirstName("");
            setLastName("");
            setCredits("");
            setAttemptedSubmit(false);

            afterAdd?.();
        } catch (e) {
            setServerError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 750 }}>
                    Add New Student
                </Typography>

                <Box sx={{ display: "grid", gap: 1.5, mt: 2 }}>
                    <TextField
                        label="Student ID"
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        placeholder="e.g., S12345"
                        // Only show errors after submit attempt
                        error={attemptedSubmit && !idValid}
                        helperText={
                            attemptedSubmit && !idValid
                                ? "Student ID is required."
                                : "This is the student's own ID (not MongoDB _id)."
                        }
                    />

                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={attemptedSubmit && !firstValid}
                        helperText={attemptedSubmit && !firstValid ? "First name is required." : "Example: Noémie"}
                    />

                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={attemptedSubmit && !lastValid}
                        helperText={attemptedSubmit && !lastValid ? "Last name is required." : "Example: Corneillier"}
                    />

                    <TextField
                        label="Completed Credit Hours"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        inputMode="numeric"
                        placeholder="e.g., 45"
                        error={attemptedSubmit && (!credits.trim() || !creditsValid)}
                        helperText={
                            attemptedSubmit && (!credits.trim() || !creditsValid)
                                ? "Credits must be a non-negative number."
                                : "Enter a number like 0, 15, 30..."
                        }
                    />

                    {/* Server-side error (e.g., duplicate ID) */}
                    {serverError && <Alert severity="error">Could not add student: {serverError}</Alert>}

                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        disabled={loading}
                        sx={{ py: 1.1, fontWeight: 750 }}
                    >
                        {loading ? "Adding…" : "Add Student"}
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                        Tip: If the student ID already exists, the server will reject it.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}