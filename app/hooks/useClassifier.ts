import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import type { Todo } from "~/types/todo";
import { CATEGORIES, type Category } from "~/utils/categorize";

// Minimum confidence to trust the predicted label; below this → "General"
const CONFIDENCE_THRESHOLD = 0.35;

const STORAGE_KEY = "todo-category-map";

// Diverse training examples — semantic, not keyword-based.
// The model (Universal Sentence Encoder) understands meaning, so examples
// don't need to share exact words with real todos.
const EXAMPLES: [string, Category][] = [
  // Shopping
  ["buy groceries for the week", "Shopping"],
  ["order a new laptop online", "Shopping"],
  ["pick up milk, eggs, and bread", "Shopping"],
  ["find a good deal on winter jackets", "Shopping"],
  ["add items to cart and checkout", "Shopping"],
  ["restock the pantry staples", "Shopping"],

  // Work
  ["prepare slides for the client presentation", "Work"],
  ["send the project proposal to my manager", "Work"],
  ["review open pull requests before the sprint ends", "Work"],
  ["schedule a standup with the engineering team", "Work"],
  ["write the quarterly performance report", "Work"],
  ["follow up on the invoice with accounting", "Work"],

  // Home
  ["deep clean the bathroom and kitchen", "Home"],
  ["fix the leaking faucet under the sink", "Home"],
  ["do the laundry and fold the clothes", "Home"],
  ["organize clutter in the garage", "Home"],
  ["vacuum the rugs and mop the floors", "Home"],
  ["replace the broken light bulb in the hallway", "Home"],

  // Health
  ["hit the gym for a leg day workout", "Health"],
  ["book a dentist check-up appointment", "Health"],
  ["take morning vitamins after breakfast", "Health"],
  ["go for a 5km run in the park", "Health"],
  ["meditate for 20 minutes before bed", "Health"],
  ["pick up the blood pressure prescription", "Health"],

  // Study
  ["read chapter 5 of the physics textbook", "Study"],
  ["finish the programming assignment due Friday", "Study"],
  ["study for the calculus midterm exam", "Study"],
  ["complete the online React course module", "Study"],
  ["practice Spanish vocabulary for an hour", "Study"],
  ["watch the recorded lecture on machine learning", "Study"],

  // Finance
  ["pay the electricity and internet bills", "Finance"],
  ["transfer money to the emergency savings fund", "Finance"],
  ["cancel the unused streaming subscription", "Finance"],
  ["file the annual tax return before the deadline", "Finance"],
  ["review last month's bank statement", "Finance"],
  ["set up automatic rent payment", "Finance"],

  // Personal
  ["call mom on her birthday", "Personal"],
  ["buy an anniversary gift for my partner", "Personal"],
  ["plan a dinner party for close friends", "Personal"],
  ["visit grandparents this weekend", "Personal"],
  ["write a thank-you card for the neighbor", "Personal"],
  ["pick a restaurant for the family reunion", "Personal"],

  // General
  ["take care of this later", "General"],
  ["figure out what to do with this", "General"],
  ["handle the remaining miscellaneous items", "General"],
  ["get this sorted out at some point", "General"],
  ["check on the status of this thing", "General"],
];

export type CategoryMap = Record<string, Category>;

function loadStoredCategories(): CategoryMap {
  // Guard against SSR — localStorage is only available in the browser.
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CategoryMap) : {};
  } catch {
    return {};
  }
}

export function useClassifier(todos: Todo[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifierRef = useRef<any>(null);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const pendingIds = useRef<Set<string>>(new Set());
  const [classifierReady, setClassifierReady] = useState(false);
  console.log(classifierReady)
  // Load stored categories synchronously before the browser paints (mirrors
  // the same useLayoutEffect pattern used in useTodos). Both effects fire in
  // the same pre-paint batch so todos + categoryMap are ready together,
  // preventing any empty-chip flash on reload.
  useLayoutEffect(() => {
    const stored = loadStoredCategories();
    if (Object.keys(stored).length === 0) return;
    setCategoryMap(stored);
    Object.keys(stored).forEach((id) => pendingIds.current.add(id));
  }, []);

  // Persist categoryMap to localStorage whenever it changes.
  useEffect(() => {
    if (Object.keys(categoryMap).length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categoryMap));
    } catch {}
  }, [categoryMap]);

  // Seed categories from external data (e.g. imported todos with embedded categories).
  const seedCategories = useCallback((incoming: Partial<CategoryMap>) => {
    const entries = Object.entries(incoming).filter(
      (entry): entry is [string, Category] => entry[1] !== undefined
    );
    if (entries.length === 0) return;
    setCategoryMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    entries.forEach(([id]) => pendingIds.current.add(id));
  }, []);

  // Boot the classifier once on the client (useEffect never runs on the server).
  useEffect(() => {
    let cancelled = false;
    import("@energetic-ai/classifiers").then(({ initClassifier }) =>
      import("@energetic-ai/model-embeddings-en").then(({ modelSource }) =>
        initClassifier(EXAMPLES, modelSource)
      )
    ).then((clf) => {
      if (cancelled) return;
      classifierRef.current = clf;
      setClassifierReady(true);
    }).catch(() => {
      // Fallback: try without the local model (downloads from TF Hub ~2 s)
      if (cancelled) return;
      import("@energetic-ai/classifiers").then(({ initClassifier }) =>
        initClassifier(EXAMPLES)
      ).then((clf) => {
        if (cancelled) return;
        classifierRef.current = clf;
        setClassifierReady(true);
      });
    });
    return () => { cancelled = true; };
  }, []);

  // Classify any todos that haven't been processed yet.
  useEffect(() => {
    const clf = classifierRef.current;
    if (!clf || todos.length === 0) return;

    const unprocessed = todos.filter((t) => {
      // Already tracked as in-flight or done.
      if (pendingIds.current.has(t.id)) return false;
      // Already in categoryMap (e.g. loaded from localStorage) — sync
      // pendingIds and skip to avoid re-classifying on every reload.
      if (categoryMap[t.id] !== undefined) {
        pendingIds.current.add(t.id);
        return false;
      }
      return true;
    });
    if (unprocessed.length === 0) return;

    // Mark as in-flight immediately so a subsequent render doesn't re-submit them.
    unprocessed.forEach((t) => pendingIds.current.add(t.id));

    const texts = unprocessed.map((t) => t.text);

    (texts.length === 1
      ? clf.classify(texts[0]).then((r: unknown) => [r])
      : clf.classify(texts)
    ).then((results: { label: string; confidences: Record<string, number> }[]) => {
      setCategoryMap((prev) => {
        const next = { ...prev };
        unprocessed.forEach((todo, i) => {
          const result = results[i];
          const confidence = result.confidences?.[result.label] ?? 0;
          next[todo.id] =
            confidence >= CONFIDENCE_THRESHOLD
              ? (result.label as Category)
              : "General";
        });
        return next;
      });
    });
  }, [todos, classifierReady, categoryMap]);

  // Prune stale IDs when todos are deleted to free memory.
  useEffect(() => {
    const current = new Set(todos.map((t) => t.id));
    pendingIds.current.forEach((id) => {
      if (!current.has(id)) pendingIds.current.delete(id);
    });
    // Also remove from categoryMap (localStorage will update via the save effect)
    setCategoryMap((prev) => {
      const stale = Object.keys(prev).filter((id) => !current.has(id));
      if (stale.length === 0) return prev;
      const next = { ...prev };
      stale.forEach((id) => delete next[id]);
      return next;
    });
  }, [todos]);

  return { categoryMap, classifierReady, seedCategories, CATEGORIES };
}
