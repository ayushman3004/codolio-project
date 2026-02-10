import { useState, useEffect, forwardRef } from "react";
import SubTopicCard from "./SubtopicCard";
import { useSheetStore } from "../SheetStore/sheetStore";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TopicCard = forwardRef(({ topic }, ref) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(topic.title);

  const { updateTopic, deleteTopic, addSubTopic, reorderSubTopics } =
    useSheetStore();

  useEffect(() => setValue(topic.title), [topic.title]);

  function save() {
    updateTopic(topic.id, value.trim() || topic.title);
    setEditing(false);
  }

  const total = topic.subTopics.reduce(
    (a, s) => a + s.questions.length,
    0
  );
  const solved = topic.subTopics.reduce(
    (a, s) => a + s.questions.filter((q) => q.solved).length,
    0
  );

  /* ---------- SORTABLE ---------- */
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ✅ MERGE refs (DnD + scroll)
  function setRefs(node) {
    setNodeRef(node);
    if (ref) ref.current = node;
  }

  function handleSubTopicDrag({ active, over }) {
    if (!over || active.id === over.id) return;

    const oldIndex = topic.subTopics.findIndex(
      (s) => s.id === active.id
    );
    const newIndex = topic.subTopics.findIndex(
      (s) => s.id === over.id
    );

    reorderSubTopics(topic.id, oldIndex, newIndex);
  }

  return (
    <div
      ref={setRefs}
      style={style}
      className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 shadow-sm dark:shadow-none transition-colors"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* DRAG HANDLE */}
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500"
            title="Drag topic"
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
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="cursor-pointer font-medium text-lg text-gray-900 dark:text-gray-100"
            >
              {topic.title}
            </span>
          )}

          {/* PROGRESS */}
          <span className="text-sm text-gray-400">
            {solved} / {total}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addSubTopic(topic.id, "New Sub-topic");
            }}
            className="text-blue-500"
          >
            + Sub-topic
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTopic(topic.id);
            }}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* SUB-TOPICS */}
      {open && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleSubTopicDrag}
        >
          <SortableContext
            items={topic.subTopics.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="px-4 pb-4 space-y-3">
              {topic.subTopics.map((sub) => (
                <SubTopicCard
                  key={sub.id}
                  subTopic={sub}
                  topicId={topic.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
});

export default TopicCard;