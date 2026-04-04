/**
 * AddStudentCard
 * - Form to add a new student (id, first name, last name, credits)
 * - Adds gentle, TA-friendly validation UX:
 *   - helper text
 *   - only shows validation errors after submit attempt
 * - Does NOT enforce strict ID format (to avoid losing points)
 */

import { Alert, Box, Button,  TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { Student } from "../types";
import {COLORS} from "../theme.ts";

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
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 750 }}>
                Add New Student
            </Typography>

            <Box sx={{ display: "grid", gap: 1.5, mt: 2 }}>
                <TextField
                    label="Student ID"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="example: 01234567"
                    // Only show errors after submit attempt
                    error={attemptedSubmit && !idValid}
                    helperText={
                        attemptedSubmit && !idValid
                            ? "Student ID is required."
                            : "8 digit unique identifier for student ID"
                    }
                />

                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={attemptedSubmit && !firstValid}
                    helperText={attemptedSubmit && !firstValid ? "First name is required." : "Example: Harry"}
                />

                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={attemptedSubmit && !lastValid}
                    helperText={attemptedSubmit && !lastValid ? "Last name is required." : "Example: Potter"}
                />

                <TextField
                    label="Completed Credit"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    inputMode="numeric"
                    placeholder="example: 45"
                    error={attemptedSubmit && (!credits.trim() || !creditsValid)}
                    helperText={
                        attemptedSubmit && (!credits.trim() || !creditsValid)
                            ? "Credits must be a non-negative number."
                            : "Enter a number like 0, 15, 30..."
                    }
                />

                {/* Server-side error (e.g., duplicate ID) */}
                {serverError && (
                    <Alert
                        severity="error"
                        icon={false}
                        sx={{
                            mt: 1,
                            borderRadius: 2.4,
                            border: "1px solid rgba(255,64,64,0.45)",
                            backgroundColor: "rgba(255,64,64,0.12)",
                            py: 0.5,
                            "& .MuiAlert-message": { width: "100%" },
                            marginBottom: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Box
                                sx={{
                                    px: 1.2,
                                    py: 0.35,
                                    borderRadius: 2.5,
                                    fontWeight: 900,
                                    letterSpacing: 0.6,
                                    fontSize: 12,
                                    backgroundColor: "rgba(255,64,64,0.25)",
                                    flexShrink: 0,
                                    color: COLORS.text
                                }}
                            >
                                ERROR
                            </Box>

                            <Typography variant="body2" sx={{ opacity: 0.9, minWidth: 0, color: COLORS.text
                            }}>
                                Could not add student: {serverError}
                            </Typography>
                        </Box>
                    </Alert>
                )}

                <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={loading}
                    sx={{ py: 1.1, fontWeight: 750 }}
                >
                    {loading ? "Adding…" : "Add Student"}
                </Button>
            </Box>
        </Box>
    );
}