import { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import { useSheetStore } from "../SheetStore/sheetStore";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SubTopicCard({ subTopic, topicId }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(subTopic.title);

  const { updateSubTopic, deleteSubTopic, addQuestion, reorderQuestions } =
    useSheetStore();

  useEffect(() => setValue(subTopic.title), [subTopic.title]);

  function save() {
    updateSubTopic(topicId, subTopic.id, value.trim() || subTopic.title);
    setEditing(false);
  }

  /* ---------- SORTABLE ---------- */
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: subTopic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleQuestionDrag({ active, over }) {
    if (!over || active.id === over.id) return;

    const oldIndex = subTopic.questions.findIndex((q) => q.id === active.id);
    const newIndex = subTopic.questions.findIndex((q) => q.id === over.id);

    reorderQuestions(topicId, subTopic.id, oldIndex, newIndex);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      {/* HEADER */}
      <div className="flex justify-between px-3 py-2 items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* DRAG HANDLE (ONLY THIS DRAGS) */}
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500"
            title="Drag sub-topic"
          >
            ⠿
          </span>

          {/* COLLAPSE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {open ? "⌄" : "›"}
          </button>

          {/* TITLE */}
          {editing ? (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="bg-transparent border-b border-gray-300 dark:border-gray-700 outline-none text-gray-900 dark:text-white"
            />
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="cursor-pointer font-medium text-gray-800 dark:text-gray-200"
            >
              {subTopic.title}
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addQuestion(topicId, subTopic.id, "New Question");
            }}
            className="text-green-500"
          >
            + Question
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSubTopic(topicId, subTopic.id);
            }}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {/* QUESTIONS */}
      {open && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleQuestionDrag}
        >
          <SortableContext
            items={subTopic.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="px-3 pb-3 space-y-2">
              {subTopic.questions.map((q) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  topicId={topicId}
                  subTopicId={subTopic.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
