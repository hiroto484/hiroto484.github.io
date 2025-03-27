import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  feedback: string;
  timestamp: Date;
}

const Diary: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'diary'));
      const entriesData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as DiaryEntry[];
      setEntries(entriesData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('日記の読み込みに失敗しました:', error);
      setError('日記の読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (entry?: DiaryEntry) => {
    if (entry) {
      setSelectedEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setFeedback(entry.feedback);
    } else {
      setSelectedEntry(null);
      setTitle('');
      setContent('');
      setFeedback('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEntry(null);
    setTitle('');
    setContent('');
    setFeedback('');
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      const entryData = {
        title,
        content,
        feedback,
        timestamp: new Date(),
        userId: auth.currentUser.uid,
      };

      if (selectedEntry) {
        await updateDoc(doc(db, 'diary', selectedEntry.id), entryData);
      } else {
        await addDoc(collection(db, 'diary'), entryData);
      }

      await loadEntries();
      handleCloseDialog();
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setError('日記の保存に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entry: DiaryEntry) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      await deleteDoc(doc(db, 'diary', entry.id));
      await loadEntries();
    } catch (error) {
      console.error('削除に失敗しました:', error);
      setError('日記の削除に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 4 }}>
        <Typography variant="h4" component="h1">
          練習日記
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          新規作成
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {entry.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(entry.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(entry)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(entry)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {entry.content}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    フィードバック
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.feedback}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEntry ? '日記を編集' : '新規日記'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="練習内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="フィードバック"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Diary; 