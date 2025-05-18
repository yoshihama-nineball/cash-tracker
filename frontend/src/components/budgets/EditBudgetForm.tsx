import { Typography } from '@mui/material';
import { editBudget } from 'actions/edit-budget-action';
import { Budget } from 'libs/schemas/auth';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { useFormState } from 'react-dom';
import Button from '../ui/Button/Button';

interface AuthResponse {
  errors: string[];
  success: string;
}

const EditBudgetForm = ({ budget }: { budget: Budget }) => {
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const editBudgetWithId = editBudget.bind(null, budget.id)

  const [state, dispatch] = useFormState(editBudgetWithId,{
      errors: [],
      success: ""
    },
  );

  return (
    <>
      <Typography variant='h4'>予算の編集</Typography>
      <Button
        type="submit"
        sx={{
          mt: 2,
          fontSize: "1.1rem",
          fontWeight: "bold"
        }}
        // disabled={isSubmitting || isPending}
      >
        {isSubmitting || isPending ? "送信中": "更新"}
      </Button>
    </>
  )
}

export default EditBudgetForm