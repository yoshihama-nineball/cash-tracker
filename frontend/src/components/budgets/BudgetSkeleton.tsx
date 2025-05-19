// components/budgets/BudgetSkeleton.tsx
"use client";
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const BudgetSkeleton = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "#f0f0ff", // 薄い紫色の背景
        boxShadow: "none",
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "#c3c3eb" }}>
          <TableRow>
            <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
              予算名 ↑
            </TableCell>
            <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
              金額
            </TableCell>
            <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
              支出数
            </TableCell>
            <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
              作成日
            </TableCell>
            <TableCell align="right" sx={{ color: "#000", fontWeight: "bold" }}>
              アクション
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(4)].map((_, index) => (
            <TableRow
              key={index}
              sx={{ "&:nth-of-type(odd)": { bgcolor: "#ffffff" } }}
            >
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={80} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell align="right">
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="circular" width={36} height={36} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BudgetSkeleton;
