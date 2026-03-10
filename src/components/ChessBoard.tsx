import React, { useMemo } from 'react';
import { useChess } from '../hooks/useChess';
import { PIECES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChessBoard: React.FC = () => {
  const {
    board,
    turn,
    makeMove,
    selectedSquare,
    setSelectedSquare,
    getValidMoves,
    lastMove,
    isCheck,
    isGameOver,
    isCheckmate,
    isDraw,
    isStalemate,
    resetGame,
    undoMove,
    moveHistory
  } = useChess();

  const validMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return getValidMoves(selectedSquare);
  }, [selectedSquare, getValidMoves]);

  const handleSquareClick = (square: string) => {
    if (isGameOver) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      return;
    }

    const move = validMoves.find(m => m.to === square);
    if (move) {
      // Handle promotion - default to queen for simplicity in this version
      const promotion = move.flags.includes('p') ? 'q' : undefined;
      makeMove({ from: selectedSquare!, to: square, promotion });
      return;
    }

    const piece = board.flat().find(p => p?.square === square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const renderSquare = (row: number, col: number) => {
    const squareNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const squareName = `${squareNames[col]}${8 - row}`;
    const piece = board[row][col];
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare === squareName;
    const isValidMove = validMoves.some(m => m.to === squareName);
    const isLastMove = lastMove?.from === squareName || lastMove?.to === squareName;
    const isKingInCheck = isCheck && piece?.type === 'k' && piece?.color === turn;

    return (
      <div
        key={squareName}
        onClick={() => handleSquareClick(squareName)}
        className={cn(
          "relative w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-200",
          isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]",
          isSelected && "bg-[#ffcf8b]",
          isLastMove && !isSelected && "bg-[#ffff3388]",
          isKingInCheck && "bg-red-500/80"
        )}
      >
        {/* Coordinates */}
        {col === 0 && (
          <span className={cn(
            "absolute top-0.5 left-0.5 text-[10px] font-bold select-none",
            isDark ? "text-[#f0d9b5]" : "text-[#b58863]"
          )}>
            {8 - row}
          </span>
        )}
        {row === 7 && (
          <span className={cn(
            "absolute bottom-0.5 right-0.5 text-[10px] font-bold select-none",
            isDark ? "text-[#f0d9b5]" : "text-[#b58863]"
          )}>
            {squareNames[col]}
          </span>
        )}

        {/* Piece */}
        {piece && (
          <div className="w-[85%] h-[85%] z-10 select-none">
            {PIECES[`${piece.color}${piece.type.toUpperCase()}`]}
          </div>
        )}

        {/* Move Indicator */}
        {isValidMove && (
          <div className={cn(
            "absolute z-20 rounded-full",
            piece ? "w-[80%] h-[80%] border-4 border-black/10" : "w-4 h-4 bg-black/10"
          )} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        {/* Game Status */}
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-4 h-4 rounded-full",
              turn === 'w' ? "bg-white border border-black/20" : "bg-black border border-white/20"
            )} />
            <span className="text-lg font-medium text-white">
              {isGameOver ? "Game Over" : `${turn === 'w' ? "White" : "Black"}'s Turn`}
            </span>
          </div>
          {isCheck && !isCheckmate && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded-full border border-red-500/30 animate-pulse">
              CHECK
            </span>
          )}
        </div>

        {/* The Board */}
        <div className="aspect-square w-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden shadow-2xl border-4 border-[#b58863]">
          {board.map((row, rowIndex) => 
            row.map((_, colIndex) => renderSquare(rowIndex, colIndex))
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all border border-white/10"
          >
            Undo
          </button>
          <button
            onClick={resetGame}
            className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl transition-all border border-red-500/30"
          >
            Reset Game
          </button>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col gap-4 h-full max-h-[600px]">
          <h3 className="text-xl font-bold text-white border-bottom border-white/10 pb-2">Move History</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {moveHistory.length === 0 ? (
              <p className="text-white/40 italic text-sm">No moves yet...</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="text-sm text-white/60 flex gap-2">
                      <span className="w-4 text-white/30">{i + 1}.</span>
                      <span className="font-mono text-white">{moveHistory[i * 2]?.san}</span>
                    </div>
                    {moveHistory[i * 2 + 1] && (
                      <div className="text-sm text-white/60 flex gap-2">
                        <span className="font-mono text-white">{moveHistory[i * 2 + 1]?.san}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {isGameOver && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isCheckmate ? "Checkmate!" : isDraw ? "Draw!" : "Game Over"}
            </h2>
            <p className="text-white/70 mb-4">
              {isCheckmate 
                ? `${turn === 'w' ? "Black" : "White"} wins the game.`
                : isStalemate 
                ? "Stalemate! No legal moves left."
                : "The game ended in a draw."}
            </p>
            <button
              onClick={resetGame}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
