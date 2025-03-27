import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Mic as MicIcon,
  Book as BookIcon,
  Bookmark as BookmarkIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAnimalTheme } = useTheme();

  const features = [
    {
      title: isAnimalTheme ? 'ろくおんきのう' : '録音機能',
      description: isAnimalTheme 
        ? 'じぶんのこえをろくおんして、はなしかたのとくちょうをしらべて、なおすポイントをみつけましょう。'
        : '自分の声を録音して、発話の特徴を分析し、改善点を見つけましょう。',
      icon: <MicIcon sx={{ fontSize: 40 }} />,
      path: '/recording',
    },
    {
      title: isAnimalTheme ? 'おんどくれんしゅう' : '音読練習',
      description: isAnimalTheme
        ? 'ぶんしょうをよんで、なめらかなはなしかたをれんしゅうしましょう。'
        : '文章を音読して、滑らかな発話を練習しましょう。',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      path: '/practice',
    },
    {
      title: isAnimalTheme ? 'にっききのう' : '日記機能',
      description: isAnimalTheme
        ? 'れんしゅうのきろくやきもちをにっきにのこして、がんばりをかんりしましょう。'
        : '練習の記録や気づきを日記に残して、進捗を管理しましょう。',
      icon: <BookmarkIcon sx={{ fontSize: 40 }} />,
      path: '/diary',
    },
    {
      title: isAnimalTheme ? 'どうががくしゅう' : '動画学習',
      description: isAnimalTheme
        ? 'せんもんかのせんせいのどうがでべんきょうしましょう。'
        : '専門家による治療法やトレーニング方法を動画で学習できます。',
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
      path: '/video-learning',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ fontFamily: 'Mochiy Pop One' }}
        >
          {isAnimalTheme ? 'きつおんかいぜんトレーニング' : '吃音改善トレーニング'}
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          align="center" 
          color="text.secondary"
          sx={{ fontFamily: 'Mochiy Pop One' }}
        >
          {isAnimalTheme 
            ? 'あなたにぴったりのれんしゅうをしましょう'
            : '個人に最適化された効果的なトレーニングを提供します'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  transition: 'all 0.3s ease-in-out',
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {feature.icon}
                <Typography 
                  gutterBottom 
                  variant="h5" 
                  component="h2"
                  sx={{ 
                    mt: 2,
                    fontFamily: 'Mochiy Pop One',
                    fontSize: isAnimalTheme ? '1.4rem' : '1.5rem'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{ 
                    fontFamily: 'Mochiy Pop One',
                    fontSize: isAnimalTheme ? '0.9rem' : '1rem'
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 