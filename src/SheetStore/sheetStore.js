import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

export const useSheetStore = create(
  persist(
    (set) => ({
      topics: [],
      loading: false,
      error: null,

      /* ---------- API HYDRATION ---------- */
      setTopics: (topics) => set({ topics }),
      setLoading: (value) => set({ loading: value }),
      setError: (msg) => set({ error: msg }),

      /* ---------- TOPIC ---------- */
      addTopic: (title) =>
        set((state) => ({
          topics: [...state.topics, { id: uuid(), title, subTopics: [] }],
        })),

      updateTopic: (topicId, title) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId ? { ...t, title } : t,
          ),
        })),

      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        })),

      reorderTopics: (fromIndex, toIndex) =>
        set((state) => {
          const arr = [...state.topics];
          const [moved] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, moved);
          return { topics: arr };
        }),

      /* ---------- SUB-TOPIC ---------- */
      addSubTopic: (topicId, title) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: [
                    ...t.subTopics,
                    {
                      id: uuid(),
                      title,
                      questions: [],
                    },
                  ],
                }
              : t,
          ),
        })),

      updateSubTopic: (topicId, subTopicId, title) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId ? { ...st, title } : st,
                  ),
                }
              : t,
          ),
        })),

      deleteSubTopic: (topicId, subTopicId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.filter((st) => st.id !== subTopicId),
                }
              : t,
          ),
        })),

      reorderSubTopics: (topicId, fromIndex, toIndex) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: (() => {
                    const arr = [...t.subTopics];
                    const [moved] = arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, moved);
                    return arr;
                  })(),
                }
              : t,
          ),
        })),

      /* ---------- QUESTIONS ---------- */
      addQuestion: (topicId, subTopicId, title) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: [
                            ...st.questions,
                            {
                              id: uuid(),
                              title,
                              difficulty: "Easy",
                              solved: false,
                              starred: false,
                            },
                          ],
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),

      updateQuestion: (topicId, subTopicId, questionId, title) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: st.questions.map((q) =>
                            q.id === questionId ? { ...q, title } : q,
                          ),
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),

      deleteQuestion: (topicId, subTopicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: st.questions.filter(
                            (q) => q.id !== questionId,
                          ),
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),

      toggleSolved: (topicId, subTopicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: st.questions.map((q) =>
                            q.id === questionId
                              ? { ...q, solved: !q.solved }
                              : q,
                          ),
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),

      toggleStar: (topicId, subTopicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: st.questions.map((q) =>
                            q.id === questionId
                              ? { ...q, starred: !q.starred }
                              : q,
                          ),
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),

      reorderQuestions: (topicId, subTopicId, fromIndex, toIndex) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId
                      ? {
                          ...st,
                          questions: (() => {
                            const arr = [...st.questions];
                            const [moved] = arr.splice(fromIndex, 1);
                            arr.splice(toIndex, 0, moved);
                            return arr;
                          })(),
                        }
                      : st,
                  ),
                }
              : t,
          ),
        })),
    }),
    {
      name: "question-sheet-store", // localStorage key
    },
  ),
);
