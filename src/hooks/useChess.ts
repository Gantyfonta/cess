import { Chess, Move } from 'chess.js';
import { useState, useCallback, useMemo } from 'react';

export function useChess() {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const board = useMemo(() => game.board(), [game]);
  const turn = game.turn();
  const isCheck = game.inCheck();
  const isGameOver = game.isGameOver();
  const isCheckmate = game.isCheckmate();
  const isDraw = game.isDraw();
  const isStalemate = game.isStalemate();

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setMoveHistory(h => [...h, result]);
        setLastMove({ from: result.from, to: result.to });
        setSelectedSquare(null);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setSelectedSquare(null);
    setLastMove(null);
  }, []);

  const undoMove = useCallback(() => {
    game.undo();
    setGame(new Chess(game.fen()));
    setMoveHistory(h => h.slice(0, -1));
    const last = game.history({ verbose: true }).pop();
    setLastMove(last ? { from: last.from, to: last.to } : null);
    setSelectedSquare(null);
  }, [game]);

  const getValidMoves = useCallback((square: string) => {
    return game.moves({ square: square as any, verbose: true });
  }, [game]);

  return {
    board,
    turn,
    isCheck,
    isGameOver,
    isCheckmate,
    isDraw,
    isStalemate,
    makeMove,
    resetGame,
    undoMove,
    getValidMoves,
    selectedSquare,
    setSelectedSquare,
    lastMove,
    moveHistory,
    fen: game.fen()
  };
}
