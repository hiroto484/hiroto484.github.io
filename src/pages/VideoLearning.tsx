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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  timestamp: Date;
}

const VideoLearning: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Video[];
      setVideos(videosData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('動画の読み込みエラー:', error);
    }
  };

  const handleOpenDialog = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setSelectedVideo(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await addDoc(collection(db, 'videos'), {
        title,
        url,
        description,
        timestamp: new Date(),
      });
      await loadVideos();
      handleCloseDialog();
    } catch (error) {
      console.error('保存エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (video: Video) => {
    try {
      await deleteDoc(doc(db, 'videos', video.id));
      await loadVideos();
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          動画学習
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          動画を追加
        </Button>
      </Box>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} md={6} key={video.id}>
            <Card>
              <CardContent>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2 }}>
                  <iframe
                    src={getYouTubeEmbedUrl(video.url) || ''}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {video.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(video.timestamp).toLocaleString()}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(video)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>動画を追加</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="YouTube URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              helperText="YouTubeの動画URLを入力してください"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !url.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoLearning; 