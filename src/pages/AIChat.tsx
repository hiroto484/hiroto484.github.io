import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const q = query(
        collection(db, 'chat'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as Message[];
      setMessages(messagesData.reverse());
    } catch (error) {
      console.error('メッセージの読み込みに失敗しました:', error);
      setError('メッセージの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser) return;

    try {
      setIsLoading(true);
      setError(null);

      // ユーザーメッセージをFirestoreに保存
      const userMessage = {
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
        userId: auth.currentUser.uid,
      };
      const userMessageDoc = await addDoc(collection(db, 'chat'), userMessage);

      setMessages(prev => [...prev, { ...userMessage, id: userMessageDoc.id }]);
      setInput('');

      // OpenAI APIにリクエストを送信
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: '吃音の専門家として、親身に相談に乗り、具体的なアドバイスを提供してください。',
            },
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('AI応答の取得に失敗しました');
      }

      const data = await response.json();

      // AIの応答をFirestoreに保存
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.message,
        timestamp: new Date(),
        userId: auth.currentUser.uid,
      };
      const assistantMessageDoc = await addDoc(collection(db, 'chat'), assistantMessage);

      setMessages(prev => [...prev, { ...assistantMessage, id: assistantMessageDoc.id }]);
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
      setError('メッセージの送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        AI対話
      </Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        吃音に関する質問や相談に、AIが専門家として回答します。
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          height: '60vh',
          overflow: 'auto',
          p: 2,
          mb: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                }}
              >
                {message.role === 'user' ? 'U' : 'AI'}
              </Avatar>
              <Paper
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  backgroundColor: message.role === 'user' ? 'primary.light' : 'white',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <ListItemText
                  primary={message.content}
                  secondary={new Date(message.timestamp).toLocaleString()}
                  secondaryTypographyProps={{
                    color: message.role === 'user' ? 'white' : 'text.secondary',
                  }}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{ alignSelf: 'flex-end' }}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <SendIcon />
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default AIChat; 