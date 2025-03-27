import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error: any) {
      console.error('認証エラー:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('このメールアドレスは既に使用されています。');
          break;
        case 'auth/invalid-email':
          setError('無効なメールアドレスです。');
          break;
        case 'auth/operation-not-allowed':
          setError('この認証方法は現在利用できません。');
          break;
        case 'auth/weak-password':
          setError('パスワードが弱すぎます。6文字以上にしてください。');
          break;
        case 'auth/user-disabled':
          setError('このアカウントは無効化されています。');
          break;
        case 'auth/user-not-found':
          setError('このメールアドレスのユーザーが見つかりません。');
          break;
        case 'auth/wrong-password':
          setError('パスワードが間違っています。');
          break;
        default:
          setError('認証に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      setError('ログアウトに失敗しました。');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {auth.currentUser ? 'ログアウト' : (isSignUp ? '新規登録' : 'ログイン')}
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          {auth.currentUser
            ? 'ログアウトして終了します。'
            : '吃音改善トレーニングを始めましょう。'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {auth.currentUser ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              現在のユーザー: {auth.currentUser.email}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              disabled={isLoading}
            >
              ログアウト
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleAuth}>
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  isSignUp ? '登録' : 'ログイン'
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                {isSignUp ? 'ログインへ' : '新規登録へ'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Login; 