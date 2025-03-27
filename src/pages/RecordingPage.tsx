import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Mic, Stop, PlayArrow, Save } from '@mui/icons-material';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../config/firebase';

const RecordingPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('マイクへのアクセスに失敗しました。マイクの権限を確認してください。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveRecording = async () => {
    if (!audioBlob || !auth.currentUser) return;

    try {
      setIsUploading(true);
      setError(null);

      const timestamp = new Date().toISOString();
      const fileName = `recordings/${auth.currentUser.uid}/${timestamp}.wav`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, audioBlob);
      const downloadUrl = await getDownloadURL(storageRef);

      // TODO: 録音データをデータベースに保存
      console.log('Recording saved:', downloadUrl);

      // 成功メッセージを表示
      alert('録音を保存しました！');
    } catch (err) {
      setError('録音の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontFamily: 'Mochiy Pop One' }}
        >
          おはなしを ろくおんしよう！
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, fontFamily: 'Mochiy Pop One' }}
        >
          マイクボタンを おして はじめてください。
          おわりたいときは とまるボタンを おしてください。
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color={isRecording ? 'error' : 'primary'}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            startIcon={isRecording ? <Stop /> : <Mic />}
            sx={{ fontFamily: 'Mochiy Pop One' }}
          >
            {isRecording ? 'とまる' : 'はじめる'}
          </Button>

          {audioUrl && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={playRecording}
                disabled={isUploading}
                startIcon={<PlayArrow />}
                sx={{ fontFamily: 'Mochiy Pop One' }}
              >
                きく
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={saveRecording}
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={20} /> : <Save />}
                sx={{ fontFamily: 'Mochiy Pop One' }}
              >
                ほぞん
              </Button>
            </>
          )}
        </Box>

        {isRecording && (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 1, fontFamily: 'Mochiy Pop One' }}>
              ろくおんちゅう...
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RecordingPage; 