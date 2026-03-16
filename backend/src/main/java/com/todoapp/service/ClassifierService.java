package com.todoapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.*;

/**
 * Multinomial Naive Bayes text classifier with Laplace smoothing.
 * Training data is loaded from classifier-examples.json at startup.
 * Robust on short texts (3–5 words) where TF-IDF cosine similarity is fragile.
 */
@Service
public class ClassifierService {

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "is", "it", "in", "on", "at", "to", "for",
            "of", "and", "or", "but", "with", "my", "i", "me", "you", "we",
            "be", "do", "go", "get", "has", "have", "had", "was", "are", "by",
            "this", "that", "from", "up", "out", "so", "not", "no", "can",
            "will", "all", "some", "any", "if", "as", "into", "about", "its"
    );

    /** Total number of training examples per category. */
    private final Map<String, Integer> categoryCounts = new HashMap<>();

    /** Word frequency per category: category → (word → count). */
    private final Map<String, Map<String, Integer>> wordCounts = new HashMap<>();

    /** Total word tokens seen per category (denominator for P(word|category)). */
    private final Map<String, Integer> categoryWordTotals = new HashMap<>();

    /** Global vocabulary size (for Laplace smoothing). */
    private int vocabularySize;

    /** Total training examples across all categories. */
    private int totalExamples;

    @PostConstruct
    public void init() throws Exception {
        var mapper = new ObjectMapper();
        var resource = new ClassPathResource("classifier-examples.json");

        @SuppressWarnings("unchecked")
        List<Object> rawList = mapper.readValue(resource.getInputStream(), List.class);

        Set<String> globalVocab = new HashSet<>();

        for (Object item : rawList) {
            @SuppressWarnings("unchecked")
            Map<String, Object> ex = (Map<String, Object>) item;
            String category = (String) ex.get("category");
            String text = (String) ex.get("text");
            List<String> tokens = tokenize(text);

            categoryCounts.merge(category, 1, Integer::sum);
            wordCounts.computeIfAbsent(category, k -> new HashMap<>());

            for (String token : tokens) {
                globalVocab.add(token);
                wordCounts.get(category).merge(token, 1, Integer::sum);
                categoryWordTotals.merge(category, 1, Integer::sum);
            }
        }

        vocabularySize = globalVocab.size();
        totalExamples = categoryCounts.values().stream().mapToInt(Integer::intValue).sum();
    }

    /**
     * Classify a text string using Multinomial Naive Bayes.
     * Returns the most likely category name.
     */
    public String classify(String text) {
        List<String> tokens = tokenize(text);
        if (tokens.isEmpty()) return "General";

        String bestCategory = "General";
        double bestScore = Double.NEGATIVE_INFINITY;

        for (Map.Entry<String, Integer> entry : categoryCounts.entrySet()) {
            String category = entry.getKey();
            int catCount = entry.getValue();
            int totalWords = categoryWordTotals.getOrDefault(category, 0);
            Map<String, Integer> catWords = wordCounts.getOrDefault(category, Collections.emptyMap());

            // Log prior: log P(category)
            double score = Math.log((double) catCount / totalExamples);

            // Log likelihood: Σ log P(word | category) with Laplace smoothing
            for (String token : tokens) {
                int wordCount = catWords.getOrDefault(token, 0);
                score += Math.log((wordCount + 1.0) / (totalWords + vocabularySize));
            }

            if (score > bestScore) {
                bestScore = score;
                bestCategory = category;
            }
        }

        return bestCategory;
    }

    private List<String> tokenize(String text) {
        return Arrays.stream(text.toLowerCase().split("[^a-z0-9]+"))
                .filter(t -> t.length() > 2 && !STOP_WORDS.contains(t))
                .collect(Collectors.toList());
    }
}
