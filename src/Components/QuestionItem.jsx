import { useState, useEffect } from "react";
import { useSheetStore } from "../SheetStore/sheetStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function QuestionItem({ question, topicId, subTopicId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(question.title);

  const { updateQuestion, deleteQuestion, toggleSolved, toggleStar } =
    useSheetStore();

  useEffect(() => {
    setValue(question.title);
  }, [question.title]);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function save() {
    updateQuestion(topicId, subTopicId, question.id, value.trim());
    setIsEditing(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        grid grid-cols-[20px_24px_1fr_auto_auto]
        items-center gap-3
        px-3 py-2 rounded-lg
        bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800
        border border-gray-200 dark:border-transparent transition-colors shadow-sm dark:shadow-none
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag Handle */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
        title="Drag to reorder"
      >
        ⠿
      </span>

      {/* Solved */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleSolved(topicId, subTopicId, question.id);
        }}
        className={`w-4 h-4 rounded-full border-2 cursor-pointer ${question.solved ? "bg-green-500 border-green-500" : "border-green-500"
          }`}
      />

      {/* Title */}
      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="bg-transparent border-b border-gray-300 dark:border-gray-700 outline-none text-gray-900 dark:text-white"
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="cursor-pointer text-gray-700 dark:text-gray-200"
          onClick={() => setIsEditing(true)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {question.title}
        </span>
      )}

      {/* Difficulty */}
      <span
        className={`text-xs px-2 py-1 rounded ${difficultyStyles[question.difficulty]
          }`}
      >
        {question.difficulty}
      </span>

      {/* Actions */}
      <div className="flex gap-2 items-center">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(topicId, subTopicId, question.id);
          }}
          className={`transition-colors ${question.starred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
            }`}
          title="Mark important"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            deleteQuestion(topicId, subTopicId, question.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Delete question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.56.125a.301.301 0 00-.236.257l-.427 10.435h.001A8.257 8.257 0 019.24 20.485h-.033a8.257 8.257 0 01-9.423-2.977l-.427-10.435a.301.301 0 00-.236-.257l-.56-.125a.75.75 0 01-.49-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
