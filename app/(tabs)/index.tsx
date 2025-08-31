import { Chess, Move, Square } from "chess.js";
import React, { useMemo, useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  SafeAreaView,
  StatusBar,
} from "react-native";

const defaultFEN =
  "5rk1/3q1r1p/1p1bQ1p1/8/1P4R1/7P/3N2P1/5R1K w - - 5 34";

function renderPiece(piece: string) {
  const pieces: Record<string, string> = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };
  return pieces[piece] || "";
}

export default function ChessPuzzle() {
  const [fen, setFEN] = useState(defaultFEN);
  const [chess, setChess] = useState<Chess>(new Chess(fen));
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [playWithRobot, setPlayWithRobot] = useState(false);
  const [isRobotThinking, setIsRobotThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  function updateGameStatus(chessInstance: Chess) {
    if (chessInstance.isCheckmate()) {
      setGameStatus(
        `Checkmate! ${chessInstance.turn() === "w" ? "Black" : "White"} wins!`
      );
    } else if (chessInstance.isDraw()) {
      if (chessInstance.isStalemate()) {
        setGameStatus("Draw by stalemate");
      } else if (chessInstance.isThreefoldRepetition()) {
        setGameStatus("Draw by repetition");
      } else if (chessInstance.isInsufficientMaterial()) {
        setGameStatus("Draw by insufficient material");
      } else {
        setGameStatus("Draw");
      }
    } else if (chessInstance.isCheck()) {
      setGameStatus(
        `${chessInstance.turn() === "w" ? "White" : "Black"} is in check`
      );
    } else {
      setGameStatus(
        `${chessInstance.turn() === "w" ? "White" : "Black"} to move`
      );
    }
  }

  useEffect(() => {
    updateGameStatus(chess);
  }, [chess]);

  function handleSquarePress(row: number, col: number) {
    if (isRobotThinking) return;

    const square: Square = (
      String.fromCharCode("a".charCodeAt(0) + col) + (8 - row)
    ) as Square;
    if (selected) {
      const fromSquare = (
        String.fromCharCode("a".charCodeAt(0) + selected.col) +
        (8 - selected.row)
      ) as Square;

      try {
        const move = chess.move({
          from: fromSquare,
          to: square,
        });

        if (move) {
          const newChess = new Chess(chess.fen());
          setChess(newChess);

          if (playWithRobot && !newChess.isGameOver()) {
            makeRobotMove(newChess);
          }
        }
      } catch (error) {
        Alert.alert(
          "Invalid Move",
          `The move from ${fromSquare} to ${square} is not allowed.`,
          [{ text: "OK" }]
        );
      }

      setSelected(null);
      setLegalMoves([]);
    } else {
      const piece = chess.get(square);
      if (
        playWithRobot &&
        piece &&
        piece.color !== (chess.turn() === "w" ? "w" : "b")
      ) {
        Alert.alert("Not Your Turn", "You can only move your own pieces.");
        return;
      }

      const moves: Move[] = chess.moves({ square, verbose: true }) as Move[];
      if (moves.length > 0) {
        setSelected({ row, col });
        setLegalMoves(moves.map((m: Move) => m.to as Square));
      }
    }
  }

  function makeRobotMove(chessInstance: Chess) {
    setIsRobotThinking(true);

    setTimeout(() => {
      if (!chessInstance.isGameOver()) {
        const moves = chessInstance.moves({ verbose: true });

        if (moves.length > 0) {
          let selectedMove;
          const capturingMoves = moves.filter((m) => m.flags.includes("c"));
          if (capturingMoves.length > 0) {
            selectedMove =
              capturingMoves[Math.floor(Math.random() * capturingMoves.length)];
          } else {
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
          }

          chessInstance.move(selectedMove);
          const newChessInstance = new Chess(chessInstance.fen());
          setChess(newChessInstance);
        }
      }
      setIsRobotThinking(false);
    }, 500);
  }

  function startNewGame() {
    const newChess = new Chess();
    setFEN(newChess.fen());
    setChess(newChess);
    setSelected(null);
    setLegalMoves([]);
    setIsRobotThinking(false);
  }

  const board = chess.board();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const boardSize = Math.min(screenWidth, screenHeight * 0.8) - 30;
  const squareSize = boardSize / 8;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <Text style={styles.title}>♟ Chess Game ♟</Text>
        <Text style={styles.status}>{gameStatus}</Text>

        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.button} onPress={startNewGame}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>

          <View style={styles.robotToggle}>
            <Text style={styles.robotText}>Play with Robot</Text>
            <Switch
              value={playWithRobot}
              onValueChange={setPlayWithRobot}
              trackColor={{ false: "#ccc", true: "#81b0ff" }}
              thumbColor={playWithRobot ? "#3478F6" : "#f4f3f4"}
            />
          </View>
        </View>

        {isRobotThinking && (
          <Text style={styles.thinkingText}>🤖 Robot is thinking...</Text>
        )}

        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {board.map(
            (
              rowArr: (null | { type: string; color: string })[],
              rowIdx: number
            ) => (
              <View key={rowIdx} style={styles.row}>
                {rowArr.map(
                  (
                    pieceObj: null | { type: string; color: string },
                    colIdx: number
                  ) => {
                    const piece = pieceObj ? pieceObj.type : "";
                    const color = pieceObj ? pieceObj.color : "";
                    const isSelected =
                      selected &&
                      selected.row === rowIdx &&
                      selected.col === colIdx;
                    const square: Square = (
                      String.fromCharCode("a".charCodeAt(0) + colIdx) +
                      (8 - rowIdx)
                    ) as Square;
                    const isLegal = legalMoves.includes(square);
                    const isDark = (rowIdx + colIdx) % 2 === 1;

                    return (
                      <TouchableOpacity
                        key={colIdx}
                        style={[
                          {
                            width: squareSize,
                            height: squareSize,
                            backgroundColor: isDark ? "#769656" : "#eeeed2",
                            alignItems: "center",
                            justifyContent: "center",
                          },
                          isSelected && {
                            borderWidth: 3,
                            borderColor: "yellow",
                          },
                        ]}
                        onPress={() => handleSquarePress(rowIdx, colIdx)}
                      >
                        {piece ? (
                          <Text
                            style={[
                              styles.piece,
                              { fontSize: squareSize * 0.8 },
                            ]}
                          >
                            {renderPiece(
                              color === "w"
                                ? piece.toUpperCase()
                                : piece.toLowerCase()
                            )}
                          </Text>
                        ) : null}

                        {!piece && isLegal && (
                          <View
                            style={{
                              width: squareSize * 0.25,
                              height: squareSize * 0.25,
                              borderRadius: squareSize * 0.125,
                              backgroundColor: "rgba(0,0,0,0.4)",
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
  },
  status: {
    fontSize: 18,
    marginBottom: 12,
    color: "#444",
  },
  controlRow: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3478F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  robotToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  robotText: {
    marginRight: 8,
    fontSize: 16,
    color: "#333",
  },
  thinkingText: {
    color: "#e74c3c",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  board: {
    flexDirection: "column",
    borderWidth: 4,
    borderColor: "#333",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  piece: {
    textAlign: "center",
  },
});