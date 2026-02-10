import { useEffect, useRef } from "react";
import TopicCard from "../Components/TopicCard";
import SideNavbar from "../Components/SideNavbar";
import DescriptionBox from "../Components/DescriptionBox";
import { useSheetStore } from "../SheetStore/sheetStore";
import { fetchSheet } from "../api/sheetApi";
import { buildSheetTree } from "../utils/buildSheetTree";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function SheetPage() {
  const { topics, setTopics, setLoading, setError, loading, error, addTopic, reorderTopics } =
    useSheetStore();

  // 🔽 scroll anchor
  const bottomRef = useRef(null);

  // 🔑 controls when scrolling should happen
  const shouldScroll = useRef(false);

  // 🖱️ DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = topics.findIndex((t) => t.id === active.id);
      const newIndex = topics.findIndex((t) => t.id === over.id);
      reorderTopics(oldIndex, newIndex);
    }
  }

  /* ---------------- API HYDRATION ---------------- */
  useEffect(() => {
    if (topics.length > 0) return;

    async function loadSheet() {
      try {
        setLoading(true);

        const response = await fetchSheet();
        const questions = response.data.questions;

        const tree = buildSheetTree(questions);
        setTopics(tree);
      } catch (err) {
        setError(err.message || "Failed to load sheet");
      } finally {
        setLoading(false);
      }
    }

    loadSheet();
  }, [topics.length, setTopics, setLoading, setError]);

  /* ---------------- SMOOTH SCROLL (USER ONLY) ---------------- */
  useEffect(() => {
    if (!shouldScroll.current) return;

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // reset after scrolling
    shouldScroll.current = false;
  }, [topics.length]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black transition-colors">
      {/* SIDEBAR */}
      <SideNavbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Question Management Sheet</h1>

          <button
            onClick={() => {
              shouldScroll.current = true; // 👈 mark as user action
              addTopic("New Topic");
            }}
            className="px-4 py-2 rounded text-white "
          >
            + Add Topic
          </button>
        </div>

        {/* DESCRIPTION */}
        <DescriptionBox />

        {/* TOPICS */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topics.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}

              {/* scroll anchor */}
              <div ref={bottomRef} />
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}
