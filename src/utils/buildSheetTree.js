function normalizeDifficulty(difficulty) {
  if (!difficulty) return "Easy";

  const d = difficulty.toLowerCase();

  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  if (d === "hard") return "Hard";

  return "Easy";
}

export function buildSheetTree(questions) {
  const topicMap = {};

  questions.forEach((q) => {
    console.log("QUESTION FROM API:", q.difficulty);
    const topicName = q.topic || "Untitled Topic";
    const subTopicName = q.subTopic || "General";

    if (!topicMap[topicName]) {
      topicMap[topicName] = {
        id: topicName,
        title: topicName,
        subTopics: {},
      };
    }

    if (!topicMap[topicName].subTopics[subTopicName]) {
      topicMap[topicName].subTopics[subTopicName] = {
        id: `${topicName}-${subTopicName}`,
        title: subTopicName,
        questions: [],
      };
    }

    topicMap[topicName].subTopics[subTopicName].questions.push({
      id: q._id,
      title: q.title,
      difficulty: normalizeDifficulty(q.difficulty), // ✅ FIX
      solved: false,
      starred: false,
    });
  });

  return Object.values(topicMap).map((topic) => ({
    id: topic.id,
    title: topic.title,
    subTopics: Object.values(topic.subTopics),
  }));
}