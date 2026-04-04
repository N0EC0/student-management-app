/**
 * AllStudentsCard
 * - Displays all students in a nice list.
 * - Allows manual refresh.
 */

import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import type { Student } from "../types";

type Props = {
    students: Student[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
};

export default function AllStudentsCard({ students, loading, error, onRefresh }: Props) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 750 }}>
                        All Students
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Button variant="outlined" onClick={onRefresh}>
                        Refresh
                    </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {loading && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <CircularProgress size={18} />
                            <Typography variant="body2">Loading…</Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            Failed to load students: {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <Box sx={{ display: "grid", gap: 1.2 }}>
                            {students.length === 0 ? (
                                <Alert severity="info">No students found.</Alert>
                            ) : (
                                students.map((s) => (
                                    <Box
                                        key={s.id}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            border: "1px solid #eee",
                                            background: "#fff",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {s.firstName} {s.lastName}{" "}
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                ({s.completedCreditHours} credits)
                                            </Typography>
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            student id: {s.id}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}