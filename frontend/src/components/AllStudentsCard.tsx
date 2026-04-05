/**
 * AllStudentsCard
 * - Displays all students in a list/table style:
 *   - left: student name
 *   - right: completed credits
 *   - secondary line: student id
 *
 * Polish features (UI-only):
 * - Sort toggle (Name / Credits)
 * - Subtle hover states on rows
 * - Credits shown with larger “big number” typography
 *  * AllStudentsCard (content-only)
 *  * NOTE: This component intentionally does NOT render a MUI <Card>.
 *  * App.tsx provides the outer “panel shell” styling to avoid double cards.
 */

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { Student } from "../types";
import {COLORS} from "../theme.ts";

type Props = {
    students: Student[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
};

type SortMode = "name" | "credits";

export default function AllStudentsCard({ students, loading, error, onRefresh }: Props) {
    const [sortMode, setSortMode] = useState<SortMode>("name");

    const sortedStudents = useMemo(() => {
        const copy = [...students];

        if (sortMode === "credits") {
            copy.sort((a, b) => {
                const byCredits = b.completedCreditHours - a.completedCreditHours;
                if (byCredits !== 0) return byCredits;
                const byLast = a.lastName.localeCompare(b.lastName);
                if (byLast !== 0) return byLast;
                return a.firstName.localeCompare(b.firstName);
            });
            return copy;
        }

        copy.sort((a, b) => {
            const byLast = a.lastName.localeCompare(b.lastName);
            if (byLast !== 0) return byLast;
            return a.firstName.localeCompare(b.firstName);
        });

        return copy;
    }, [students, sortMode]);

    return (
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            {/* Header: title + controls */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                    gap: 1.5,
                    alignItems: { xs: "start", md: "center" },
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                    All Students
                </Typography>

                {/* Controls */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        flexWrap: "wrap",
                    }}
                >
                    <Typography variant="caption" sx={{ opacity: 0.75, letterSpacing: 0.6 }}>
                        Sort by:
                    </Typography>

                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={sortMode}
                        onChange={(_e, v: SortMode | null) => {
                            if (v) setSortMode(v);
                        }}
                    >
                        <ToggleButton value="name">Name</ToggleButton>
                        <ToggleButton value="credits">Credits</ToggleButton>
                    </ToggleButtonGroup>

                    <Button variant="outlined" onClick={onRefresh} sx={{ borderRadius: 999 }}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Column labels */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ opacity: 0.75, letterSpacing: 0.6 }}>
                    NAME
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75, letterSpacing: 0.6 }}>
                    CREDITS
                </Typography>
            </Box>

            <Divider sx={{ my: 1.5, opacity: 0.25 }} />

            {/* States */}
            {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2">Loading…</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    Failed to load students: {error}
                </Alert>
            )}

            {/* List */}
            {!loading && !error && (
                <Box sx={{ display: "grid" }}>
                    {sortedStudents.length === 0 ? (
                        <Alert severity="info"
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
                                    NO STUDENT FOUND
                                </Box>
                                <Typography variant="body2" sx={{ opacity: 0.9, color: COLORS.text }}>
                                    The list is empty, add a student.
                                </Typography>
                            </Box>


                        </Alert>
                    ) : (
                        sortedStudents.map((s, idx) => (
                            <Box key={s.id}>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr auto",
                                        gap: 2,
                                        alignItems: "baseline",
                                        py: 1.3,

                                        borderRadius: 2,
                                        px: 3,
                                        transition: "background-color 140ms ease, transform 140ms ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.06)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {s.firstName} {s.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            id: {s.id}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 950,
                                                letterSpacing: -0.6,
                                                lineHeight: 1,
                                                fontSize: { xs: 20, md: 24 },
                                            }}
                                        >
                                            {s.completedCreditHours}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Credits
                                        </Typography>
                                    </Box>
                                </Box>

                                {idx !== sortedStudents.length - 1 && <Divider sx={{ opacity: 0.18 }} />}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
}