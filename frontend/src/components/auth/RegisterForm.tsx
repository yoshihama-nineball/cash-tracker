"use client"

// import { register } from "@/actions/create-account-action"
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useRef, useState } from "react"

export default function RegisterForm() {
    const ref = useRef<HTMLFormElement>(null)
    // const [state, dispatch] = useFormState(register, {
    //     errors: [],
    //     success: ''
    // })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

    // useEffect(() => {
    //     if(state.success) {
    //         ref.current?.reset()
    //     }
    // }, [state])

    return (
        <Box
            component="form"
            ref={ref}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}
            noValidate
            // action={dispatch}
        >   
            {/* {state.errors.map(error => <Alert severity="errors" key={error}>{error}</Alert>)}
            {state.success && <Alert severity="success">{state.success}</Alert>} */}

            <Box>
                <Typography
                    component="label"
                    htmlFor="email"
                    fontWeight="bold"
                    variant="h6"
                    sx={{ mb: 1, display: 'block' }}
                >
                    メールアドレス
                </Typography>
                <TextField
                    id="email"
                    type="email"
                    placeholder="登録用メールアドレス"
                    fullWidth
                    name="email"
                    variant="outlined"
                />
            </Box>

            <Box>
                <Typography
                    component="label"
                    htmlFor="name"
                    fontWeight="bold"
                    variant="h6"
                    sx={{ mb: 1, display: 'block' }}
                >
                    お名前
                </Typography>
                <TextField
                    id="name"
                    type="text"
                    placeholder="お名前"
                    fullWidth
                    name="name"
                    variant="outlined"
                />
            </Box>

            <Box>
                <Typography
                    component="label"
                    htmlFor="password"
                    fontWeight="bold"
                    variant="h6"
                    sx={{ mb: 1, display: 'block' }}
                >
                    パスワード
                </Typography>
                <TextField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="パスワード"
                    fullWidth
                    name="password"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Box>
                <Typography
                    component="label"
                    htmlFor="password_confirmation"
                    fontWeight="bold"
                    variant="h6"
                    sx={{ mb: 1, display: 'block' }}
                >
                    パスワード（確認）
                </Typography>
                <TextField
                    id="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="パスワード（再入力）"
                    fullWidth
                    name="password_confirmation"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowConfirmPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                }}
            >
                アカウント登録
            </Button>
        </Box>
    )
}