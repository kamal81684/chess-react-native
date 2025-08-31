import { Chess, Move, Square } from 'chess.js';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const defaultFEN = '5rk1/3q1r1p/1p1bQ1p1/8/1P4R1/7P/3N2P1/5R1K w - - 5 34';

function renderPiece(piece: string) {
  const pieces: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };
  return pieces[piece] || '';
}

export default function ChessPuzzle() {
  const [fen, setFEN] = useState(defaultFEN);
  const [chess, setChess] = useState<Chess>(new Chess(fen));
  const [selected, setSelected] = useState<{row: number, col: number} | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  function handleSquarePress(row: number, col: number) {
    const square: Square = (String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row)) as Square;
    if (selected) {
      // Try to move
      const move = chess.move({ from: (String.fromCharCode('a'.charCodeAt(0) + selected.col) + (8 - selected.row)) as Square, to: square });
      if (move) {
        setChess(new Chess(chess.fen()));
        setSelected(null);
        setLegalMoves([]);
      } else {
        setSelected(null);
        setLegalMoves([]);
      }
    } else {
      // Show legal moves for this piece
      const moves: Move[] = chess.moves({ square, verbose: true }) as Move[];
      setSelected({ row, col });
      setLegalMoves(moves.map((m: Move) => m.to as Square));
    }
  }

  function handleFENChange(newFEN: string) {
    setFEN(newFEN);
    setChess(new Chess(newFEN));
    setSelected(null);
    setLegalMoves([]);
  }

  const board = chess.board();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Puzzle</Text>
      <TextInput
        style={styles.fenInput}
        value={fen}
        onChangeText={handleFENChange}
        placeholder="Enter FEN"
      />
      <View style={styles.board}>
        {board.map((rowArr: (null | { type: string; color: string })[], rowIdx: number) => (
          <View key={rowIdx} style={styles.row}>
            {rowArr.map((pieceObj: null | { type: string; color: string }, colIdx: number) => {
              const piece = pieceObj ? pieceObj.type : '';
              const color = pieceObj ? pieceObj.color : '';
              const isSelected = selected && selected.row === rowIdx && selected.col === colIdx;
              const square: Square = (String.fromCharCode('a'.charCodeAt(0) + colIdx) + (8 - rowIdx)) as Square;
              const isLegal = legalMoves.includes(square);
              return (
                <TouchableOpacity
                  key={colIdx}
                  style={[styles.square, isSelected && styles.selected, isLegal && styles.legal]}
                  onPress={() => handleSquarePress(rowIdx, colIdx)}
                >
                  <Text style={styles.piece}>{piece ? renderPiece(color === 'w' ? piece.toUpperCase() : piece.toLowerCase()) : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fenInput: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 8,
    marginBottom: 16,
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#222',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#888',
  },
  selected: {
    borderColor: 'red',
    borderWidth: 2,
  },
  legal: {
    backgroundColor: '#aaf',
  },
  piece: {
    fontSize: 24,
  },
});
