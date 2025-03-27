import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { storage, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../config/firebase';

interface DiaryEntry {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

const DiaryPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    loadDiaryEntries();
  }, []);

  const loadDiaryEntries = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, 'diaries'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const loadedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as DiaryEntry[];
      setEntries(loadedEntries);
    } catch (err) {
      setError('日記の読み込みに失敗しました。');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrl = null;
      if (imageFile) {
        const timestamp = new Date().toISOString();
        const fileName = `diaries/${auth.currentUser.uid}/${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'diaries'), {
        userId: auth.currentUser.uid,
        content,
        imageUrl,
        createdAt: new Date(),
      });

      // フォームをリセット
      setContent('');
      setImageFile(null);
      setImagePreview(null);

      // 日記一覧を更新
      await loadDiaryEntries();
    } catch (err) {
      setError('日記の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteDoc(doc(db, 'diaries', entryId));
      await loadDiaryEntries();
    } catch (err) {
      setError('日記の削除に失敗しました。');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontFamily: 'Mochiy Pop One' }}
        >
          きょうの できごとを かこう！
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="きょうは なにを したかな？"
          variant="outlined"
          sx={{ mb: 2, fontFamily: 'Mochiy Pop One' }}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ fontFamily: 'Mochiy Pop One' }}
          >
            しゃしんを つける
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {imagePreview && (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="プレビュー"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !content.trim()}
            sx={{ ml: 'auto', fontFamily: 'Mochiy Pop One' }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'ほぞん'}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {entries.map((entry) => (
          <Grid item xs={12} key={entry.id}>
            <Card>
              {entry.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={entry.imageUrl}
                  alt="日記の画像"
                />
              )}
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, fontFamily: 'Mochiy Pop One' }}
                >
                  {entry.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: 'Mochiy Pop One' }}
                  >
                    {entry.createdAt.toLocaleDateString('ja-JP')}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(entry.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DiaryPage; 