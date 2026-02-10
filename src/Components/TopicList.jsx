import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSheetStore } from "../SheetStore/sheetStore";
import TopicCard from "./TopicCard";

export default function TopicList() {
  const topics = useSheetStore((s) => s.topics);
  const reorderTopics = useSheetStore((s) => s.reorderTopics);

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    const oldIndex = topics.findIndex((t) => t.id === active.id);
    const newIndex = topics.findIndex((t) => t.id === over.id);

    reorderTopics(oldIndex, newIndex);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={topics.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
