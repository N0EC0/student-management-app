/**
 * FindStudentCard
 * - Lets the user input a student ID and fetch a student
 * - Shows loading/error/success states
 *
 * UI:
 * - Responsive input/button row (stacks on mobile)
 * - Badge-style result pills for success / not found / error
 */

import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { Student } from "../types";
import { COLORS } from "../theme.ts";

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
            <Typography variant="h6" sx={{ fontWeight: 850 }}>
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
                    onChange={(e) => {
                        const v = e.target.value;
                        setSearchId(v);

                        // Clear badges/messages on ANY change (not only when empty)
                        // This removes stale FOUND / NOT FOUND / ERROR state as the user edits
                        setError(null);
                        setFound(undefined);
                    }}
                    placeholder="example: 01234567"
                />
                <Button
                    variant="contained"
                    onClick={handleFind}
                    disabled={!searchId.trim() || loading}
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

                {/* Error badge */}
                {error && (
                    <Alert
                        severity="error"
                        icon={false}
                        sx={{
                            mt: 2,
                            borderRadius: 999,
                            border: "1px solid rgba(255,64,64,0.45)",
                            backgroundColor: "rgba(255,64,64,0.12)",
                            py: 0.5,
                            "& .MuiAlert-message": { width: "100%" },
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Box
                                sx={{
                                    px: 1.2,
                                    py: 0.35,
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    letterSpacing: 0.6,
                                    fontSize: 12,
                                    backgroundColor: "rgba(255,64,64,0.25)",
                                }}
                            >
                                ERROR
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9, minWidth: 0 }}>
                                Search failed: {error}
                            </Typography>
                        </Box>
                    </Alert>
                )}

                {/* Success / Not found badges */}
                {!loading && !error && found !== undefined && (
                    <>
                        {found ? (
                            <Alert
                                severity="success"
                                icon={false}
                                sx={{
                                    mt: 2,
                                    borderRadius: 2.5,
                                    border: "1px solid rgba(255,255,255,0.35)",
                                    backgroundColor: "rgba(250,250,250,0.05)",
                                    py: 0.5,
                                    "& .MuiAlert-message": { width: "100%" },
                                    color: COLORS.text,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.2,
                                        color: COLORS.text,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            px: 1.2,
                                            py: 0.35,
                                            borderRadius: 999,
                                            fontWeight: 900,
                                            letterSpacing: 0.6,
                                            fontSize: 12,
                                            backgroundColor: "rgba(230,255,0,0.25)",
                                            color: COLORS.text,
                                            flexShrink: 0,
                                        }}
                                    >
                                        FOUND
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 900,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                color: COLORS.text,
                                            }}
                                        >
                                            {found.firstName} {found.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            id: {found.id}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                        <Typography sx={{ fontWeight: 950, letterSpacing: -0.6 }}>
                                            {found.completedCreditHours}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            credits
                                        </Typography>
                                    </Box>
                                </Box>
                            </Alert>
                        ) : (
                            <Alert
                                severity="info"
                                icon={false}
                                sx={{
                                    mt: 2,
                                    borderRadius: 2.5,
                                    border: "1px solid rgba(233,225,216,0.22)",
                                    backgroundColor: "rgba(233,225,216,0.08)",
                                    py: 0.5,
                                    "& .MuiAlert-message": { width: "100%" },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                    <Box
                                        sx={{
                                            px: 1.2,
                                            py: 0.35,
                                            borderRadius: 999,
                                            fontWeight: 900,
                                            letterSpacing: 0.6,
                                            fontSize: 12,
                                            backgroundColor: COLORS.orange,
                                            flexShrink: 0,
                                            color: COLORS.text,
                                        }}
                                    >
                                        NOT FOUND
                                    </Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9, color: COLORS.text }}>
                                        No student found for that ID.
                                    </Typography>
                                </Box>
                            </Alert>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}