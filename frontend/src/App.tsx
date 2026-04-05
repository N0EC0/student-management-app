/**
 * App.tsx
 * - Dashboard layout inspired by the provided mockup:
 *   - dark background
 *   - large top summary card
 *   - 2-column grid underneath
 * - Uses existing components (separation stays TA-friendly)
 *  * App.tsx (responsive)
 *  * - Mobile: single column stacked sections
 *  * - Desktop: 2-column dashboard
 */

import { useState } from "react";
import { Box, Container, Divider, Paper, Typography } from "@mui/material";

import type { Student } from "./types";
import { createStudent, fetchAllStudents, fetchStudentById } from "./graphql";
import { AllStudentsCard, FindStudentCard, AddStudentCard } from "./components";
import { COLORS } from "./theme";

export default function App() {
    const [students, setStudents] = useState<Student[]>([]);
    const [allLoading, setAllLoading] = useState(false);
    const [allError, setAllError] = useState<string | null>(null);

    const [initialLoaded, setInitialLoaded] = useState(false);
    if (!initialLoaded) {
        setInitialLoaded(true);
        void refreshStudents();
    }

    async function refreshStudents() {
        try {
            setAllError(null);
            setAllLoading(true);
            const all = await fetchAllStudents();
            setStudents(all);
        } catch (e) {
            setAllError(e instanceof Error ? e.message : String(e));
        } finally {
            setAllLoading(false);
        }
    }

    const totalStudents = students.length;
    const totalCredits = students.reduce((sum, s) => sum + s.completedCreditHours, 0);
    const avgCredits = totalStudents ? Math.round((totalCredits / totalStudents) * 10) / 10 : 0;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: COLORS.blue,
                color: COLORS.text,
                py: { xs: 2.5, sm: 3.5, md: 5 },
            }}
        >
            <Container maxWidth="lg">
                {/* Top header: stacks on mobile */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1.6 }}>
                            STUDENT MANAGEMENT
                        </Typography>
                        <Typography variant="h4">Dashboard</Typography>
                    </Box>

                    {/* Pills: wrap naturally on mobile */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: { xs: "flex-start", sm: "flex-end" },
                            width: { xs: "100%", sm: "auto" },
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                px: 4,
                                py: 1.8,
                                borderRadius: 20,
                                background: "rgba(255,255,255,0.0)",
                                maxWidth: "100%",
                            }}
                        >
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                Assignment 3
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                px: 4,
                                py: 0.8,
                                borderRadius: 20,
                                background: "rgba(255,255,255,0.0)",
                                textAlign: "right",

                            }}
                        >
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                Winter 2026
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: "block" }}>
                                SOEN 487
                            </Typography>
                        </Paper>
                    </Box>
                </Box>

                {/* HERO: stacks content on mobile */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 5, sm: 5, md: 5 },
                        borderRadius: { xs: 4, md: 4 },
                        background: COLORS.cream,
                        color: "#0b0b0c",
                        border: "none",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                            gap: { xs: 2.5, md: 2 },
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                Students Overview
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                View of the enrolled students showing student IDs, name, and number of credits.
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.12)" }} />

                            <Box sx={{ display: "grid", gap: 1.2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography variant="body2">Total students</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                        {totalStudents}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography variant="body2">Total completed credits</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                        {totalCredits}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography variant="body2">Average credits</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                        {avgCredits}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: 44, sm: 56, md: 72 },
                                    fontWeight: 950,
                                    letterSpacing: -2,
                                    lineHeight: 1,
                                }}
                            >
                                {totalStudents}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                students enrolled
                            </Typography>

                            <Box
                                sx={{
                                    mt: 2,
                                    display: "inline-block",
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: 999,
                                    background: COLORS.neon,
                                    color: "#0b0b0c",
                                    fontWeight: 900,
                                }}
                            >
                                Ready for demo
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* MAIN GRID: stacks on mobile */}
                <Box
                    sx={{
                        // mt: { xs: 2.5, md: 3 },
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                        // gap: { xs: 2, md: 3 },
                        alignItems: "start",
                    }}
                >
                    {/* Left: list */}
                    <Box
                        sx={{
                            background: COLORS.brown,
                            borderRadius: { xs: 4, md: 4 },
                            p: { xs: 3, md: 3 },
                            // border: `1px solid ${COLORS.border}`,
                            overflow: "hidden", // keeps inner hover transforms tidy on small screens
                        }}
                    >
                        <AllStudentsCard
                            students={students}
                            loading={allLoading}
                            error={allError}
                            onRefresh={refreshStudents}
                        />
                    </Box>

                    {/* Right: find + add */}
                    <Box sx={{ display: "grid",  }}>
                        <Box
                            sx={{
                                background: COLORS.brown,
                                borderRadius: { xs: 4, md: 4 },
                                p: { xs: 3, md: 3 },
                                // border: `1px solid ${COLORS.border}`,
                                overflow: "hidden",
                            }}
                        >
                            <FindStudentCard onFind={fetchStudentById} />
                        </Box>

                        <Box
                            sx={{
                                background: COLORS.brown,
                                borderRadius: { xs: 4, md: 4 },
                                p: { xs: 3, md: 3 },
                                // border: `1px solid ${COLORS.border}`,
                                overflow: "hidden",
                            }}
                        >
                            <AddStudentCard onAdd={createStudent} afterAdd={refreshStudents} />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}