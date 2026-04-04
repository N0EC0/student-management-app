/**
 * App.tsx
 * - Composes the page from smaller components.
 * - Owns the shared state for the "all students" list (so refresh is centralized).
 */

import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

import type { Student } from "./types";
import { createStudent, fetchAllStudents, fetchStudentById } from "./graphql";

import { AllStudentsCard, FindStudentCard, AddStudentCard } from "./components";

export default function App() {
  // Theme for nice visuals
  const theme = useMemo(
      () =>
          createTheme({
            palette: { mode: "light", primary: { main: "#1a73e8" } },
            shape: { borderRadius: 14 },
          }),
      []
  );

  // Shared state: all students list
  const [students, setStudents] = useState<Student[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);

  // Load once on first render (simple pattern)
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

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid #eaeaea" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Student Management (GraphQL)
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Backend: localhost:4000/graphql
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ minHeight: "100vh", background: "#fafafa", py: 5 }}>
          <Container maxWidth="lg">
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid #ededed" }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                View all students, search by student ID, and add a new student.
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Page layout */}
              <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                    gap: 3,
                    alignItems: "start",
                  }}
              >
                {/* Left: All Students */}
                <AllStudentsCard
                    students={students}
                    loading={allLoading}
                    error={allError}
                    onRefresh={refreshStudents}
                />

                {/* Right: Find + Add */}
                <Box sx={{ display: "grid", gap: 3 }}>
                  <FindStudentCard onFind={fetchStudentById} />

                  <AddStudentCard
                      onAdd={createStudent}
                      afterAdd={refreshStudents}
                  />
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
  );
}