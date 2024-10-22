import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Visibility,
  Delete,
  Sort
} from '@mui/icons-material';

const QuizHistoryTable = ({ historyData, onViewDetails, onDeleteQuiz }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAverageScore = (quiz) => {
    const scores = quiz.questions.map(q => {
      const score = parseFloat(q.score);
      return quiz.quizType.includes("mcqs") ? score : score;
    });
    return scores.length ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const sortData = (data) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortConfig.key === 'score') {
        return calculateAverageScore(a) - calculateAverageScore(b);
      }
      if (sortConfig.key === 'questions') {
        return a.questions.length - b.questions.length;
      }
      return 0;
    });

    if (sortConfig.direction === 'desc') {
      sortedData.reverse();
    }
    return sortedData;
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleMenuOpen = (event, quiz) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuiz(quiz);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuiz(null);
  };

  const handleAction = (action) => {
    if (selectedQuiz) {
      if (action === 'view') {
        onViewDetails(selectedQuiz);
      } else if (action === 'delete') {
        onDeleteQuiz(selectedQuiz._id);
      }
    }
    handleMenuClose();
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Quiz History
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>
                  <Button
                    endIcon={sortConfig.key === 'createdAt' ? 
                      (sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />) : 
                      <Sort />}
                    onClick={() => handleSort('createdAt')}
                    sx={{ textTransform: 'none' }}
                  >
                    Date
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    endIcon={sortConfig.key === 'score' ? 
                      (sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />) : 
                      <Sort />}
                    onClick={() => handleSort('score')}
                    sx={{ textTransform: 'none' }}
                  >
                    Score
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    endIcon={sortConfig.key === 'questions' ? 
                      (sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />) : 
                      <Sort />}
                    onClick={() => handleSort('questions')}
                    sx={{ textTransform: 'none' }}
                  >
                    Questions
                  </Button>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(historyData).map((quiz, index) => {
                const score = calculateAverageScore(quiz);
                return (
                  <TableRow key={quiz._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${score.toFixed(1)}%`}
                        color={getScoreColor(score)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>
                      <Chip
                        label={quiz.quizType}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, quiz)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {historyData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No quiz history found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Take a quiz to start building your history!
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction('view')}>
            <Visibility sx={{ mr: 1 }} /> View Details
          </MenuItem>
          <MenuItem 
            onClick={() => handleAction('delete')}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default QuizHistoryTable;