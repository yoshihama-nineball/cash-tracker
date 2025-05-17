// components/budgets/BudgetListContainer.tsx（一部のみ修正）
// ...前略...

return (
  <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>予算一覧</Typography>
        <Link href="/admin/budgets/new">
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: "#8e8edb", 
              color: "white",
              borderRadius: 4,
              py: 1,
              px: 3,
              "&:hover": { bgcolor: "#7070c0" }
            }}
          >
            新規予算作成
          </Button>
        </Link>
      </Box>
      
      {isLoading ? (
        <BudgetSkeleton />
      ) : (
        <BudgetList budgets={budgetsData} />
      )}
    </Box>
  </Container>
);