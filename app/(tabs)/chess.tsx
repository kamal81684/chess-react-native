import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

function renderPiece(piece: string) {
  const pieces: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };
  return pieces[piece] || '';
}

export default function Chess() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState<{row: number, col: number} | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');

  function handleSquarePress(row: number, col: number) {
    if (selected) {
      // Simple move: move selected piece to new square
      const piece = board[selected.row][selected.col];
      if ((turn === 'w' && piece === piece.toUpperCase()) || (turn === 'b' && piece === piece.toLowerCase())) {
        const newBoard = board.map(arr => arr.slice());
        newBoard[row][col] = piece;
        newBoard[selected.row][selected.col] = '';
        setBoard(newBoard);
        setSelected(null);
        setTurn(turn === 'w' ? 'b' : 'w');
      } else {
        setSelected(null);
      }
    } else if (board[row][col]) {
      setSelected({ row, col });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess</Text>
      <View style={styles.board}>
        {board.map((rowArr, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {rowArr.map((piece, colIdx) => {
              const isSelected = selected && selected.row === rowIdx && selected.col === colIdx;
              const isWhite = (rowIdx + colIdx) % 2 === 0;
              return (
                <TouchableOpacity
                  key={colIdx}
                  style={[styles.square, isWhite ? styles.white : styles.black, isSelected && styles.selected]}
                  onPress={() => handleSquarePress(rowIdx, colIdx)}
                >
                  <Text style={styles.piece}>{renderPiece(piece)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <Text style={styles.turn}>Turn: {turn === 'w' ? 'White' : 'Black'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    backgroundColor: '#eee',
  },
  black: {
    backgroundColor: '#888',
  },
  selected: {
    borderWidth: 2,
    borderColor: 'red',
  },
  piece: {
    fontSize: 24,
  },
  turn: {
    marginTop: 16,
    fontSize: 18,
  },
});