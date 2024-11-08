import { FiPlus } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useBoardContext, useSidebar, useTheme } from "../../contexts/";
import { GithubButton } from "../shared";
import {
  SidebarCollapsed,
  SidebarHeader,
  BoardList,
  BoardListHeader,
} from "./";

export const Sidebar = () => {
  const { boards, activeBoardId, addNewBoard, editBoard } = useBoardContext();
  const { theme } = useTheme();

  const {
    isCollapsed,
    setIsCollapsed,
    showBoardCreator,
    setShowBoardCreator,
    editingBoardId,
    setEditingBoardId,
    setActivePopoverBoard,
  } = useSidebar();

  const [editedTitle, setEditedTitle] = useState("");
  const addButtonRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingBoardId) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingBoardId]);

  const handleCreateBoard = (title, color) => {
    addNewBoard(title, color);
  };

  function handleTitleSubmit(boardId) {
    if (editedTitle.trim() !== "") {
      editBoard(boardId, editedTitle.trim());
      setEditingBoardId(null);
    }
  }

  function handleEdit(boardId) {
    setEditedTitle(boards[activeBoardId].title);
    setEditingBoardId(boardId);
    setActivePopoverBoard(null);
  }

  if (isCollapsed) {
    return (
      <SidebarCollapsed
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
    );
  }

  return (
    <div
      className="z-10 h-full flex-shrink-0 w-52 backdrop-blur-md text-text-secondary border-r border-border shadow-md"
      // Glassy look for sidebar, gradient with board color
      style={{
        backgroundColor: `var(--bg-sidebar-overlay)`,
        backgroundImage: boards[activeBoardId]?.color
          ? `linear-gradient(90deg, ${boards[activeBoardId].color.replace(", 1)", ", 0.2)")} 100%, var(--bg-sidebar-overlay) 0%, rgba(0, 0, 0, 0))`
          : undefined,
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <BoardListHeader
          addButtonRef={addButtonRef}
          handleCreateBoard={handleCreateBoard}
        />

        {activeBoardId ? (
          <BoardList
            boards={boards}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            handleEdit={handleEdit}
            handleTitleSubmit={handleTitleSubmit}
            inputRef={inputRef}
            showBoardCreator={showBoardCreator}
            setShowBoardCreator={setShowBoardCreator}
            handleCreateBoard={handleCreateBoard}
            addButtonRef={addButtonRef}
          />
        ) : (
          <EmptyBoardMessage />
        )}
        <div className="mt-auto">
          <GithubButton link="https://github.com/raknos13/planero-planner-react" />
        </div>
      </div>
    </div>
  );
};

const EmptyBoardMessage = () => {
  return (
    <span className="p-3 text-xs text-text-secondary ml-5">
      {/* If no boards exist show this message */}
      Click{" "}
      <span className="inline-block">
        <FiPlus />
      </span>{" "}
      to add a board
    </span>
  );
};
