import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Question from '../models/Question.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@codecrack.ai',
    username: 'admin',
    password: 'Admin123!',
    role: 'admin',
    rank: 1,
    points: 9999,
    questionsSolved: 120,
    streak: 35,
    badges: ['Founder', 'Admin']
  },
  {
    name: 'Interview Ready',
    email: 'user@codecrack.ai',
    username: 'codecrack',
    password: 'User123!',
    role: 'user',
    rank: 32,
    points: 4200,
    questionsSolved: 42,
    streak: 12,
    badges: ['Rising Star']
  }
];

const categories = [
  { title: 'Arrays', icon: '🟦', slug: 'arrays', description: 'Practice array patterns and slicing techniques.' },
  { title: 'Strings', icon: '🟪', slug: 'strings', description: 'String manipulation and parsing challenges.' },
  { title: 'Graphs', icon: '🟩', slug: 'graphs', description: 'Graph traversals, shortest paths, and connectivity.' },
  { title: 'Dynamic Programming', icon: '🟧', slug: 'dynamic-programming', description: 'DP patterns, memoization and optimization.' }
];

const questionTemplates = [
  {
    titlePrefix: 'Two Sum',
    difficulty: 'Easy',
    category: 'arrays',
    subCategory: 'hash-tables',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target',
    example: { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'One valid answer exists.'],
    hints: ['Use a hash map to store seen values.', 'Solve in a single pass if possible.'],
    solution: 'Use a map to store value->index and check complements while iterating.',
    tags: ['hash-table', 'two-pointers', 'arrays'],
    companiesAsked: ['Google', 'Amazon', 'Meta'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    points: 100
  },
  {
    titlePrefix: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'strings',
    subCategory: 'dynamic-programming',
    problemStatement: 'Given a string s, return the longest palindromic substring in s',
    example: { input: 's = "babad"', output: '"bab"' },
    constraints: ['1 <= s.length <= 1000'],
    hints: ['Expand around each center.', 'Track the longest palindrome seen so far.'],
    solution: 'Use center expansion with O(n^2) time and O(1) space.',
    tags: ['strings', 'dynamic-programming'],
    companiesAsked: ['Microsoft', 'Apple'],
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'strings',
    subCategory: 'stack',
    problemStatement: 'Given a string containing just the characters (), {}, and [], determine if the input string is valid',
    example: { input: 's = "()[]{}"', output: 'true' },
    constraints: ['1 <= s.length <= 104'],
    hints: ['Use a stack to track opening brackets.', 'Match closing brackets with the stack top.'],
    solution: 'Push opening brackets to stack and verify closing brackets match.',
    tags: ['stack', 'strings'],
    companiesAsked: ['Facebook', 'LinkedIn'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    points: 100
  },
  {
    titlePrefix: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'arrays',
    subCategory: 'intervals',
    problemStatement: 'Given a collection of intervals, merge all overlapping intervals',
    example: { input: 'intervals = [[1,3],[2,6],[8,10]]', output: '[[1,6],[8,10]]' },
    constraints: ['0 <= intervals.length <= 104', '-106 <= start <= end <= 106'],
    hints: ['Sort intervals by start.', 'Merge overlapping ranges while scanning.'],
    solution: 'Sort intervals and merge overlaps in one pass.',
    tags: ['intervals', 'sorting', 'arrays'],
    companiesAsked: ['Uber', 'Salesforce'],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    points: 180
  },
  {
    titlePrefix: 'Number of Islands',
    difficulty: 'Medium',
    category: 'graphs',
    subCategory: 'dfs-bfs',
    problemStatement: 'Given a 2D grid of 1s and 0s, count the number of islands',
    example: { input: 'grid = [[1,1,0],[0,1,0],[1,0,1]]', output: '2' },
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    hints: ['Use DFS or BFS to mark visited land.', 'Traverse each cell and expand islands.'],
    solution: 'Perform DFS/BFS from unvisited land cells to count islands.',
    tags: ['graphs', 'dfs', 'bfs'],
    companiesAsked: ['Google', 'Amazon'],
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(m*n)',
    points: 180
  },
  {
    titlePrefix: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'dynamic-programming',
    subCategory: 'memoization',
    problemStatement: 'You are climbing a staircase. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top',
    example: { input: 'n = 3', output: '3' },
    constraints: ['1 <= n <= 45'],
    hints: ['Use Fibonacci-style recurrence.', 'Consider using memoization or tabulation.'],
    solution: 'Compute the number of ways iteratively with dynamic programming.',
    tags: ['dynamic-programming', 'math'],
    companiesAsked: ['Microsoft', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 100
  },
  {
    titlePrefix: 'Course Schedule',
    difficulty: 'Medium',
    category: 'graphs',
    subCategory: 'topological-sort',
    problemStatement: 'There are n courses and prerequisites. Determine if it is possible to finish all courses',
    example: { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    hints: ['Use DFS cycle detection or topological sort.', 'Graph is directed and may contain cycles.'],
    solution: 'Detect cycles in course prerequisites using DFS or Kahn’s algorithm.',
    tags: ['graphs', 'topological-sort'],
    companiesAsked: ['LinkedIn', 'Uber'],
    timeComplexity: 'O(n + p)',
    spaceComplexity: 'O(n + p)',
    points: 180
  },
  {
    titlePrefix: 'House Robber',
    difficulty: 'Medium',
    category: 'dynamic-programming',
    subCategory: 'dp',
    problemStatement: 'Given a list of non-negative integers representing money at each house, determine the maximum amount you can rob without robbing adjacent houses',
    example: { input: 'nums = [1,2,3,1]', output: '4' },
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: ['Decide whether to rob current house or not.', 'Use two-state DP for include/exclude.'],
    solution: 'Use dynamic programming to choose max of robbing current house or skipping it.',
    tags: ['dynamic-programming', 'arrays'],
    companiesAsked: ['Amazon', 'Google'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    category: 'graphs',
    subCategory: 'tree',
    problemStatement: 'Given a binary tree, return the inorder traversal of its nodes’ values',
    example: { input: 'root = [1,null,2,3]', output: '[1,3,2]' },
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
    hints: ['Use recursion or an explicit stack.', 'Traverse left, root, then right.'],
    solution: 'Perform an inorder traversal recursively or iteratively.',
    tags: ['tree', 'dfs'],
    companiesAsked: ['Facebook', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    points: 120
  },
  {
    titlePrefix: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'strings',
    subCategory: 'two-pointers',
    problemStatement: 'Given a string, determine if it is a palindrome considering only alphanumeric characters and ignoring cases',
    example: { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
    constraints: ['1 <= s.length <= 2 * 105'],
    hints: ['Use two pointers from both ends.', 'Skip non-alphanumeric characters.'],
    solution: 'Compare characters from both ends after normalizing case and filtering invalid characters.',
    tags: ['strings', 'two-pointers'],
    companiesAsked: ['Google', 'Apple'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 100
  },
  {
    titlePrefix: 'Find Peak Element',
    difficulty: 'Medium',
    category: 'arrays',
    subCategory: 'binary-search',
    problemStatement: 'A peak element is greater than its neighbors. Find a peak element index in an array',
    example: { input: 'nums = [1,2,3,1]', output: '2' },
    constraints: ['1 <= nums.length <= 1000', '-231 <= nums[i] <= 231 - 1'],
    hints: ['Binary search can find a peak in logarithmic time.', 'Compare mid and mid+1 to move toward a peak.'],
    solution: 'Use binary search to locate a peak element efficiently.',
    tags: ['binary-search', 'arrays'],
    companiesAsked: ['Microsoft', 'Amazon'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Word Search',
    difficulty: 'Hard',
    category: 'graphs',
    subCategory: 'dfs',
    problemStatement: 'Given a board of characters and a word, return true if the word exists in the board using adjacent letters',
    example: { input: 'board = [["A","B"],["C","D"]], word = "ABCD"', output: 'true' },
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 6'],
    hints: ['Use DFS with backtracking.', 'Track visited cells to avoid reuse.'],
    solution: 'Traverse the board with backtracking to match each letter sequentially.',
    tags: ['dfs', 'backtracking', 'matrix'],
    companiesAsked: ['Google', 'Facebook'],
    timeComplexity: 'O(m*n*4^k)',
    spaceComplexity: 'O(k)',
    points: 260
  },
  {
    titlePrefix: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'arrays',
    subCategory: 'prefix-sum',
    problemStatement: 'Given an array nums, return an array answer such that answer[i] is the product of all elements except nums[i]',
    example: { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
    constraints: ['2 <= nums.length <= 105', '-30 <= nums[i] <= 30'],
    hints: ['Compute prefix and suffix products.', 'Avoid using division.'],
    solution: 'Build output using left and right products in two passes.',
    tags: ['arrays', 'prefix-product'],
    companiesAsked: ['Amazon', 'Bloomberg'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Minimum Window Substring',
    difficulty: 'Hard',
    category: 'strings',
    subCategory: 'sliding-window',
    problemStatement: 'Given strings s and t, return the minimum window in s which contains all characters of t',
    example: { input: 's = "ADOBECODEBANC", t = "ABC"', output: 'BANC' },
    constraints: ['1 <= s.length, t.length <= 105'],
    hints: ['Use sliding window with frequency counting.', 'Expand right then shrink left to find valid windows.'],
    solution: 'Use a variable-size sliding window to capture required characters and shrink optimally.',
    tags: ['strings', 'sliding-window'],
    companiesAsked: ['Google', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 260
  },
  {
    titlePrefix: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'arrays',
    subCategory: 'greedy',
    problemStatement: 'Given an array prices, maximize profit by choosing a single buy and sell day',
    example: { input: 'prices = [7,1,5,3,6,4]', output: '5' },
    constraints: ['1 <= prices.length <= 105', '0 <= prices[i] <= 104'],
    hints: ['Track the minimum price seen so far.', 'Compute max profit relative to the current price.'],
    solution: 'Scan once, updating min price and max profit.',
    tags: ['arrays', 'greedy'],
    companiesAsked: ['Uber', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 100
  },
  {
    titlePrefix: 'Binary Search',
    difficulty: 'Easy',
    category: 'arrays',
    subCategory: 'binary-search',
    problemStatement: 'Given a sorted array and target value, return its index or -1 if not found',
    example: { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    constraints: ['1 <= nums.length <= 104', '-104 <= nums[i], target <= 104'],
    hints: ['Use binary search on the sorted array.', 'Compute mid carefully to avoid overflow.'],
    solution: 'Return the target index or -1 by halving the search range each step.',
    tags: ['binary-search'],
    companiesAsked: ['Google', 'Facebook'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    points: 100
  },
  {
    titlePrefix: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'arrays',
    subCategory: 'selection',
    problemStatement: 'Find the k-th largest element in an unsorted array',
    example: { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
    constraints: ['1 <= k <= nums.length <= 104', '-104 <= nums[i] <= 104'],
    hints: ['Use a min-heap of size k or quickselect.', 'Maintain the k largest elements efficiently.'],
    solution: 'Use a heap or quickselect to return the k-th largest number.',
    tags: ['heap', 'selection'],
    companiesAsked: ['Amazon', 'Google'],
    timeComplexity: 'O(n) average',
    spaceComplexity: 'O(k)',
    points: 180
  },
  {
    titlePrefix: 'Decode Ways',
    difficulty: 'Medium',
    category: 'dynamic-programming',
    subCategory: 'string-dp',
    problemStatement: 'Given a string containing digits, return the number of ways to decode it',
    example: { input: 's = "12"', output: '2' },
    constraints: ['1 <= s.length <= 100'],
    hints: ['Use dynamic programming over prefixes.', 'Count valid one-digit and two-digit decodings.'],
    solution: 'Compute the number of decodings using DP and previous two values.',
    tags: ['dynamic-programming', 'strings'],
    companiesAsked: ['Adobe', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Longest Increasing Subsequence',
    difficulty: 'Hard',
    category: 'dynamic-programming',
    subCategory: 'patience-sorting',
    problemStatement: 'Given an integer array, return the length of the longest strictly increasing subsequence',
    example: { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' },
    constraints: ['1 <= nums.length <= 2500', '-104 <= nums[i] <= 104'],
    hints: ['Use patience sorting or DP with binary search.', 'Maintain a tails array for potential subsequences.'],
    solution: 'Use DP with binary search to build the longest increasing subsequence efficiently.',
    tags: ['dynamic-programming', 'binary-search'],
    companiesAsked: ['Google', 'Apple'],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    points: 260
  },
  {
    titlePrefix: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'arrays',
    subCategory: 'hash-tables',
    problemStatement: 'Given an array of integers, return the k most frequent elements',
    example: { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
    constraints: ['1 <= nums.length <= 105', '-104 <= nums[i] <= 104'],
    hints: ['Count frequencies with a hash map.', 'Use a heap or bucket sort to pick the top k.'],
    solution: 'Count and sort elements by frequency to return the top k.',
    tags: ['hash-table', 'heap'],
    companiesAsked: ['Amazon', 'Microsoft'],
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(n)',
    points: 180
  },
  {
    titlePrefix: 'Minimum Path Sum',
    difficulty: 'Medium',
    category: 'dynamic-programming',
    subCategory: 'grid-dp',
    problemStatement: 'Given a grid of non-negative numbers, find a path from top-left to bottom-right minimizing sum',
    example: { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7' },
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 200'],
    hints: ['Use DP to accumulate minimum cost paths.', 'Only move right or down.'],
    solution: 'Compute the minimum sum for each cell based on top and left neighbors.',
    tags: ['dynamic-programming', 'matrix'],
    companiesAsked: ['Apple', 'Google'],
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(n)',
    points: 180
  },
  {
    titlePrefix: 'Permutation in String',
    difficulty: 'Medium',
    category: 'strings',
    subCategory: 'sliding-window',
    problemStatement: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1',
    example: { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true' },
    constraints: ['1 <= s1.length, s2.length <= 104'],
    hints: ['Use a sliding window with frequency counts.', 'Check if the current window has matching character counts.'],
    solution: 'Slide over s2 and compare character counts with s1.',
    tags: ['strings', 'sliding-window'],
    companiesAsked: ['Google', 'Amazon'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    points: 180
  },
  {
    titlePrefix: 'Coin Change',
    difficulty: 'Hard',
    category: 'dynamic-programming',
    subCategory: 'knapsack',
    problemStatement: 'Given coins of different denominations and a total amount, return the fewest number of coins needed',
    example: { input: 'coins = [1,2,5], amount = 11', output: '3' },
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 104'],
    hints: ['Use DP to build solutions for all amounts.', 'Consider each coin denomination.'],
    solution: 'Compute minimum coins for each amount from 0 to target.',
    tags: ['dynamic-programming', 'knapsack'],
    companiesAsked: ['Uber', 'Amazon'],
    timeComplexity: 'O(amount * coins.length)',
    spaceComplexity: 'O(amount)',
    points: 260
  }
];

const questions = questionTemplates.flatMap((template, templateIndex) => {
  const repeatCount = 11;
  return Array.from({ length: repeatCount }, (_, idx) => {
    const ordinal = idx + 1;
    const variant = ordinal === 1 ? '' : ` #${ordinal}`;
    const title = `${template.titlePrefix}${variant}`;
    const input = template.example.input;
    const output = template.example.output;
    const testBase = template.example.output.replace(/\[|\]|"/g, '');
    return {
      title,
      difficulty: template.difficulty,
      category: template.category,
      subCategory: template.subCategory,
      problemStatement: `${template.problemStatement}.`,
      examples: [{ input, output }],
      constraints: template.constraints,
      input,
      output,
      testCases: [{ input, expected: output }],
      hiddenTestCases: [{ input, expected: output }],
      hints: template.hints,
      solutions: {
        bruteForce: template.solution,
        optimized: template.solution,
        complexity: `${template.timeComplexity} time, ${template.spaceComplexity} space`
      },
      solution: template.solution,
      videoExplanation: '',
      tags: template.tags,
      companiesAsked: template.companiesAsked,
      timeComplexity: template.timeComplexity,
      spaceComplexity: template.spaceComplexity,
      points: template.points
    };
  });
});

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();

    await Category.insertMany(categories);
    await Question.insertMany(questions);

    const createdUsers = await User.create(users);
    console.log('Seed complete. Users created:', createdUsers.map((user) => user.email));
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

importData();
