import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Highlight from "./highlight.js";

// The dex: one entry per LeetCode problem I have worked on. Hand edited.
// Shape of one entry:
//   { number: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy",
//     topics: ["Array", "Hash Table"], language: "Java",
//     solution: "https://github.com/Marqed4/..." }
// `topics` are the problem types. Each type is a chapter of the book, and the chapters
// are in alphabetical order. A problem with two topics appears in both chapters.
// A problem with no topics goes in the last chapter, "Uncategorized".
// `slug` is the last part of the problem's LeetCode address and builds the problem link.
// `solution` is optional. Leave it out and the Solution button is not shown.
export const LeetCodeProblems = [
  {
    number: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    language: "Java",
    solution: `public static int[] twoSums(int[] n, int target) {
    for (int i = 0; i < n.length; i++) {
        for (int j = i + 1; j < n.length; j++) {
            if (target == n[i] + n[j]) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{-1, -1};
}`,
  },
  {
    number: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math", "Recursion"],
    language: "Java",
  },
  {
    number: 6,
    title: "Zigzag Conversion",
    slug: "zigzag-conversion",
    difficulty: "Medium",
    topics: ["String"],
    language: "Java",
  },
  {
    number: 7,
    title: "Reverse Integer",
    slug: "reverse-integer",
    difficulty: "Medium",
    topics: ["Math"],
    language: "Java",
    solution: `public static int reverse(int x) {

    if (x == 0) return 0;


    StringBuilder result = new StringBuilder();

    try {
        if (x < 0) {
            x = Math.abs(x);
            result.append('-');
        }

        while (x != 0) {
            result.append(x % 10);
            x = x / 10;
        }
        String holder = result.toString();
        return Integer.parseInt(holder);

    }  catch (NumberFormatException e) {
        return 0;
    }
}`,
  },
  {
    number: 9,
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    topics: ["Math"],
    language: "Java",
    solution: `public boolean isPalindrome(int x) {

    String s = String.valueOf(x);
    String rev = new StringBuilder(s).reverse().toString();

    if (s.length() == 1) {
        return true;

    } else if (s.equals(rev)) {
        return true;

    } else {
        return false;
    }
}`,
  },
  {
    number: 11,
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers", "Greedy"],
    language: "Java",
    solution: `//        public static int maxArea(int[] height) {
//
//            int containerSize = 0, maxArea = 0, widthIndex1 = height.length;
//
//
//            // left most -...- right most end comparison multiplied by the width of the remaining size between columns
//
//            for (int i = 0; i < height.length - 1; i++) {
//                    int widthIndex2 = height.length - 1;
//
//
//                for (int j = height.length - 1; j > 0; j--) {
//                    int limit1 = height[i], limit2 = height[j];
//
//                    if (limit1 > limit2) {
//                        limit1 = limit2;
//                    } else {
//                        limit2 = limit1;
//                    }
//
//                    if (containerSize < limit1 * height[j] * widthIndex2) {
//                        containerSize = limit1 /* represents length */ * height[j] * widthIndex2;
//                        maxArea = limit1 * limit2;
//                    }
//                    widthIndex2--;
//                }
//            }
//
//            for (int i = 0; i < height.length; i++) {
//                int limit1 = height[i], limit2 = height[height.length - 2];
//
//                if (limit1 > limit2) {
//                    limit1 = limit2;
//                } else {
//                    limit2 = limit1;
//                }
//
//                if (containerSize < limit1 * limit2 * widthIndex1) {
//                    containerSize = limit1 * limit1 * widthIndex1;
//                    maxArea = limit1 * limit2;
//                }
//            }
//            return maxArea;
//        }

public static int maxArea(int[] height) {
    int containerSize = 0;

    for (int i = 0; i < height.length; i++) {
        for (int j = height.length - 1; j > i; j--) {

            int limit1 = height[i], limit2 = height[j];

            if (limit1 > limit2) {
                limit1 = limit2;
            } else {
                limit2 = limit1;
            }

            int area = limit1 * (j - i);

            if (containerSize < area) {
                containerSize = area;
            }
        }
    }

    return containerSize;
}

public static int maxArea2(int[] height) {

    int containerSize = 0;

        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {

                int h = Math.min(height[i], height[j]);
                int w = j - i;
                int area = h * w;

                if (area > containerSize) {
                    containerSize = area;
            }
        }
    }
        return containerSize;
}

}
// length * height * width`,
  },
  {
    number: 13,
    title: "Roman to Integer",
    slug: "roman-to-integer",
    difficulty: "Easy",
    topics: ["Hash Table", "Math", "String"],
    language: "Java",
    solution: `public static int romanToInt(String s) {

    int sum = 0;

    char[] c = new char[s.length()];

    for (int i = 0; i < s.length(); i++) {
        c[i] = s.charAt(i);
    }

    for (int i = 0; i < s.length(); i++) {
        int current = value(s.charAt(i));
        int next = (i < s.length() - 1) ? value(s.charAt(i + 1)) : 0;

            if (current < next) {
                sum += (next - current);
                i++; // skips because two letters make one number
            } else {
                sum += current;
            }
        }
    return sum;
}

private static int value(char c) {
    switch(c) {
        case 'I':
            return 1;
            case 'V':
                return 5;
                case 'X':
                    return 10;
                    case 'L':
                        return 50;
                        case 'C':
                            return 100;
                            case 'D':
                                return 500;
                                case 'M':
                                    return 1000;
                                    default:
                                        return 0;
    }
}`,
  },
  {
    number: 14,
    title: "Longest Common Prefix",
    slug: "longest-common-prefix",
    difficulty: "Easy",
    topics: ["String", "Trie"],
    language: "Java",
    solution: `public static String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) {
        return "";
    }

    String prefix = strs[0]; // start with the first string as prefix

    for (int i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.substring(0, prefix.length() - 1); // shrink prefix
            if (prefix.isEmpty()) {
                return "";
            }
        }
    }
    return prefix;
}`,
  },
  {
    number: 15,
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers", "Sorting"],
    language: "Java",
    solution: `/*
UNDERSTAND: You're given an intereger array names nums.
Your job is to find the combination of integers in this
array that amouunts to zero.  

Constraints: 3 <= nums.length <= 3000 & -10^5 <= nums[i] <= 10^5.
This means that you have to be efficient.

Edge Cases: 

MATCH: HashMap

PLAN: This problem is initially difficult, but I think that instead of O(N^3)
which involves searching every single combination you can instead apply a map
to the vector. This means that for every to combinations you look for the solution.
E.g., -130 + 22 + x = 0
      -130 + 22 = -108, this means you should search for |-108|
      if the hashmap doesn't exist this combination was never going to work.
      You can then move on, that makes this 0(N^2).
Also removing duplicates drastically speeds up the combination process.

Time Complexity:
Space Complexity:
*/
public static List<List<Integer>> threeSum(int[] nums) {
    
    // Create objects
    TreeMap<Integer, Integer> mpx = new TreeMap<>();
    List<List<Integer>> result = new ArrayList<>();
    List<List<Integer>> lsx = new ArrayList<>();
    
    // Map out nums vect <Index, Value>
    for (int i = 0; i < nums.length; i++) if (!mpx.containsKey(nums[i])) mpx.put(i, nums[i]);

    // Give unqiue set to ArrayList <Value, Index>
    for (Map.Entry<Integer, Integer> entry : mpx.entrySet()) 
        lsx.add(new ArrayList<>(List.of(entry.getKey(), entry.getValue())));
    
    // 
    for (int k = 0; k < lsx.size(); k++) {
        int curr = lsx.get(k).get(0);
        for (int v = 0; v < lsx.size(); v++) {
            int nxt = lsx.get(v).get(0);
            int dif = curr + nxt;
            if (dif > 0 && mpx.containsKey(Math.negateExact(dif))) {
                if (mpx.get(Math.negateExact(dif)) < k)
                result.add(new ArrayList<>(List.of(mpx.get(curr), mpx.get(nxt), mpx.get(dif))));
            
            } else if (dif < 0 && mpx.containsKey(Math.abs(dif))) {
                if (mpx.get(Math.abs(dif)) < k)
                result.add(new ArrayList<>(List.of(mpx.get(curr), mpx.get(nxt), mpx.get(dif))));
            }
        }
    }

    return result;
}

public static <T> String listVectToString(List<T> lsx) {
    StringBuilder sb = new StringBuilder("]");
        for (int i = 0; i < lsx.size() - 1; i++) {
            sb.append(lsx.get(i)).append(" -> ");
        }

    return sb.append(lsx.get(lsx.size() - 1)).append("]").toString();
}

public static <T> String primArrToString(int[] lsx) {
    StringBuilder sb = new StringBuilder("]");
        for (int i = 0; i < lsx.length - 1; i++) {
            sb.append(lsx[i]).append(" -> ");
        }

    return sb.append(lsx[lsx.length - 1]).append("]").toString();
}`,
  },
  {
    number: 17,
    title: "Letter Combinations of a Phone Number",
    slug: "letter-combinations-of-a-phone-number",
    difficulty: "Medium",
    topics: ["Hash Table", "String", "Backtracking"],
    language: "Java",
    solution: `public static List<String> letterCombinations(String digits) {

    //minimum
    int init_Duration = 3, next_Duration = 3, next_next_Duration = 3, next_next_next_Duration = 3;


    List<String> combinations = new ArrayList<>();
    StringBuilder logic = new StringBuilder(digits);

    if (digits.length() == 4) {
        for (int i = 0; i < digits.length() - 3; i++) {
            if (logic.charAt(i) == '7' || logic.charAt(i) == '9') init_Duration = 4;
            if (logic.charAt(i + 1) == '7' || logic.charAt(i + 1) == '9') next_Duration = 4;
            if (logic.charAt(i + 2) == '7' || logic.charAt(i + 2) == '9') next_next_Duration = 4;
            if (logic.charAt(i + 3) == '7' || logic.charAt(i + 3) == '9') next_next_next_Duration = 4;

            for (int j = 1; j <= init_Duration; j++) {
                for (int k = 1; k <= next_Duration; k++) {
                    for (int l = 1; l <= next_next_Duration; l++) {
                        for (int m = 1; m <= next_next_next_Duration; m++) {
                            combinations.add(lookUpTable(logic.charAt(i), init_Duration + 1 - j) + lookUpTable(logic.charAt(i + 1), next_Duration + 1 - k) + lookUpTable(logic.charAt(i + 2), next_next_Duration + 1 - l) + lookUpTable(logic.charAt(i + 3), next_next_next_Duration + 1 - m));
                        }
                    }
                }
            }
        }
    } else if (digits.length() == 3) {
        for (int i = 0; i < digits.length() - 2; i++) {
            if (logic.charAt(i) == '7' || logic.charAt(i) == '9') init_Duration = 4;
            if (logic.charAt(i + 1) == '7' || logic.charAt(i + 1) == '9') next_Duration = 4;
            if (logic.charAt(i + 2) == '7' || logic.charAt(i + 2) == '9') next_next_Duration = 4;


            for (int j = 1; j <= init_Duration; j++) {
                for (int k = 1; k <= next_Duration; k++) {
                    for (int l = 1; l <= next_next_Duration; l++) {
                        combinations.add(lookUpTable(logic.charAt(i), init_Duration + 1 - j) + lookUpTable(logic.charAt(i + 1), next_Duration + 1 - k) + lookUpTable(logic.charAt(i + 2), next_next_Duration + 1 - l));
                    }
                }
            }
        }
    } else if (digits.length() == 2) {
        for (int i = 0; i < digits.length() - 1; i++) {
            if (logic.charAt(i) == '7' || logic.charAt(i) == '9') init_Duration = 4;
            if (logic.charAt(i + 1) == '7' || logic.charAt(i + 1) == '9') next_Duration = 4;

            for (int j = 1; j <= init_Duration; j++) {
                for (int k = 1; k <= next_Duration; k++) {
                    combinations.add(lookUpTable(logic.charAt(i), init_Duration + 1 - j) + lookUpTable(logic.charAt(i + 1), next_Duration + 1 - k));
                }
            }
        }
    } else {
        for (int i = 0; i < digits.length(); i++) {
            if (logic.charAt(i) == '7' || logic.charAt(i) == '9') init_Duration = 4;
            for (int j = 1; j <= init_Duration; j++) {
                combinations.add(lookUpTable(digits.charAt(i), init_Duration + 1 - j));
            }
        }
    }
    return combinations;
}

public static String lookUpTable(char let, int n) {

    String key = let + "," + n;

    return switch (key) {
        case "2,1" -> "a";
        case "2,2" -> "b";
        case "2,3" -> "c";

        case "3,1" -> "d";
        case "3,2" -> "e";
        case "3,3" -> "f";

        case "4,1" -> "g";
        case "4,2" -> "h";
        case "4,3" -> "i";

        case "5,1" -> "j";
        case "5,2" -> "k";
        case "5,3" -> "l";

        case "6,1" -> "m";
        case "6,2" -> "n";
        case "6,3" -> "o";

        case "7,1" -> "p";
        case "7,2" -> "q";
        case "7,3" -> "r";
        case "7,4" -> "s";

        case "8,1" -> "t";
        case "8,2" -> "u";
        case "8,3" -> "v";

        case "9,1" -> "w";
        case "9,2" -> "x";
        case "9,3" -> "y";
        case "9,4" -> "z";
        default -> "";
    };
}`,
  },
  {
    number: 20,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    topics: ["String", "Stack"],
    language: "Java",
    solution: `public static boolean isValid(String s) {

    if (s.length() <= 1) return false;

    for (int i = 0; i < s.length(); i++) {

        boolean firstCheck = true;

        if (s.charAt(i) == '(' && s.charAt(s.length() - 1 - i) != ')') {firstCheck = false;}
        if (!firstCheck) {if (doubleCheck1(s, i)) { i++; continue;} else {return false;}}

        if (s.charAt(i) == '[' && s.charAt(s.length() - 1 - i) != ']') {firstCheck = false;}
        if (!firstCheck) {if (doubleCheck1(s, i)) { i++; continue;} else {return false;}}

        if (s.charAt(i) == '{' && s.charAt(s.length() - 1 - i) != '}') {firstCheck = false;}
        if (!firstCheck) {if (doubleCheck1(s, i)) { i++;} else {return false;}}

    }
    return true;
}

public static boolean doubleCheck1(String s, int i) {

    if ((s.charAt(i) == '(' && s.charAt(i + 1) == ')') ||  (s.charAt(i) == '[' && s.charAt(i + 1) == ']') ||
            (s.charAt(i) == '{' && s.charAt(i + 1) == '}')) {return true;}

    return false;
}

    String s5 = "[";
    String s6 = "(){}}{";

    System.out.println(isValid(s1));
    System.out.println(isValid(s2));
    System.out.println(isValid(s3));
    System.out.println(isValid(s4));
    System.out.println(isValid(s5));
    System.out.println(isValid(s6));
}`,
  },
  {
    number: 21,
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    language: "Java",
    solution: `private static ListNode mergeTwoLists(ListNode list1, ListNode list2) {

    int length = getLength(list1) + getLength(list2);
    ListNode comboList = new ListNode(length);

    int index = 0;

    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;

    while (list1 != null && list2 != null) {
        if (list1.val < list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }

    if (list1 != null) tail.next = list1;
    if (list2 != null) tail.next = list2;

    return dummy.next;
}


public static int getLength(ListNode head) {
    int length = 0;           // accumulator
    ListNode current = head;  // start at the head

    while (current != null) { // traverse until the end
        length++;             // add 1 for this node
        current = current.next; // move to the next node
    }
    return length;
}`,
  },
  {
    number: 26,
    title: "Remove Duplicates from Sorted Array",
    slug: "remove-duplicates-from-sorted-array",
    difficulty: "Easy",
    topics: ["Array", "Two Pointers"],
    language: "Java",
    solution: `public static ListNode deleteDuplicates(ListNode head) {
    if (head == null) return null;

    ListNode result = head;

    while (result.next != null) {
        if (result.val == result.next.val) {
            result.next = result.next.next;
        } else {
            result = result.next;
        }
    }
    return head;
}`,
  },
  {
    number: 27,
    title: "Remove Element",
    slug: "remove-element",
    difficulty: "Easy",
    topics: ["Array", "Two Pointers"],
    language: "Java",
    solution: `public static int removeElement(int[] nums, int val) {
    int k = 0;
    int count = 0;

    int[] temp = new int[nums.length];

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == val) { //testing if it matches
                count++;
                nums[i] = -1; //making it a number < 0 (not possibly in array)
            }
        }
        k = nums.length - count;
        rewrite(nums, temp);
    return k;
}

public static int[] rewrite(int[] nums, int[] temp) {

    int pK = 0;

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != -1) {
            temp[pK++] = nums[i];
            nums[i] = -1;
        }
    }
    for (int i = 0; i < temp.length; i++) {
        nums[i] = temp[i];
    }
    return nums;
}`,
  },
  {
    number: 28,
    title: "Find the Index of the First Occurrence in a String",
    slug: "find-the-index-of-the-first-occurrence-in-a-string",
    difficulty: "Easy",
    topics: ["Two Pointers", "String", "String Matching"],
    language: "Java",
    solution: `public static int strStr(String haystack, String needle) {

    StringBuilder sb = new StringBuilder();

    int index1 = 0;
    int index2 = 0;

    while (index1 < haystack.length()) {

        if (haystack.charAt(index1) == needle.charAt(index2)) {

            sb.append(haystack.charAt(index1));

            index1++;
            index2++;

        } else {
            if (index1 > 1 && haystack.charAt(index1 - 1) == needle.charAt(0)) {
                index1--;

            } else {
                index1++;
            }
                index2 = 0;
                sb.setLength(0);
        }

        if (sb.toString().equals(needle)) return index1 - (needle.length());
    }
    return -1;
}`,
  },
  {
    number: 29,
    title: "Divide Two Integers",
    slug: "divide-two-integers",
    difficulty: "Medium",
    topics: ["Math", "Bit Manipulation"],
    language: "Java",
    solution: `public static int divide(int dividend, int divisor) {

    if (dividend == Integer.MIN_VALUE && divisor == -1) { //this is used when the contraints aren't true, the divisor falls below
                                                          // -1 and the divident represents the smallest value available in java
        return Integer.MAX_VALUE;
    }
    int quotient = 0;
    return quotient =  dividend / divisor;
}`,
  },
  {
    number: 38,
    title: "Count and Say",
    slug: "count-and-say",
    difficulty: "Medium",
    topics: ["String"],
    language: "Java",
  },
  {
    number: 39,
    title: "Combination Sum",
    slug: "combination-sum",
    difficulty: "Medium",
    topics: ["Array", "Backtracking"],
    language: "Java",
  },
  {
    number: 43,
    title: "Multiply Strings",
    slug: "multiply-strings",
    difficulty: "Medium",
    topics: ["Math", "String", "Simulation"],
    language: "Java",
    solution: `public static String multiply(String num1, String num2) {

    int maxlength = Math.max(num1.length(), num2.length());
    long n1 = 0, n2 = 0;
    String result = null;

    for (int i = 0; i < maxlength; i++) {

        if (num1.length() - 1 >= i) {
            n1 += num1.charAt(i) - '0';
            if (i < num1.length() - 1) {
                n1 *= 10;
            }
        }

        if (num2.length() - 1 >= i) {
            n2 += num2.charAt(i) - '0';
            if (i < num2.length() - 1) {
                n2 *= 10;
            }
        }
    }

    return "" + (n1 * n2);
}

public static String multiply1(String num1, String num2) {

    int[] product = new int[num1.length() + num2.length()];
    int subProd = 0, place = 0;
    String result = null;

    for (int i = 0; i < num1.length(); i++) {
        for (int j = 0; j < num2.length(); j++) {

            subProd = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');

            if (subProd > 9) {
                subProd /= 10;
                product[product.length - (place + 1)] += 1;
                product[product.length - (place + 1)] += subProd;
            } else {
                product[product.length - place] += subProd;
            }
        }
        place++;
    }
    return "";
}
}

class Test1 {

//must be able to handle large numbers
public static String multiply(String num1, String num2) {

    StringBuilder sb = new StringBuilder();
    int runTime = 0;
    int remainder = 0;

    for (int i = num2.length() - 1; i >= 0; i--) {
        for (int j = num1.length() - 1; j >= 0; j--) {

            int x = Integer.parseInt(String.valueOf(num2.charAt(i)));
            int y = Integer.parseInt(String.valueOf(num1.charAt(j)));

            int product = x * y;

            product += remainder;

            if (product > 9 && j != 0 || product > 9 && num1.length() > 1) {
                sb.append(product % 10 + "");
                remainder = product / 10;
            } else {
                sb.append(product + "");
            }
        }
        runTime++;
        sb.append(" ");
        for (int h = runTime; h > 0; h--) sb.append("0");
    }

    if (num1.length() == 1 || num2.length() == 1)
        return String.valueOf(tokenAddition2(sb.toString()));
    else return String.valueOf(tokenAddition1(sb.toString()));
}

public static int tokenAddition1(String input) {
    java.util.Scanner sc = new java.util.Scanner(input);
    int sum = 0;

    while (sc.hasNext()) {
        sum += reverseToken(String.valueOf(sc.next()));
    }
    return sum;
}

public static int tokenAddition2(String input) {
    java.util.Scanner sc = new java.util.Scanner(input);
    int sum = 0;

    while (sc.hasNext()) {
        sum += Integer.parseInt(sc.next());
    }
    return sum;
}

public static int reverseToken(String ofSc) {
    StringBuilder sb = new StringBuilder();

    for (int i = ofSc.length() - 1; i >= 0; i--) {
        sb.append(ofSc.charAt(i));
    }
    System.out.println(sb.toString());
    return Integer.parseInt(sb.toString());
}
}

/*Notes*/
//the total will fail because some numbers cant big large enough for out test cases,
//numbers are usually much larger than originally with multiplication

class AI_Answer1 {

public static String multiply(String num1, String num2) {
    if (num1.equals("0") || num2.equals("0")) return "0";

    int m = num1.length(), n = num2.length();
    int[] result = new int[m + n];

    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
            int sum = mul + result[i + j + 1];

            result[i + j + 1] = sum % 10;
            result[i + j] += sum / 10;
        }
    }

    // Convert result array to string
    StringBuilder sb = new StringBuilder();
    for (int num : result) {
        if (!(sb.length() == 0 && num == 0)) { // skip leading zeros
            sb.append(num);
        }
    }
    return sb.toString();
}`,
  },
  {
    number: 45,
    title: "Jump Game II",
    slug: "jump-game-ii",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming", "Greedy"],
    language: "Java",
    solution: `// greedy algorithm
public static int jump(int[] nums) {

    int currEndJump = 0;
    int maxEndJump = 0;
    int jumps = 0;

    for (int i = 0; i < nums.length - 1; i++) {
        maxEndJump = Math.max(maxEndJump, i + nums[i]);

        if (maxEndJump == nums.length - 1) {
            jumps += 1;
            break;
        }

        if (i == currEndJump) {
            jumps += 1;
            currEndJump = maxEndJump;
        }
    }
    return jumps;
}`,
  },
  {
    number: 48,
    title: "Rotate Image",
    slug: "rotate-image",
    difficulty: "Medium",
    topics: ["Array", "Math", "Matrix"],
    language: "Java",
    solution: `public static void rotate(int[][] matrix) {

    int[][] result = new int[matrix.length][matrix[0].length];

    for (int i = 0; i < matrix.length; i++) {
        for (int j = matrix.length - 1; j >= 0; j--) {
            result[i][matrix.length - j - 1] = matrix[j][i];
        }
    }

    for (int i = 0; i < matrix.length; i++) {
        for (int j = 0; j < matrix[0].length; j++) {
            matrix[i][j] = result[i][j];
        }
    }
}`,
  },
  {
    number: 50,
    title: "Pow(x, n)",
    slug: "powx-n",
    difficulty: "Medium",
    topics: ["Math", "Recursion"],
    language: "Java",
    solution: `public static double myPow1(double x, int n) {

    int k = n;

    if (n == 0) {
        return 1;
    } else if (n == 1) {
        return x;
    } else {
        if (k < 0) n +=1; else n -= 1;
        if (k == -1) return 1 / x;
        return myPow1(x, n);
    }
}

public static double myPow2(double x, int n) {
    if (n == 0 || x == 1) return 1;
    if (n == 1 || x == 0) return x;

    double constant = x;

    if (n > 0) {
        for (int i = 1; i < n; i++) {
            x *= constant;
        }
    } else {
        for (int i = n; i < -1; i++) {
            x *= constant;
        }
    }
    return n < 0 ? 1 / x : x;
}

public static double myPow3(double x, int n) {
    if (n == 0 || x == 1) return 1;
    if (n == 1 || x == 0) return x;

    double constant = x;

    for (int i = 1; i < Math.abs(n); i++) {
        x *= constant;
    }

    return n < 0 ? 1 / x : x;
}

public static double myPow4(double x, int n) {

    long exp = n;
    return myPowHelper(x, exp);
}

public static double myPowHelper(double x, long n) {

    if (n == 0) return 1;
    if (n < 0) return 1 / myPowHelper(x, -n);

    if (n % 2 == 0) {
        double half = myPowHelper(x, n / 2);
        return half * half;
    } else {
        return x * myPowHelper(x, n - 1);
    }
}

/* problem from exam I missed because my grandmother passed away. */

public static int countHelper (int x, BigInteger n) {
    if (n.equals(BigInteger.ZERO))
        return x;
    else if (!n.remainder(BigInteger.TEN).equals(BigInteger.ZERO)){
        x++;
        return countHelper(x, n = (n.divide(BigInteger.TEN)));
    } else {
        return countHelper(x, n = (n.divide(BigInteger.TEN)));
    }
}

public static int countDigitsNotZero(BigInteger n) {
    return countHelper(0, n);
}

}

/*
5.0 to the 2 power is: 25.0
5.0 to the -2 power is: 0.04
5.0 to the 3 power is: 125.0
2.0 to the 10 power is: 1024.0
0.44528 to the 0 power is: 1.0
1.0 to the 2147483647 power is: 1.0
2.0 to the -2147483648 power is: 0.0
2.0 to the -2 power is: 0.25
*/`,
  },
  {
    number: 55,
    title: "Jump Game",
    slug: "jump-game",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming", "Greedy"],
    language: "Java",
  },
  {
    number: 58,
    title: "Length of Last Word",
    slug: "length-of-last-word",
    difficulty: "Easy",
    topics: ["String"],
    language: "Java",
    solution: `public static int lengthOfLastWord(String s) {

    String[] words = s.split("\\s+");
return words[words.length - 1].length();
}`,
  },
  {
    number: 59,
    title: "Spiral Matrix II",
    slug: "spiral-matrix-ii",
    difficulty: "Medium",
    topics: ["Array", "Matrix", "Simulation"],
    language: "Java",
    solution: `public static int[][] generateMatrix(int n)  {
    int push = 0;
    int num = 1;
    int[][] matrix = new int[n][n];

    while (num <= n * n) {
        for (int i = 0; i < n; i++) {
            matrix[0 + push][i] = num;
            num++;
        }
        for (int i = 0; i < n; i++) {
            matrix[i][n - 1] = num;
            num++;
        }
        for (int i = n - 1; i >= 0; i--) {
            matrix[matrix.length - 1][i] = num;
            num++;
        }
    }

    return matrix;
}
}

//3 x 3 matrix

// 00, 01, 02
// 10, 11, 12
// 20, 21, 22

// 1, 2, 3
// 8, 9, 4
// 7, 6, 5`,
  },
  {
    number: 61,
    title: "Rotate List",
    slug: "rotate-list",
    difficulty: "Medium",
    topics: ["Linked List", "Two Pointers"],
    language: "Java",
    solution: `/*
UNDERSTAND: Given the head of a linked list rotate the list by k places.
We're rotating the list only clockwise. Returning the head of the list once finished.
The head is subject to change as the value of the head may change.

Constraints: The number of nodes in the list is in the range 0, 500. Value of each
node can range from -100, 100. Value of k can be 0, 10^9.

Edge Cases: If k is zero return the head, if the length of the list is 0 or 1
return the head.

MATCH: Modulo, Divisor

PLAN: We're going test for edge cases, resulting in an instant
return. Otherwise we're going to take the remainder of said length against k.
Use k to perform rotations. Rotations are performed by moving th
tail to the head k times, this can be done in place as a linked-list or normal list/array.
*/
public ListNode rotateRight(ListNode head, int k) {
    if (k == 0 || head == null || head.next == null) return head;

    k %= getLen(head);

    for (int i = 0; i < k; i++) {
        head = rotateClockwise(head, head.next);
    }

    return head;
}

private ListNode rotateClockwise(ListNode head, ListNode temp) {
    // Address of first node.
    ListNode original = head;
    // Move head and temp up a node.
    while (temp.next != null) {
        head = head.next;
        temp = temp.next;
    }

    ListNode target = new ListNode(temp.val);

    // Delete end of head 
    head.next = null;
    // Attatch target to the address of the first node.
    target.next = original;
    // Return temp
    return target;
}

private int getLen(ListNode head) {
    int len = 0;
    while (head != null) {
        len++;
        head = head.next;
    }
    return len;
}


private static String stringifyListNode(ListNode head) {
    StringBuilder sb = new StringBuilder("[");

    while (head.next != null) {
        sb.append(head.val).append(", ");
        head = head.next;
    }

    return sb.append(head.val).append("]").toString();
}`,
  },
  {
    number: 66,
    title: "Plus One",
    slug: "plus-one",
    difficulty: "Easy",
    topics: ["Array", "Math"],
    language: "Java",
    solution: `public static int[] plusOne(int[] digits) {


    int num = 0;
    for (int i = 0; i < digits.length; i++) {
        num = num * 10 + digits[i];
    }

    num += 1;

    for (int i = digits.length - 1; i >= 0; i--) {
        digits[i] = num % 10;
        num /= 10;
    }

    if (num > 0) {
        int[] result = new int[digits.length + 1];
        result[0] = num;
        for (int i = 0; i < digits.length; i++) {
            result[i + 1] = digits[i];
        }
        return result;
    }
    return digits;
}`,
  },
  {
    number: 67,
    title: "Add Binary",
    slug: "add-binary",
    difficulty: "Easy",
    topics: ["Math", "String", "Bit Manipulation", "Simulation"],
    language: "Java",
    solution: `public static String addBinary(String a, String b) {

    int multiplier = 1;
    long c = 0, d = 0;;

    if (a.equals("0")) return b;
    if (b.equals("0")) return a;

    for (int i = a.length() - 1; i >= 0; i--) {

        char preview = a.charAt(i);
        String target = String.valueOf(preview);

        if (target.equals("1")) {
            c += Integer.parseInt(target) * multiplier;
        }
        multiplier *= 2;
    }

    multiplier = 1;

    for (int i = b.length() - 1; i >= 0; i--) {

        char preview = b.charAt(i);
        String target = String.valueOf(preview);

        if (target.equals("1")) {
            d += Integer.parseInt(target) * multiplier;
        }

        multiplier *= 2;
    }

    long target = c + d;

    StringBuilder binaryVal = new StringBuilder();

    while (target > 0) {
        if (target % 2 == 0) {
            binaryVal.append(0);
            target /= 2;
        } else {
            binaryVal.append(1);
            target /= 2;
        }
    }
    return binaryVal.reverse().toString();
}`,
  },
  {
    number: 68,
    title: "Text Justification",
    slug: "text-justification",
    difficulty: "Hard",
    topics: ["Array", "String", "Simulation"],
    language: "Java",
    solution: `public static List<String> fullJustify(String[] words, int maxWidth) {

    List<String> justification = new ArrayList<>();
    int currentPos = 0, oldCurrPos = 0;

    while (currentPos <= words.length) {
        int[] infoRelay = positionJustify(words, maxWidth, currentPos);

        // (remaining width - reported char count)

        long sCount;
        if (infoRelay[2] > 2) {
            sCount = infoRelay[0] / (infoRelay[2] - 1);
        } else {
            sCount = infoRelay[0];
        }
        // rounds up value
        long roundSpace = (long) Math.ceil(sCount);

        if (currentPos < words.length - 1) {
            for (int i = oldCurrPos; i < infoRelay[1]; i++) {
                justification.add(words[i]);

                if (i < infoRelay[1] - 1) {
                    for (int j = 0; j < roundSpace; j++) {
                        justification.add(" ");
                    }

                        if (roundSpace % 2 != 0) {
                            justification.add(" ");
                            roundSpace--;
                            }
                        }
            }

            currentPos += infoRelay[1];
            oldCurrPos = currentPos;
        }
    }

    return justification;
}

public static int[] positionJustify(String[] words, int maxWidth, int currentPos) {

    int[] info = new int[3];
    int wordCount = 0;

    while ( currentPos <= words.length) {

        int currentWidth = words[currentPos].length();

        if (currentWidth < maxWidth) {
            maxWidth -= currentWidth;
            wordCount++;
            currentPos++;
        } else {
            info[0] = maxWidth;
            info[1] = currentPos;
            info[2] = wordCount;
            break;
        }
    }

    // at least one space needed between each word, if space left are not even, if words are above/equaling two in processing: one word is removed and the available width minus last words length
    if (maxWidth / wordCount < 1 && wordCount >= 2) {
        info[0] +=  words[info[1] - 1].length();
        info[1] -= 1;
        info[2] -= 1;
    }
    return info;
}`,
  },
  {
    number: 69,
    title: "Sqrt(x)",
    slug: "sqrtx",
    difficulty: "Easy",
    topics: ["Math", "Binary Search"],
    language: "Java",
    solution: `public static int mySqrt(int x) {

    int tally = 0;
    int tool = 1;

    while (x >= 0) {
        x = x - tool;

        tally++;

        tool = tool + 2;
    }
    tally--;
    return tally;
}`,
  },
  {
    number: 70,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    topics: ["Math", "Dynamic Programming", "Memoization"],
    language: "Java",
    solution: `    public static int climbStairs(int n) {

        int[] m = new int[n + 1];
        return climbHelp(n, m);
    }

    public static int climbHelp(int n, int[] memo) {

        if (n == 0 || n == 1) {
            return 1;
        }
        if (memo[n] != 0) {
            return memo[n];
        }

        memo[n] = climbHelp(n - 1, memo) + climbHelp(n - 2, memo);
        return memo[n];
    }`,
  },
  {
    number: 73,
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: "Medium",
    topics: ["Array", "Hash Table", "Matrix"],
    language: "Java",
    solution: `public static void setZeroes(int[][] matrix) {

    //creates new temporary matrix
    int[][] temp = new int[matrix.length][matrix[0].length];

    //makes all data-fields in temporary matrix equal to 1
    for (int i = 0; i < temp.length; i++) {
        for (int j = 0; j < temp[0].length; j++) {
            temp[i][j] = matrix[i][j];
        }
    }

    for (int i = 0; i < matrix.length; i++) {
        for (int j = 0; j < matrix[i].length; j++) {

            if (matrix[i][j] == 0) {
                for (int k = 0; k < matrix.length; k++) {
                    temp[k][j] = 0;
                }

                for (int k = 0; k < matrix[i].length; k++) {
                    temp[i][k] = 0;
                }
            }
        }
    }

    for (int i = 0; i < temp.length; i++) {
        for (int j = 0; j < temp[0].length; j++) {
            matrix[i][j] = temp[i][j];
        }
    }
}`,
  },
  {
    number: 75,
    title: "Sort Colors",
    slug: "sort-colors",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers", "Sorting"],
    language: "Java",
  },
  {
    number: 79,
    title: "Word Search",
    slug: "word-search",
    difficulty: "Medium",
    topics: ["Array", "Backtracking", "Matrix"],
    language: "Java",
    solution: `public static boolean exist(char[][] board, String word) {
    int rows = board.length;
    int cols = board[0].length;

    boolean[][] visited = new boolean[rows][cols];

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (dfs(board, word, 0, i, j, visited)) {
                return true;
            }
        }
    }
    return false;
}

private static boolean dfs(char[][] board, String word, int index,
                           int row, int col, boolean[][] visited) {

    if (index == word.length()) return true;
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return false;
    if (board[row][col] != word.charAt(index)) return false;
    if (visited[row][col]) return false;

    visited[row][col] = true;

    boolean found = dfs(board, word, index + 1, row + 1, col, visited) || // down
            dfs(board, word, index + 1, row - 1, col, visited) || // up
            dfs(board, word, index + 1, row, col + 1, visited) || // right
            dfs(board, word, index + 1, row, col - 1, visited);   // left

    visited[row][col] = false;

    return found;
}`,
  },
  {
    number: 80,
    title: "Remove Duplicates from Sorted Array II",
    slug: "remove-duplicates-from-sorted-array-ii",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers"],
    language: "Java",
    solution: `public static int removeDuplicates(int[] nums) {
    java.util.HashMap<Integer, Integer> details = new HashMap<>();

    int prev = 0;
    int rep = 1;
    for (int i : nums) {
        if (nums[i] == prev) {
            rep++;
            details.put(nums[i], rep);
        } else {
            rep = 1;
            details.put(nums[i], rep);
            prev = nums[i];
        }
    }

    System.out.println(details);
    return rep;
}`,
  },
  {
    number: 83,
    title: "Remove Duplicates from Sorted List",
    slug: "remove-duplicates-from-sorted-list",
    difficulty: "Easy",
    topics: ["Linked List"],
    language: "Java",
    solution: `public static ListNode deleteDuplicates(ListNode head) {

    if (head == null) return null;

    ListNode withoutDuplicates = head;

    while (head.next != null && withoutDuplicates.next != null ) {
        if (withoutDuplicates.next.val == head.next.val) {
            withoutDuplicates.next = withoutDuplicates.next.next;
        } else {
            withoutDuplicates = withoutDuplicates.next;
        }
    }

    return head;
}`,
  },
  {
    number: 86,
    title: "Partition List",
    slug: "partition-list",
    difficulty: "Medium",
    topics: ["Linked List", "Two Pointers"],
    language: "Java",
  },
  {
    number: 88,
    title: "Merge Sorted Array",
    slug: "merge-sorted-array",
    difficulty: "Easy",
    topics: ["Array", "Two Pointers", "Sorting"],
    language: "Java",
    solution: `public static void merge(int[] nums1, int m, int[] nums2, int n) {

    int[] nums3 = new int[m + n];
    int countdown1 = 0;
    int countdown2 = 0;
    int k = 0;

    while (countdown1 < m || countdown2 < n) {
        if (countdown1 < m && countdown2 < n) {
            // both arrays still have elements
            if (nums1[countdown1] < nums2[countdown2]) {
                nums3[k++] = nums1[countdown1++];
            } else if (nums1[countdown1] > nums2[countdown2]) {
                nums3[k++] = nums2[countdown2++];
            } else {
                nums3[k++] = nums1[countdown1++];
                nums3[k++] = nums2[countdown2++];
            }
        } else if (countdown1 < m) {
            // only nums1 has elements left
            nums3[k++] = nums1[countdown1++];
        } else {
            // only nums2 has elements left
            nums3[k++] = nums2[countdown2++];
        }
    }

    for (int i = 0; i < m + n; i++) {
        nums1[i] = nums3[i];
    }

    for (int c = 0; c < m + n; c++) {
        if (c == (m + n) - 1) {
            System.out.print(nums3[c]);
            break;
        } else {
            System.out.print(nums3[c] + ",");
        }
    }
}`,
  },
  {
    number: 90,
    title: "Subsets II",
    slug: "subsets-ii",
    difficulty: "Medium",
    topics: ["Array", "Backtracking", "Bit Manipulation"],
    language: "Java",
    solution: `public List<List<Integer>> subsetsWithDup(int[] nums) {
    List<List<Integer>> list = new ArrayList<>(List.of(new ArrayList<>()));

    int buffer1 = Integer.MIN_VALUE;

    for (int i : nums) {
        if (buffer1 != i) {
            list.add(new ArrayList<>(List.of(i)));
            buffer1 = i;
        }
    }

    for (int i = 0; i < nums.length - 1; i++) {
        if (!list.getLast().equals(List.of(nums[i], nums[i + 1]))) {
            list.add(new ArrayList<>(List.of(nums[i], nums[i + 1])));
        }
    }

    for (int i = 0; i < nums.length / 2; i++) {

        ArrayList<Integer> buffer2 = packer(new ArrayList<>(), nums, i, nums.length - i - 1);

        if (!list.contains(buffer2)) {
            list.add(buffer2);
        }
    }

    for (int i = 0; i < nums.length / 2; i++) {
        ArrayList<Integer> buffer2 = new ArrayList<>(List.of(nums[i], nums[nums.length - i - 1]));

        if (!list.contains(buffer2)) {
            list.add(buffer2);
        }
    }

    for (int i = 0; i < nums.length - 1; i++) {
        ArrayList<Integer> buffer2 =  packer(new ArrayList<>(), nums, 0, nums.length - 1 - i);

        if (!list.contains(buffer2)) {
            list.add(buffer2);
        }
    }

    for (int i = 0; i < nums.length - 1; i++) {
        ArrayList<Integer> buffer2 = packer(new ArrayList<>(), nums, i, nums.length - 1);

        if (!list.contains(buffer2)) {
            list.add(buffer2);
        }
    }

    List<List<Integer>> resolute = new ArrayList<>();

    for(List<Integer> curr : list) {
        int pos = 0;

        while (pos < resolute.size() &&
                order.compare(resolute.get(pos), curr) <= 0) {
            pos++;
        }

        resolute.add(pos, curr);
    }

    return resolute;
}

Comparator<List<Integer>> order =
        (a, b) -> {
            int n = Math.min(a.size(), b.size());

            for (int i = 0; i < n; i++) {
                int cmp = Integer.compare(a.get(i), b.get(i));
                if (cmp != 0) return cmp;
            }

            // shorter list first when all compared elements are equal
            return Integer.compare(a.size(), b.size());
        };

ArrayList<Integer> packer(ArrayList<Integer> list, int[] nums, int start, int end) {
    for (int i = start; i <= end; i++) {
        list.add(nums[i]);
    }

    return list;
}`,
  },
  {
    number: 91,
    title: "Decode Ways",
    slug: "decode-ways",
    difficulty: "Medium",
    topics: ["String", "Dynamic Programming"],
    language: "Java",
    solution: `public static int numDecodings(String s) {

    if (s.length() == 1 && !s.equals("0")) { System.out.print(numDecodingsHelper(s) + " "); return 1; }

    //Separate Character Based Integers
    s = tokenBreaker(s);

    StringBuilder tempStorage = new StringBuilder();
    StringBuilder permStorage = new StringBuilder();

    Scanner tokenScanner = new Scanner(s);

    /*<---- Check Next Number Style 1 ---->*/
    while (tokenScanner.hasNext()) {

        String step1 = tokenScanner.next();

        if (step1.equals("0")) {
            tempStorage.setLength(0);
            break;
        }

        String step2 = null;

        if (!tokenScanner.hasNext()) {
            tempStorage.append(numDecodingsHelper(step1));
            break;
        } else step2 = tokenScanner.next();

        if (step1.equals("1")) tempStorage.append(teenUpgrade(step2));
        if (step1.equals("2") && Integer.parseInt(step2) < 6) tempStorage.append(twentyUpgrade(step2));
        else if ((step1.equals("2") && Integer.parseInt(step2) > 6))
            tempStorage.append(numDecodingsHelper(step1)).append(numDecodingsHelper(step2));
    }

    //Attach 1st Decrypted Token
    permStorage.append(tempStorage).append(" ");

    /*Reset MAIN SCANNER in between uses*/
    /*Reset TEMP STRING BUILDER in between uses*/
    tokenScanner = new Scanner(s);
    tempStorage.setLength(0);

    /*<---- Check Next Number Style 2 ---->*/
    while (tokenScanner.hasNext()) {

        String step1 = tokenScanner.next();

        if (step1.equals("0")) {
            tempStorage.setLength(0);
            break;
        }

        String step2 = null;

        if (!tokenScanner.hasNext()) {
            tempStorage.append(numDecodingsHelper(step1));
            break;
        } else step2 = tokenScanner.next();

        if (step1.equals("1") && step2.equals("0")) {
            tempStorage.append(teenUpgrade(step2));
            continue;
        }
        if (step1.equals("2") && step2.equals("0")) {
            tempStorage.append(twentyUpgrade(step2));
            continue;
        }

        tempStorage.append(numDecodingsHelper(step1)).append(numDecodingsHelper(step2));
    }

    //Attach 2nd Decrypted Token
    permStorage.append(tempStorage).append(" ");

    /*Reset MAIN SCANNER in between uses*/
    /*Reset TEMP STRING BUILDER in between uses*/
    tokenScanner = new Scanner(s);
    tempStorage.setLength(0);

    /*<---- Check Next Number Style 3 ---->*/

    String step1 = tokenScanner.next();

    if (step1.equals("0")) {
        tempStorage.setLength(0);

        return tokenCounter(permStorage) - removeDuplicateTokenCount(permStorage);
    }

    tempStorage.append(numDecodingsHelper(step1));

    while (tokenScanner.hasNext()) {

        step1 = tokenScanner.next();

        if (step1.equals("0")) tempStorage.setLength(0); // <--- ATTENTION

        String step2 = null;

        if (!tokenScanner.hasNext()) {
            tempStorage.append(numDecodingsHelper(step1));
            break;

        } else step2 = tokenScanner.next();

        if (step1.equals("1")) tempStorage.append(teenUpgrade(step2));
        if (step1.equals("2") && Integer.parseInt(step2) <= 6) tempStorage.append(twentyUpgrade(step2));
        else if ((step1.equals("2") && Integer.parseInt(step2) > 6))
            tempStorage.append(numDecodingsHelper(step1)).append(numDecodingsHelper(step2));

    }

    //Attach 3rd Decrypted Token
    permStorage.append(tempStorage).append(" ");

    /*Reset MAIN SCANNER in between uses*/
    /*Reset TEMP STRING BUILDER in between uses*/
    tokenScanner = new Scanner(s);
    tempStorage.setLength(0);

    /*<---- Check Next Number Style 4 ---->*/

//        while (tokenScanner.hasNext()) {
//            step1 = tokenScanner.next();
//            if (step1.equals("0")) { tempStorage.setLength(0); break; }
//            tempStorage.append(numDecodingsHelper(step1));
//        }


    Scanner tempStorageScanner = new Scanner(s);
    while (tokenScanner.hasNext() && size(tempStorageScanner) <= 2) {
        tempStorage.append(tokenScanner.next());
    }

    if (Integer.parseInt(originalDataStructure(s)) <= 26) { tempStorage.setLength(0); tempStorage.append(numDecodingsHelper(originalDataStructure(s))); } else tempStorage.setLength(0);

    //Attach 4th Decrypted Token
    permStorage.append(tempStorage).append(" ");

    /*<---- Evaluate Tokens For Debugging ---->*/
    tokenScanner = new Scanner(permStorage.toString());
    while (tokenScanner.hasNext()) {
        System.out.print(tokenScanner.next() + " ");
    }

    //Close Scanner
    tokenScanner.close();

    //Report How Many Unique Tokens
    return uniqueTokenCount(permStorage);
}

public static char numDecodingsHelper(String s) {

    return switch (s) {
        case "1" -> 'A';
        case "2" -> 'B';
        case "3" -> 'C';
        case "4" -> 'D';
        case "5" -> 'E';
        case "6" -> 'F';
        case "7" -> 'G';
        case "8" -> 'H';
        case "9" -> 'I';
        case "10" -> 'J';
        case "11" -> 'K';
        case "12" -> 'L';
        case "13" -> 'M';
        case "14" -> 'N';
        case "15" -> 'O';
        case "16" -> 'P';
        case "17" -> 'Q';
        case "18" -> 'R';
        case "19" -> 'S';
        case "20" -> 'T';
        case "21" -> 'U';
        case "22" -> 'V';
        case "23" -> 'W';
        case "24" -> 'X';
        case "25" -> 'Y';
        case "26" -> 'Z';
        default -> ' ';
    };
}

public static char teenUpgrade(String s) {

    return switch (s) {
        case "0" -> numDecodingsHelper("10");
        case "1" -> numDecodingsHelper("11");
        case "2" -> numDecodingsHelper("12");
        case "3" -> numDecodingsHelper("13");
        case "4" -> numDecodingsHelper("14");
        case "5" -> numDecodingsHelper("15");
        case "6" -> numDecodingsHelper("16");
        case "7" -> numDecodingsHelper("17");
        case "8" -> numDecodingsHelper("18");
        case "9" -> numDecodingsHelper("19");
        default -> numDecodingsHelper(Integer.valueOf(s).toString());
    };
}

public static char twentyUpgrade(String s) {

    return switch (s) {
        case "0" -> numDecodingsHelper("20");
        case "1" -> numDecodingsHelper("21");
        case "2" -> numDecodingsHelper("22");
        case "3" -> numDecodingsHelper("23");
        case "4" -> numDecodingsHelper("24");
        case "5" -> numDecodingsHelper("25");
        case "6" -> numDecodingsHelper("26");
        default -> numDecodingsHelper(Integer.valueOf(s).toString());
    };
}

public static String tokenBreaker(String s) {

    StringBuilder sb = new StringBuilder();

    for (int i = 0; i < s.length(); i++) {
        sb.append(s.charAt(i)).append(" ");
    }
    return sb.toString();
}

public static int tokenCounter(StringBuilder s) {
    Scanner tokenScanner = new Scanner(s.toString());

    int internalCount = 0;

    while (tokenScanner.hasNext()) {
        tokenScanner.next();
        internalCount++;
    }

    return internalCount;
}

public static int removeDuplicateTokenCount(StringBuilder permStorage) {
    int permDuplicateCount = 0;
    int tempDuplicateCount = 0;

    Scanner tokenScanner = new Scanner(permStorage.toString());
    Set<String> seen = new HashSet<>();

    while (tokenScanner.hasNext()) {
        String token = tokenScanner.next();
        if (seen.contains(token)) continue; // skip if already handled
        seen.add(token);

        Scanner tokenReplicateScanner = new Scanner(permStorage.toString());
        while (tokenReplicateScanner.hasNext()) {
            if (token.equals(tokenReplicateScanner.next()))
                tempDuplicateCount++;
        }

        if (tempDuplicateCount > 1)
            permDuplicateCount += 1;

        tempDuplicateCount = 0;
    }
    return permDuplicateCount;
}

public static int size(Scanner s) {
    int size = 0;

    while (s.hasNext()) {
        s.next();
        size++;
    }
    return size;
}

public static String originalDataStructure (String s) {
    Scanner tokenScanner = new Scanner(s);
    StringBuilder semiRes = new StringBuilder();

    while (tokenScanner.hasNext()) {
        semiRes.append(tokenScanner.next());
    }
    return semiRes.toString();
}

public static int uniqueTokenCount(StringBuilder permStorage) {
    Scanner tokenScanner = new Scanner(permStorage.toString());
    Set<String> unique = new HashSet<>();
    while (tokenScanner.hasNext()) {
        unique.add(tokenScanner.next());
    }
    return unique.size();
}`,
  },
  {
    number: 92,
    title: "Reverse Linked List II",
    slug: "reverse-linked-list-ii",
    difficulty: "Medium",
    topics: ["Linked List"],
    language: "Java",
    solution: `/*
UNDERSTAND: You're given a linked list and your job is to reverse everything in between 
the two given left and right variables. It's important to note that these aren't indexes
and are instead values. Consider the first appearance of said bounds to be the target
addresses that need manipulation.

Constraints: Length of linked list can range 1, 500. Each node can value -500, 500.
Given left integer must be less than or equal to given right integer.

Edge Cases: 

MATCH: Doubly-ended linked list

PLAN: One option is to modify the Linked List to be a doubly ended linked list. The problem is
that in the big O complexity creating a new datastructure and manually adding each address
to previous is very unoptimal.

Another option is to traverse the list and store all elements inside a vector.
We then build a new linked list iterating through each element in the list until left is found,
that's when we continue iterating until right is found. When right is found we create a sub loop
iterating and adding to the list backwards. Then we pick up from where we left off and finish the inital loop.

Time Complexity: O(N^2) This is because of the sub loop encompassing left & right targets which could span a
noticable amount of the vector.

Space Complexity: O(N) Because we're building a vector for real-time/dynamic refferencing.
   */
public ListNode reverseBetween(ListNode head, int left, int right) {

    if (head == null || head.next == null) return head;

    List<Integer> list = buildList(head, new ArrayList<>());
    ListNode result = head;

    for (int i = 0; i < list.size(); i++) {
        if (i + 1 == left) {
            for (int r = right - 1; r >= i; r--) {
                    result.next = new ListNode(list.get(r));
                    result = result.next;
                }
                i = right - 1;
        } else {
            result.next = new ListNode(list.get(i));
            result = result.next;
            }
    }
    
    printLinkedList(head.next);
    
    return head.next;
}

private List<Integer> buildList(ListNode head, List<Integer> list) {
    if (head == null) {
        return list;
    }

    list.add(head.val);
    head = head.next;
    buildList(head, list);

    return list;
}

private void printLinkedList(ListNode head) {

    if (head == null) {
        System.out.println("[]");
        return;
    }

    if (head.next == null) {
        System.out.println("[" + head.val + "]");
        return;
    }

    StringBuilder sb = new StringBuilder("[");
    while (head != null) {
        sb.append(head.val).append(", ");
        head = head.next;
    }

    sb.replace(sb.length() - 2, sb.length(), "");

    System.out.println(sb.append("]").toString());
}`,
  },
  {
    number: 100,
    title: "Same Tree",
    slug: "same-tree",
    difficulty: "Easy",
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    language: "Java",
    solution: `public static boolean isSameTree(TreeNode p, TreeNode q) {

    if (p == null && q == null) return true;
    if (p != null && q == null || p == null && q != null) return false;

        if (p.val == q.val) return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);

    return false;
}`,
  },
  {
    number: 101,
    title: "Symmetric Tree",
    slug: "symmetric-tree",
    difficulty: "Easy",
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    language: "Java",
    solution: `public static boolean isSymmetric(TreeNode root) {
    return root == null || isMirror(root.left, root.right);
}

public static boolean isMirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;

    if (a.val != b.val) return false;
    return isMirror(a.left, b.right) && isMirror(a.right, b.left);
}`,
  },
  {
    number: 118,
    title: "Pascal's Triangle",
    slug: "pascals-triangle",
    difficulty: "Easy",
    topics: ["Array", "Dynamic Programming"],
    language: "Java",
  },
  {
    number: 125,
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "Easy",
    topics: ["Two Pointers", "String"],
    language: "Java",
    solution: `public static boolean isPalindrome(String s) {

    StringBuilder backwards = new StringBuilder();

    for (int i = s.length() - 1; i >= 0; i--)

        if (Character.isLetter(s.charAt(i)) || Character.isDigit(s.charAt(i)))
        backwards.append(s.charAt(i));

    String string = backwards.toString().toLowerCase();
    String reversed_string = backwards.reverse().toString().toLowerCase();

    System.out.println(string);
    System.out.println(reversed_string);

    return string.equals(reversed_string);
}`,
  },
  {
    number: 129,
    title: "Sum Root to Leaf Numbers",
    slug: "sum-root-to-leaf-numbers",
    difficulty: "Medium",
    topics: ["Tree", "Depth-First Search", "Binary Tree"],
    language: "Java",
    solution: `/*
UNDERSTAND: We need to record all permutations from root to node add them to a overall
total and then return said total. A root to node permuatation travels down the branch
of a tree until a root is reached. Many branches may exist and there for permutations are considered.

Constraints: Tree can contain 1, 1000 nodes. Each node can range from 0, 9 in value.
Edge Cases: If you're given a tree with zero nodes, return zero... If you're given a tree with one node,
return the value of the singular node.

MATCH: Pre-order traversal

PLAN: We're going to use a function that recursively considers an integer total.
We've known that a root has been hit the current root is null. At which point we're going
to add to the objects total field. We're building every number arithmetically multiping the
number by 10, this is done to increase the decimal placement. This is done after adding the current
nodes value, decimal place is incremented under the circumstance that there will be another value
to append from the current branch.  

Time Complexity: O(N log N) typical binary tree traversal.  
Space Complexity: O(1) We're not creating new data just reasigning and traversing given data.
*/

int objTotal = 0;

public int sumNumbers(TreeNode root) {
    int sum = helper(root, 0);
    clear();
    return sum;
}

private int helper(TreeNode root, int total) {
    if (root == null) {
        return this.objTotal;
    }

    total = (total + root.val);

    if (root.left != null) {
        helper(root.left, total * 10);
    }

    if (root.right != null) {
        helper(root.right, total * 10);
    }

    if (root.left == null && root.right == null) {
        this.objTotal += total;
    }

    return this.objTotal;
}

private void clear() {
    this.objTotal = 0;
}`,
  },
  {
    number: 135,
    title: "Candy",
    slug: "candy",
    difficulty: "Hard",
    topics: ["Array", "Greedy"],
    language: "Java",
  },
  {
    number: 150,
    title: "Evaluate Reverse Polish Notation",
    slug: "evaluate-reverse-polish-notation",
    difficulty: "Medium",
    topics: ["Array", "Math", "Stack"],
    language: "Java",
    solution: `public int evalRPN(String[] tokens) {

    Stack<Integer> stack = new Stack<>();

    for (String token : tokens) {
        try {
            Integer.parseInt(token);
            stack.push(Integer.parseInt(token));
        } catch (NumberFormatException e) {
            Integer second = stack.pop();
            Integer first = stack.pop();

            stack.push(getOperanded(token, second, first));
        }
    }
    return stack.pop();
}

public int getOperanded(String expectedOperand, Integer first, Integer second) {
    return switch (expectedOperand) {
        case "+" -> second + first;
        case "-" -> second - first;
        case "/" -> second / first;
        case "*" -> second * first;
        default -> throw new NumberFormatException();
    };
}`,
  },
  {
    number: 151,
    title: "Reverse Words in a String",
    slug: "reverse-words-in-a-string",
    difficulty: "Medium",
    topics: ["Two Pointers", "String"],
    language: "Java",
    solution: `public static String reverseWords(String s) { //spaces are at 10, 7, and 3

    StringBuilder result = new StringBuilder();

    if (s.indexOf(' ') == -1) {
        return s;
    } else if (s.indexOf(' ') == s.lastIndexOf(' ')) {
        result.append(s);
        result.deleteCharAt(s.indexOf(' '));
    }

    int foundSpace = s.length();

    for (int i = s.length() - 1; i >= 0 ; i--) {
        if (s.charAt(i) == ' ') {

            result.append(s, i + 1, foundSpace);
            result.append(' ');

            //last found space
            foundSpace = i;
        }
    }

    //add the first word
    for (int i = 0; i < s.length() - 1; i++) {
        if (s.charAt(i) == ' ') {
            result.append(s, 0, i);
            break;
        }
    }

    // test justification considering spaces
    for (int i = 0; i < result.length() - 1; i++) {
        if (i == 0 && result.charAt(i) == ' ' && result.charAt(i + 1) == ' ') { result.deleteCharAt(i + 1); }
        if (i == result.length() - 1 && result.charAt(i) == ' ' && result.charAt(i - 1) == ' ') {result.deleteCharAt(i - 1); }

        if (i == 0 && result.charAt(i) == ' ') result.deleteCharAt(i);
        if (i == result.length() - 1 && result.charAt(i) == ' ') result.deleteCharAt(i);

        if (i > 0 && result.charAt(i) == ' ' && result.charAt(i - 1) == ' ') { result.deleteCharAt(i);  i--; }
        if (i < result.length() - 1 && result.charAt(i) == ' ' && result.charAt(i + 1) == ' ') { result.deleteCharAt(i);  i--; }
    }

    //remove starting or trailing space
    if (result.charAt(0) == ' ') result.deleteCharAt(0);
    if (result.charAt(result.length() - 1) == ' ') result.deleteCharAt(result.length() - 1);

    return result.toString();
}`,
  },
  {
    number: 160,
    title: "Intersection of Two Linked Lists",
    slug: "intersection-of-two-linked-lists",
    difficulty: "Easy",
    topics: ["Hash Table", "Linked List", "Two Pointers"],
    language: "Java",
    solution: `public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    if (headA == null || headB == null) return null;
    ListNode tempHeadA = headA;
    while (tempHeadA != null) {
        ListNode tempHeadB = headB;
        while (tempHeadB != null) {
            if (tempHeadA == tempHeadB) {
                System.out.printf("Intersected at '" + tempHeadA.val + "'");
                return tempHeadA;
            }
            tempHeadB = tempHeadB.next;
        }
        tempHeadA = tempHeadA.next;
    }
    return null;
}`,
  },
  {
    number: 168,
    title: "Excel Sheet Column Title",
    slug: "excel-sheet-column-title",
    difficulty: "Easy",
    topics: ["Math", "String"],
    language: "Java",
    solution: `    public String convertToTitle(int columnNumber) {
    if (columnNumber <= 26)
        return tellChar(columnNumber);
        else {
        String postfix = helper2(helper1(columnNumber).postfix);
        String column = tellChar(helper1(columnNumber).column);
        if (helper1(columnNumber).column == 0) return postfix;
        return helper2(helper1(columnNumber).postfix) + tellChar(helper1(columnNumber).column);
    }
}

record Pair(int column, int postfix) {}

/*A Simple switch case function that returns the
lexicographically correct match upon integer index*/
private String tellChar(int i) {
    return switch (i) {
        case 1 -> "A";
        case 2 -> "B";
        case 3 -> "C";
        case 4 -> "D";
        case 5 -> "E";
        case 6 -> "F";
        case 7 -> "G";
        case 8 -> "H";
        case 9 -> "I";
        case 10 -> "J";
        case 11 -> "K";
        case 12 -> "L";
        case 13 -> "M";
        case 14 -> "N";
        case 15 -> "O";
        case 16 -> "P";
        case 17 -> "Q";
        case 18 -> "R";
        case 19 -> "S";
        case 20 -> "T";
        case 21 -> "U";
        case 22 -> "V";
        case 23 -> "W";
        case 24 -> "X";
        case 25 -> "Y";
        case 26 -> "Z";
        default -> "";
    };
}

/*Returned value of columnNumber signifies the remainder of this number divisible by 26
* the postfix signifies the lexicographical index divisible by 26. This means that if the
* integer is above 26 we need to accommodate the following character in front of the last
* lexicographical integer which is character known as zed (z). */
private Pair helper(int columnNumber, int postfix) {
    if (columnNumber < 26) {
        return new Pair(columnNumber, postfix);
    } else {
        return helper(columnNumber - 26, postfix + 1);
    }
}

/*Essentially the same function as the one above,
it uses standard division instead of being recursive by nature. */
private Pair helper1(int columnNumber) {
    int q = (columnNumber) / 26;
    int r = (columnNumber) % 26;
    System.out.println(q + ", " + r);
    return new Pair(r, q);
}

/*Returned string signifies the lexicographical occur of a Microsoft Excel sheet formated line identifier.
* E.g, ZY we get out first character from the column equivalent integer, representing the twenty-sixth by
* twenty-sixth column found in an Excel sheet.*/
private String helper2(int postfix) { //82595524
    StringBuilder sb = new StringBuilder();
    while (postfix > 26) {
        sb.insert(0, tellChar(postfix % 26));
        postfix /= 26;
    }
    return tellChar(postfix) + sb;
}`,
  },
  {
    number: 189,
    title: "Rotate Array",
    slug: "rotate-array",
    difficulty: "Medium",
    topics: ["Array", "Math", "Two Pointers"],
    language: "Java",
    solution: `/*
UNDERSTAND: You've given an array and an integer k. Your job is to rotate
the array by k amounts clocwise.

Constraints: Given k will always be a non negative integer with a value between 0, 10^5.
The length of an array can range from 1, 10^5 elements long. Each element can have a
value of integer min/max. 

Edge Cases: If k is zero just return the same array.

MATCH: Division, Queue, List

PLAN: I'm going to take k and divide it by the length of the array,
the remainer will be how much we actually need to rotate said array. This is because a
full rotation to the integer between k and the length of the array would just simply a full circle
representing a copy. We're then going to take the last k / length of vect elements and then swap them,
then take the proceeding elements up that weren't coppied and place them ahead.

Time Complexity:
Space Complexity:
*/
public void rotate(int[] nums, int k) {
    k %= nums.length;

    // Ask if there any any rotations to be conducted.
    if (k == 0 || k % nums.length == 0) return;
    
    int[] copy = nums.clone();

    // Push the last k elements ascending.
    int idx = 0;
    for (int i = copy.length - k; i < copy.length; i++) {
        nums[idx++] = copy[i];
    }

    // Dump the numbers that come after.
    for (int i = 0; i < copy.length - k; i++) {
        nums[idx++] = copy[i];
    }
}

private static String stringifyPrimitiveIntegerArray(int[] nums) {
    StringBuilder sb = new StringBuilder("[");

    for (int n : nums) {
        sb.append(n).append(", ");
    }

    sb.replace(sb.length() - 2, sb.length(), "");

    return sb.append("]").toString();
} `,
  },
  {
    number: 190,
    title: "Reverse Bits",
    slug: "reverse-bits",
    difficulty: "Easy",
    topics: ["Divide and Conquer", "Bit Manipulation"],
    language: "Java",
    solution: `/*
UNDERSTAND: Reverse bits is a function that takes an i32/ signed 32 bit
integer, n and transforms it int binary. Reverses that binary and then
displays the signed 32 bit integer value again.

Integers can get rather large so this must be done in a time efficient manor.

Constraints: integers can range from 0 to 2^32 - 2. The value of n will always be an even number. 
Edge Cases:  

MATCH: Bit-wise shifting.

PLAN: To retrieve the binary value of a number you need to constantly
append the remainder until the number you're working (the quotent) with is zero.
We don't need to this here, it's just worth mentioning.

Reverse the number bits of the binary requires starting with a blank i32 variable to store data
the bitwise operation shifting to the left to create a blank spot and then xor/copy the right
most bit from n into that blank spot in your created variable. Finally, shift the right most digit
in n to the right over by one to get it ready.

Time Complexity: O(1) You're completing the same operations 32 times to create a 32 bit integer.
division and then looping to create a binary number.

Space Complexity: O(1) The value of the binary/integer may decrease or increase,
but the space to contain these bits stay the same, 32 bits total.
*/
public int reverseBits(int n) {
    // Instantiate 32 bit integer
    int result = 0;

    for (int i = 0; i < 32; ++i) {
        // Move left most value in result over by one.
        result <<= 1;
        // Place right most value in n in the right most position.
        result ^= (n & 1);
        // Move right most value in n over by one.
        n >>= 1;
    }

    return result;
}`,
  },
  {
    number: 191,
    title: "Number of 1 Bits",
    slug: "number-of-1-bits",
    difficulty: "Easy",
    topics: ["Divide and Conquer", "Bit Manipulation"],
    language: "Java",
    solution: `public int hammingWeight(int n) {

    //int bits = (int)log2(x) + 1; in C
    //int bits = 32 - Integer.numberOfLeadingZeros(x); another Java option

    StringBuilder sb = new StringBuilder();

    while (n > 0) {
        int bit = n % 2;
        sb.append(bit);
        n /= 2;
    }

    return oneSum(sb.reverse().toString());
}

public int oneSum(String bits) {

    if (bits.equals("")) {
        return 0;
    }

    if (bits.charAt(0) == '1') {
        return 1 + oneSum(bits.substring(1));
    } else {
        return oneSum(bits.substring(1));
    }
}`,
  },
  {
    number: 206,
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    language: "Java",
    solution: `public static ListNode reverseList(ListNode head) {

    if (head == null || head.next == null) {
        return head;
    }

    ListNode tail = head.next;
    head.next = null;

    while (tail != null) {
            ListNode temp = tail.next;
            tail.next = head;
            head = tail;
            tail = temp;
        }
    return head;
}


public static ListNode deleteDuplicates2(ListNode head) {
    if (head == null) return null;

    ListNode result = head;

    while (result.next != null) {
        if (result.val == result.next.val) {
            result.next = result.next.next;
        } else {
            result = result.next;
        }
    }
    return head;
}

public static ListNode reverseList2(ListNode head) {
    // Step 1: Check if the list is empty or has only one node
    if (head == null || head.next == null) {
        return head; // Nothing to reverse
    }

    // Step 2: Initialize two pointers
    ListNode current = head.next; // Start from the second node
    head.next = null; // The first node will become the tail, so it should point to null
    ListNode previous = head; // This will keep track of the reversed part

    // Step 3: Traverse the list and reverse links
    while (current != null) {
        // Step 3a: Save the next node temporarily
        ListNode nextNode = current.next;

        // Step 3b: Reverse the current node's pointer
        current.next = previous;

        // Step 3c: Move the previous pointer forward
        previous = current;

        // Step 3d: Move the current pointer forward
        current = nextNode;
    }

    // Step 4: Previous now points to the new head
    return previous;
}`,
  },
  {
    number: 217,
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    topics: ["Array", "Hash Table", "Sorting"],
    language: "Java",
    solution: `public boolean containsDuplicate(int[] nums) {

    HashSet<Integer> set = new HashSet<>();

    for (int x : nums) {
            set.add(x);
    }

    return set.size() != nums.length;
}`,
  },
  {
    number: 231,
    title: "Power of Two",
    slug: "power-of-two",
    difficulty: "Easy",
    topics: ["Math", "Bit Manipulation", "Recursion"],
    language: "Java",
    solution: `public static boolean isPowerOfTwo(int n) {
    if (n > 0 && (n & (n - 1)) == 0) {
        return true;
    } else {
        return false;
    }
}`,
  },
  {
    number: 242,
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    topics: ["Hash Table", "String", "Sorting"],
    language: "Java",
    solution: `public static boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    HashMap<Character, Integer> myFirstMap = makeHash(s);
    HashMap<Character, Integer> mySecondMap = makeHash(t);
    return myFirstMap.equals(mySecondMap);
}

public static HashMap<Character, Integer> makeHash(String s) {

    ArrayList<Character> a = new ArrayList<>();
    HashMap<Character, Integer> myFirstMap = new HashMap<>();
    int counter = 0;

    for (int i = 0; i < s.length(); i++) {
        if (!a.contains(s.charAt(i))) {
            a.add(s.charAt(i));
            for (int j = i; j < s.length(); j++) {
                if (a.get(a.size() - 1) == s.charAt(j)) {
                    counter++;
                }
            }
        } else continue;
        myFirstMap.put(a.get(a.size() - 1), counter);
        counter = 0;
    }
    return myFirstMap;
}

}

// C:\\Users\\Derpe\\IdeaProjects\\3115\\CISC 3115 final212_2025\\src\\a.txt
// C:\\Users\\Derpe\\IdeaProjects\\3115\\CISC 3115\\final212_2025\\src\\b.txt`,
  },
  {
    number: 263,
    title: "Ugly Number",
    slug: "ugly-number",
    difficulty: "Easy",
    topics: ["Math"],
    language: "Java",
    solution: `/*
UNDERSTAND: You're given a number and your job is to determine if it's ugly or not.
The qualifications for an ugly number are that it doesn't have a prime factor other than 2, 3, or 5.
Your job is to return a boolean value based on the status of this numbers ugliness.

Constraints: Value of number can range from -2^31, 2^31.
Edge Cases: If number is negative proccess absolute value.

MATCH: Greedy

PLAN: I'm going to iterate backwards represented by i starting from given n to 2 asking a long the way if
absolute value of said number of mod i gives zero. If yes it's added to a list. If said number is a prime number other
than 2, 3, or 5 immediately return yes.

That being said we don't need to check for two, and odd numbers aside from 2 are prime.

Time Complexity:
Space Compelxity:
*/
public boolean isUgly(int n) {
    // If we're starting with an even number we deincrement by one, otherwise we decincrement by two.
    // This is so that we can review only numbers as those are prime numbers.
    if (n == Integer.MAX_VALUE || n == Integer.MIN_VALUE || n <= 0) return false;
    int mut = n;
    mut = mut % 2 != 0 ? mut - 2 : mut - 1;
    for (int i = mut; i > 0; i -= 2) {
            if (i != 1 && i != 2 && i != 3 && i != 5 && n % i == 0 && n % 2 != 0) {
                return false;
            }
        }

    return true;
}`,
  },
  {
    number: 326,
    title: "Power of Three",
    slug: "power-of-three",
    difficulty: "Easy",
    topics: ["Math", "Recursion"],
    language: "Java",
    solution: `public static boolean isPowerOfThree(int n) {
    if (n <= 0) return false;
    if (n == 1) return true;
//        System.out.println(n);
    if (n % 3 != 0) return false;
    return isPowerOfThree(n / 3);
}`,
  },
  {
    number: 344,
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    topics: ["Two Pointers", "String"],
    language: "Java",
    solution: `public void reverseString(char[] s) {

    int x = 0;
    char[] temp = new char[s.length];

    for (int i = s.length - 1; i >= 0; i--) {
        temp[x++] = s[i];
    }
    x = 0;
    for (char i : temp) {
        s[x] = temp[x++];
    }
}`,
  },
  {
    number: 367,
    title: "Valid Perfect Square",
    slug: "valid-perfect-square",
    difficulty: "Easy",
    topics: ["Math", "Binary Search"],
    language: "Java",
    solution: `/*
UNDERSTNAD: A perfect square is a number whose
square root is a whole number. E.g., 16 is 4. 
Constants: num can be 1 or 2^31 - 1 so the largest integer possible.
Edge Cases: 
MATCH: Math.sqrt() and Math.floor()
PLAN: Use Math.sqrt and division to find out if the number is already whole.
Time Complexity: O(1) There are no loops involved.
Space Complexity: O(1) Nothing new is created.
IMPLEMENT:
*/
    public boolean isPerfectSquare(int num) {
        return (Math.sqrt(num) == Math.floor(Math.sqrt(num)));
}`,
  },
  {
    number: 383,
    title: "Ransom Note",
    slug: "ransom-note",
    difficulty: "Easy",
    topics: ["Hash Table", "String", "Counting"],
    language: "Java",
    solution: `public static boolean canConstruct(String ransomNote, String magazine) {

    StringBuilder sb = new StringBuilder(magazine);


    for (int i = 0; i < ransomNote.length(); i++) {
        boolean found = false;

            for (int j = 0; j < magazine.length(); j++) {
                if (ransomNote.charAt(i) == magazine.charAt(j)) {
                    sb.setCharAt(j, '/');
                    magazine = sb.toString();
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
    return true;
}`,
  },
  {
    number: 412,
    title: "Fizz Buzz",
    slug: "fizz-buzz",
    difficulty: "Easy",
    topics: ["Math", "String", "Simulation"],
    language: "Java",
    solution: `public List<String> fizzBuzz(int n) {

    List<String> answer = new ArrayList<>();

    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) {
            answer.add("FizzBuzz");
        } else

        if (i % 3 == 0) {
            answer.add("Fizz");
        } else {

            if (i % 5 == 0) {
            answer.add("Buzz");
        } else {
                answer.add(String.valueOf(i));
            }
                }
            }
    return answer;
    }
}

//https://www.youtube.com/watch?v=2AJH_EZhR8g&ab_channel=CodingJesus`,
  },
  {
    number: 509,
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    difficulty: "Easy",
    topics: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
    language: "Java",
    solution: `public int fib(int n) {
    if (n == 0 || n == 1) {
        return n;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}`,
  },
  {
    number: 621,
    title: "Task Scheduler",
    slug: "task-scheduler",
    difficulty: "Medium",
    topics: ["Array", "Hash Table", "Greedy", "Sorting", "Heap (Priority Queue)", "Counting"],
    language: "Java",
  },
  {
    number: 645,
    title: "Set Mismatch",
    slug: "set-mismatch",
    difficulty: "Easy",
    topics: ["Array", "Hash Table", "Bit Manipulation", "Sorting"],
    language: "Java",
    solution: `/*
UNDERSTAND: You're given an array of integers that contains an error defined
as a mismatch between two numbers where one number is duplicated and one number is missing.

Constraints: The length of every array ranges from 2, 10^4.
The value of each element can range from 1, 10^4. Only one mismatch per array.

Edge Cases:

MATCH: Hashmap

PLAN: I'm going to maintain a HashMap iterated to the length of nums. Where the appearance of a number
is greater than one, we set that as result[0]. Then continue searching for the second number which doesn't exist.
Once the expected iteration is not found in the proper index of nums - 1, i we know that's the missing
index; setting that as result[1]. Then we break out of the loop and return the result array. 

Time Complexity:
Space Complexity:
*/
public int[] findErrorNums(int[] nums) {
    HashMap<Integer, Integer> map = new HashMap<>();
    int[] result = new int[2]; 

    for (int i = 0; i < nums.length; i++) {
        // Count numbers, should be one of each
        map.put(nums[i], map.getOrDefault(nums[i], 0) + 1);
    }


    for (int i = 1; i < nums.length + 1; i++) {
        if (map.containsKey(i)) {
            if (map.get(i) > 1) {
                result[0] = i; 
            }
        } else {
            result[1] = i;
        }
    }
    return result;
}

private static String stringifyPrimIntegerArr(int[] arr) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < arr.length - 1; i++) {
        sb.append(arr[i]).append(", ");
    }

    return sb.append(arr[arr.length - 1]).append("]").toString();
}`,
  },
  {
    number: 653,
    title: "Two Sum IV - Input is a BST",
    slug: "two-sum-iv-input-is-a-bst",
    difficulty: "Easy",
    topics: ["Hash Table", "Two Pointers", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Search Tree", "Binary Tree"],
    language: "Java",
    solution: `    public boolean findTarget(TreeNode root, int k) {
        // Create map Object
        HashMap<Integer, Integer> mpx = new HashMap<>();
        // Fill map
        mapBst(root, mpx);
        // Search map for k
        for (Map.Entry<Integer, Integer> entry : mpx.entrySet()) {
            // Temp Variables
            int key = entry.getKey();
            int val = entry.getValue();
            
            /*
            If our map contains two values that equal k return true,
            or perhaps our maps contains the difference of
            k minus a nodes value return true.
            */
            if (val >= 2 && key + key == k) { 
                return true;
            } else if (mpx.containsKey(k - key) && k - key != key) {
                return true;
            }
        }

        // Never found a combination, return false.
        return false;
}

private static void mapBst(TreeNode root, HashMap<Integer, Integer> mpx) {
    if (root == null) return;
    
    mapBst(root.left, mpx);
    mpx.put(root.val, mpx.getOrDefault(root.val, 0) + 1);
    mapBst(root.right, mpx);
}`,
  },
  {
    number: 704,
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    topics: ["Array", "Binary Search"],
    language: "Java",
    solution: `public int search(int[] nums, int target) {
    int low = 0;
    int high = nums.length - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
  },
  {
    number: 796,
    title: "Rotate String",
    slug: "rotate-string",
    difficulty: "Easy",
    topics: ["String", "String Matching"],
    language: "Java",
    solution: `public boolean rotateString(String s, String goal) {
    
    StringBuilder mutable = new StringBuilder(s);
    
    for (int i = 0; i < s.length(); i++) {
        mutable.insert(0, mutable.substring(mutable.length() - 1));
        mutable.deleteCharAt(mutable.length() - 1);
        
        if (mutable.toString().equals(goal)) {
            return true;
        }
    }

    return false;
}`,
  },
  {
    number: 832,
    title: "Flipping an Image",
    slug: "flipping-an-image",
    difficulty: "Easy",
    topics: ["Array", "Two Pointers", "Bit Manipulation", "Matrix", "Simulation"],
    language: "Java",
    solution: `public int[][] flipAndInvertImage(int[][] image) {
    for (int i = 0; i < image.length; i++) {

        //flip order
        flipArrayOrder(image, i);

        for (int j = 0; j < image[i].length; j++) {

            //flip bits
            if (image[i][j] == 1) {
                image[i][j] = 0;
            } else {
                image[i][j] = 1;
            }
        }
    }
    return image;
}

public void flipArrayOrder(int[][] image, int i) {
    int[] temp = new int[image[i].length];

    for (int j = image[i].length - 1; j >= 0 ; j--) {
        temp[image[i].length - j - 1] = image[i][j];
    }

    image[i] = temp;
}

public void debugVisual(int[][] flipped) {
    System.out.println("New: ");

    for (int i = 0; i < flipped.length; i++) {
        for (int j = 0; j < flipped[i].length; j++) {
            System.out.print(flipped[i][j] + " ");
        }
        System.out.println();
    }
    System.out.println();
}`,
  },
  {
    number: 836,
    title: "Rectangle Overlap",
    slug: "rectangle-overlap",
    difficulty: "Easy",
    topics: ["Math", "Geometry"],
    language: "Java",
    solution: `public static boolean isRectangleOverlap(int[] rec1, int[] rec2) {
    Rectangle main = new Rectangle(rec1[0], rec1[1], rec1[2], rec1[3]);
    Rectangle other = new Rectangle(rec2[0], rec2[1], rec2[2], rec2[3]);

    return main.intersects(other);
}
}

class Rectangle {
//known corners
int x1, y1, x2, y2;
//unknown corners
int x3, y3, x4, y4;

public Rectangle(int x1, int y1, int x2, int y2) {
    // known corners
    /*Bottom Left*/
    this.x1 = x1;
    this.y1 = y1;
    /*Top Right*/
    this.x2 = x2;
    this.y2 = y2;

    //unknown corners
    /*Bottom Right*/
    this.x3 = x2;
    this.y3 = y1;
    /*Top Left*/
    this.x4 = x1;
    this.y4 = y2;
}

public boolean intersects(Rectangle other) {

    if (this.x2 <= other.x1) return false;
    if (this.x1 >= other.x2) return false;
    if (this.y2 <= other.y1) return false;
    if (this.y1 >= other.y2) return false;

    return true;
}`,
  },
  {
    number: 876,
    title: "Middle of the Linked List",
    slug: "middle-of-the-linked-list",
    difficulty: "Easy",
    topics: ["Linked List", "Two Pointers"],
    language: "Java",
    solution: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 * int val;
 * ListNode next;
 * ListNode() {}
 * ListNode(int val) { this.val = val; }
 * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

public ListNode middleNode(ListNode head) {
    if (head.next == null) return head;

    int len = findLen(head), currLen = 0, midLen = 0;
    if (len % 2 == 0) midLen = len / 2; else midLen = len / 2;

    while (head != null) {
        head = head.next;
        currLen++;
        if (currLen == midLen) return head;
    }
    return null;
}

public int findLen(ListNode head) {
    if (head == null) return 0;
    return 1 + findLen(head.next);
}

/*For Testing*/
//    public int middleNode(ListNode head) {
//        if (head.next == null) return head.val;
//
//        int len = findLen(head), currLen = 0, midLen = 0;
//        if (len % 2 == 0) midLen = len / 2; else midLen = len / 2;
//
//        while (head != null) {
//            head = head.next;
//            currLen++;
//            if (currLen == midLen) return head.val;
//        }
//        return 0;
//    }
//
//    public int findLen(ListNode head) {
//        if (head == null) return 0;
//        return 1 + findLen(head.next);
//    }`,
  },
  {
    number: 896,
    title: "Monotonic Array",
    slug: "monotonic-array",
    difficulty: "Easy",
    topics: ["Array"],
    language: "Java",
    solution: `/*
only making it this complicated to work on recursion,
If order is true, then increasing. If order is false, then decreasing.
If triv is true, then the final result is true because the order is trivial.
This is because only the last element of the array is different.
*/
public boolean isMonotonic(int[] nums) {

    if (isIncOrDec(nums, 0)) {
        return funcInc(nums, 0);
    } else {
        return funcDec(nums, 0);
    }
}

/*
determine if the array is increasing or decreasing order
*/
public boolean isIncOrDec(int[] nums, int index) {

    if (index == nums.length - 1) {
        return true;
    }

    if (nums[index] < nums[index + 1]) {
        return true;
    } else if (nums[index] > nums[index + 1]) {
        return false;
    } else {
        return isIncOrDec(nums, index + 1);
    }
}

public boolean funcInc(int[] nums, int start) {

    if (start == nums.length - 1) {
        return true;
    }

    if (nums[start] > nums[start + 1]) {
        return false;
    }

    return funcInc(nums, start + 1);
}

public boolean funcDec(int[] nums, int start) {

    if (start == nums.length - 1) {
        return true;
    }

    if (nums[start] < nums[start + 1]) {
        return false;
    }

    return funcDec(nums, start + 1);
}`,
  },
  {
    number: 966,
    title: "Vowel Spellchecker",
    slug: "vowel-spellchecker",
    difficulty: "Medium",
    topics: ["Array", "Hash Table", "String"],
    language: "Java",
    solution: `public static String[] spellchecker(String[] wordlist, String[] queries) {
    String[] result_list = new String[queries.length];

    // Preprocess maps
    Map<String, String> lowerMap = new HashMap<>();
    Map<String, String> vowelMap = new HashMap<>();

    for (String word : wordlist) {
        String lower = word.toLowerCase();
        String vowelKey = devowel(lower);

        lowerMap.putIfAbsent(lower, word);      // first lowercase occurrence
        vowelMap.putIfAbsent(vowelKey, word);   // first vowel-error occurrence
    }

    // Process queries
    for (int p = 0; p < queries.length; p++) {
        String q = queries[p];

        // exact match
        for (String w : wordlist) {
            if (q.equals(w)) {
                result_list[p] = w;
                break;
            }
        }
        if (result_list[p] != null) continue;

        // case-insensitive
        String qLower = q.toLowerCase();
        if (lowerMap.containsKey(qLower)) {
            result_list[p] = lowerMap.get(qLower);
            continue;
        }

        // vowel-error
        String qVowel = devowel(qLower);
        if (vowelMap.containsKey(qVowel)) {
            result_list[p] = vowelMap.get(qVowel);
            continue;
        }

        // no match
        result_list[p] = "";
    }

    return result_list;
}

// replace vowels with *
private static String devowel(String word) {
    StringBuilder sb = new StringBuilder();
    for (char c : word.toCharArray()) {
        if (isVowel(c)) sb.append('*');
        else sb.append(c);
    }
    return sb.toString();
}

// your original vowel check
public static boolean isVowel(char let) {
    let = Character.toLowerCase(let);
    return let == 'a' || let == 'i' || let == 'e' || let == 'o' || let == 'u';
}`,
  },
  {
    number: 1022,
    title: "Sum of Root To Leaf Binary Numbers",
    slug: "sum-of-root-to-leaf-binary-numbers",
    difficulty: "Easy",
    topics: ["Tree", "Depth-First Search", "Binary Tree"],
    language: "Java",
    solution: `/*
UNDERSTAND: You're given a binary tree,
the concept is that you must attend to each root,
leaf combination as a standalone binary number. Then you must take
all binary numbers add them and return the sum they represent via summation.

Constrains:
Edge Cases: 

MATCH: Depth First Search, List Organization

PLAN: I plan to do a DFS of all the root, leaf combinations.

Each of these combinations will be stored in a vect. Traversing each
index we will pick apart a sublist, finding it's binary representation.
Simply adding up these representations and returning the result/total.

Time Complexity: O(N^2)
Space Complexity: O(N^2) This is because each

IMPLEMENT:
*/


@FunctionalInterface
interface BinaryOperations {
    int BinaryListToInteger(ArrayList<Integer> sublist);
}

private int sumRootToLeaf(TreeNode root) {

    int final_result = 0;

    // Intake list of binary digits, return integer representation. 
    BinaryOperations BinaryListToInteger = (ArrayList<Integer> sublist) -> {
        
        // Temporary Variables
        int temp_result = 0;
        int binPlace = 1;

        for (int digit : sublist.reversed()) {
            if (digit == 1) {
                temp_result += binPlace;
            }

            binPlace *= 2;
         }

         return temp_result;
    };

    // Objects
    List<ArrayList<Integer>> lsx = new ArrayList<>();
    helper(root, lsx, new ArrayList<>());
    
    // Get the decimal representation of ever binary list and sum them.
    for (ArrayList<Integer> sub : lsx) {
        final_result += BinaryListToInteger.BinaryListToInteger(sub);
    }

    return final_result;
}

private static void helper(TreeNode root, List<ArrayList<Integer>> lsx, List<Integer> sub) {
    if (root == null) {
        return;
    }

    sub.add(root.val);

    if (root.left == null && root.right == null) {
        lsx.add(new ArrayList<>(sub));
    } else {
        helper(root.left, lsx, sub);
        helper(root.right, lsx, sub);
    }

    sub.remove(sub.size() - 1);
}`,
  },
  {
    number: 1051,
    title: "Height Checker",
    slug: "height-checker",
    difficulty: "Easy",
    topics: ["Array", "Sorting", "Counting Sort"],
    language: "Java",
    solution: `public int heightChecker(int[] heights) {

    int count = 0;
    int[] comparable = java.util.Arrays.copyOf(heights, heights.length);
    myMergeSort(heights);

    for (int i = 0; i < comparable.length; i++) {
        if (comparable[i] != heights[i]) count++;
    }
    return count;
}

public int[] myMergeSort(int[] heights) {

    if (heights.length <= 1) return heights;

    int[] left = java.util.Arrays.copyOfRange(heights, 0, heights.length / 2);
    int[] right = java.util.Arrays.copyOfRange(heights, heights.length / 2, heights.length);

    myMergeSort(left);
    myMergeSort(right);

    merge(left, right, heights);

    return heights;
}

private void merge(int[] left, int[] right, int[] heights) {

    int id1 = 0, id2 = 0, id3 = 0;

    while (id1 < left.length && id2 < right.length) {
        if (left[id1] < right[id2]) {
            heights[id3++] = left[id1++];
        } else {
            heights[id3++] = right[id2++];
        }
    }

    while (id1 < left.length) {
        heights[id3++] = left[id1++];
    }

    while (id2 < right.length) {
        heights[id3++] = right[id2++];
    }
}`,
  },
  {
    number: 1290,
    title: "Convert Binary Number in a Linked List to Integer",
    slug: "convert-binary-number-in-a-linked-list-to-integer",
    difficulty: "Easy",
    topics: ["Linked List", "Math"],
    language: "Java",
    solution: `/*
* getDecimalValue returns using two functions named toBinaryOnlyOnesAndZeros and determineNodeLength!
* The problem that you face when dealing with ListNodes is that you cannot determine the length of the List until
* traverse through the entire object.
*
* We do that then determine the max place value, as in if the ListNode is three long, well then... that would be two to the power of three.
*
* Starting from the first number of the ListNode you can take the numerator, which in this case is eight and add it to the theoretical sum
* if nodes value is 1, if the value is zero then we don't add the numerator to the sum.
* Sum is theoretical because we have not yet uncovered the remaining values contained within our ListNode.
* With each pass through the ListNode we perform numerator / 2 because in binary the number is read from right to left, etc...
* */
public int getDecimalValue(ListNode head) {
    return toBinaryOnlyOnesAndZeros(head, (int) Math.pow(2, ((double) determineNodeLength(head)))) / 2;
}

public int toBinaryOnlyOnesAndZeros(ListNode head, int numerator) {
    if (head == null) return 0;
    if (head.val == 1) return numerator + toBinaryOnlyOnesAndZeros(head.next, numerator / 2);
    return toBinaryOnlyOnesAndZeros(head.next, numerator / 2);
}

public int determineNodeLength(ListNode head) {
    if (head == null) return 0;
    return 1 + determineNodeLength(head.next);
}`,
  },
  {
    number: 1464,
    title: "Maximum Product of Two Elements in an Array",
    slug: "maximum-product-of-two-elements-in-an-array",
    difficulty: "Easy",
    topics: ["Array", "Sorting", "Heap (Priority Queue)"],
    language: "Java",
    solution: `public int maxProduct(int[] nums) {

    int max1 = Integer.MIN_VALUE;
    int max2 = Integer.MIN_VALUE;

    int crit = 0;

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > max1) {
            max1 = nums[i];
            crit = i;
        }
    }

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > max2 && i != crit) {
            max2 = nums[i];
        }
    }

    return (max1 - 1) * (max2 - 1);
}`,
  },
  {
    number: 1518,
    title: "Water Bottles",
    slug: "water-bottles",
    difficulty: "Easy",
    topics: ["Math", "Simulation"],
    language: "Java",
    solution: `public static int numWaterBottles(int numBottles, int numExchange) {

    int variable = numBottles;
    double remainder = 0;
    int fullBottles = numBottles;

    while (variable >= numExchange) {
        int newBottles = variable / numExchange;
        remainder = variable % numExchange;
        fullBottles += newBottles;
        variable = newBottles + (int) remainder;
    }

    return fullBottles;
}`,
  },
  {
    number: 1672,
    title: "Richest Customer Wealth",
    slug: "richest-customer-wealth",
    difficulty: "Easy",
    topics: ["Array", "Matrix"],
    language: "Java",
    solution: `public int maximumWealth(int[][] accounts) {
    int wealthiest = 0;

    for (int i = 0; i < accounts.length; i++) {
        int val = accountTotal(accounts, i);
        if (val > wealthiest) {
            wealthiest = val;
        }
    }

    return wealthiest;
}

public int accountTotal(int[][] accounts, int i) {

    int total = 0;
    for (int j = 0; j < accounts[i].length; j++) {

        total += accounts[i][j];
    }

    return total;
}`,
  },
  {
    number: 1716,
    title: "Calculate Money in Leetcode Bank",
    slug: "calculate-money-in-leetcode-bank",
    difficulty: "Easy",
    topics: ["Math", "Greedy"],
    language: "Java",
    solution: `public int totalMoney(int n) {
    int days = 0;
    int money = 1;
    int sum = 0;
    int reset = 1;

    while (days < n) {

        money++;

        if (days % 7 == 0) {
            money = reset;
            reset++;
        }

        days++;
        sum += money;
    }

    return sum;
}`,
  },
  {
    number: 1816,
    title: "Truncate Sentence",
    slug: "truncate-sentence",
    difficulty: "Easy",
    topics: ["Array", "String"],
    language: "Java",
    solution: `public String truncateSentence(String s, int k) {
    StringBuilder sb = new StringBuilder();
    Scanner sc = new Scanner(s);

    for (int i = 0; i < k; i++) {
        sb.append(sc.next()).append(" ");
    }

    return sb.deleteCharAt(sb.length() - 1).toString();
}`,
  },
  {
    number: 2022,
    title: "Convert 1D Array Into 2D Array",
    slug: "convert-1d-array-into-2d-array",
    difficulty: "Easy",
    topics: ["Array", "Matrix", "Simulation"],
    language: "Java",
    solution: `public int[][] construct2DArray(int[] original, int m, int n) {
    if (m == 1 && n == 1)  return new int[][] {};
    if (m == 1) return new int[][] {original};

    int[][] result = new int[m][n];

    //fit array into main array
    for (int i = 0; i < n; i++) {
        result[i] = populate(original, new int[m], n);

        if (original.length >= n) {
            original = Arrays.copyOfRange(original, n, original.length);
        } else {
            original = Arrays.copyOfRange(original, 0, n);
        }
    }
    return result;
}

public int[] populate(int[] original, int[] temp, int n) {

    int count = 0;
    for (int x : original) {
        if (count == n) break;
        temp[count++] = x;
    }
    return temp;
}

public void debugVisual(int[][] newArray) {
    for (int[] x : newArray) {
        for (int j : x) {
            System.out.print(j + " ");
        }
        System.out.println();
    }
    System.out.println();
}`,
  },
  {
    number: 2095,
    title: "Delete the Middle Node of a Linked List",
    slug: "delete-the-middle-node-of-a-linked-list",
    difficulty: "Medium",
    topics: ["Linked List", "Two Pointers"],
    language: "Java",
    solution: `public ListNode deleteMiddle(ListNode head) {
    int midLen = findLen(head) / 2, currLen = 0;
    if (midLen == 1) return head.next;
    ListNode temp = head;
    ListNode temp2 = head.next;

    while (temp != null || temp2 != null) {
        temp = temp.next;
        temp2 = temp2.next;

        if (currLen == midLen) {
            temp = temp2;
            return head;
        }
        currLen++;
    }
    return head;
}

public int findLen(ListNode head) {
    if (head == null) return 0;
    return 1 + findLen(head.next);
}

public void printList(ListNode head) {
    StringBuilder sb = new StringBuilder();
    while (head != null) {
        sb.append(head.val + "-> ");
        head = head.next;
    }
    System.out.println(sb.toString());
}`,
  },
  {
    number: 2109,
    title: "Adding Spaces to a String",
    slug: "adding-spaces-to-a-string",
    difficulty: "Medium",
    topics: ["Array", "String", "Simulation"],
    language: "Java",
    solution: `public String addSpaces(String s, int[] spaces) {

    StringBuilder sb = new StringBuilder();

    for (int i = 0; i < s.length(); i++) {
        if (contains(i, spaces)) {
            sb.append(" ").append(s.charAt(i));
        } else {
            sb.append(s.charAt(i));
        }
    }
    return sb.toString();
}

public boolean contains(int i, int[] spaces) {

    if (spaces[0] != i && spaces.length - 1 == 0) {
        return false;
    }

    if (spaces[0] == i) {
        return true;
    } else {
        return contains(i, Arrays.copyOfRange(spaces, 1, spaces.length));
    }
}`,
  },
  {
    number: 2236,
    title: "Root Equals Sum of Children",
    slug: "root-equals-sum-of-children",
    difficulty: "Easy",
    topics: ["Tree", "Binary Tree"],
    language: "Java",
    solution: `public boolean checkTree(TreeNode root) {
    return (root.val == root.left.val + root.right.val);
}`,
  },
  {
    number: 2469,
    title: "Convert the Temperature",
    slug: "convert-the-temperature",
    difficulty: "Easy",
    topics: ["Math"],
    language: "Java",
    solution: `public double[] convertTemperature(double celsius) {
    return new double[] {celsius + 273.15, celsius * 1.80 + 32.00};
}`,
  },
  {
    number: 2544,
    title: "Alternating Digit Sum",
    slug: "alternating-digit-sum",
    difficulty: "Easy",
    topics: ["Math"],
    language: "Java",
    solution: `public int alternateDigitSum(int n) {

    ArrayList<Integer> list = new ArrayList<Integer>();
    list = breakInt(n);

    boolean signature = true;
    Integer digitSum = 0;


    for (Integer i : list) {

        if (signature) {
            digitSum += i;
            signature = false;
        } else {
            digitSum -= i;
            signature = true;
        }
    }

    return digitSum;
}

public ArrayList<Integer> breakInt(int n) {
    Deque<Integer> queue = new LinkedList<>();
    ArrayList<Integer> list = new ArrayList<>();

    while (n != 0) {
        queue.add(n % 10);
        n /= 10;
    }

    while (!queue.isEmpty()) {
        list.add(queue.removeLast());
    }

    return list;
}`,
  },
  {
    number: 2582,
    title: "Pass the Pillow",
    slug: "pass-the-pillow",
    difficulty: "Easy",
    topics: ["Math", "Simulation"],
    language: "Java",
    solution: `public int passThePillow(int n, int time) {
    return right(1, 0, n, time);
}

public int right(int pillow, int passes, int n, int time) {
    while (pillow < n) {
        if (passes == time) {
            break;
        }
        pillow++;
        passes++;
    }

    if (passes < time) {
        return left(n, passes, n, time);
    } else {
        return pillow;
    }
}

public int left(int pillow, int passes, int n, int time) {
    while (pillow > 1) {
        if (passes == time) {
            break;
        }

        pillow--;
        passes++;
    }

    if (passes < time) {
        return right(1, passes, n, time);
    } else {
        return pillow;
    }
}`,
  },
  {
    number: 2678,
    title: "Number of Senior Citizens",
    slug: "number-of-senior-citizens",
    difficulty: "Easy",
    topics: ["Array", "String"],
    language: "Java",
    solution: `public static int countSeniors(String[] details) {
    return func(details, 0);
}

public static int func(String[] details, int index) {
    if (index == details.length)
        return 0;

    if ((((details[index].charAt(11) - '0' ) * 10) + (details[index].charAt(12) - '0')) > 60) {
        return 1 + func(details, index + 1);
    } else {
        return func(details, index + 1);
    }
}`,
  },
  {
    number: 2706,
    title: "Buy Two Chocolates",
    slug: "buy-two-chocolates",
    difficulty: "Easy",
    topics: ["Array", "Sorting", "Greedy"],
    language: "Java",
    solution: `public int buyChoco(int[] prices, int money) {

    int max1 = Integer.MAX_VALUE;
    int max2 = Integer.MAX_VALUE;

    int crit = 0;

    for (int i = 0; i < prices.length; i++) {
        if (prices[i] < max1) {
            max1 = prices[i];
            crit = i;
        }
    }

    for (int i = 0; i < prices.length; i++) {
        if (prices[i] < max2 && i != crit) {
            max2 = prices[i];
        }
    }

    int diff = (money - (max1 + max2));
    if (diff >= 0) return diff;

return money;
}`,
  },
  {
    number: 2733,
    title: "Neither Minimum nor Maximum",
    slug: "neither-minimum-nor-maximum",
    difficulty: "Easy",
    topics: ["Array", "Sorting"],
    language: "Java",
    solution: `public int findNonMinOrMax(int[] nums) {
    int n = nums.length;
    if (n < 3) return -1; // need at least 3 distinct numbers

    int min = Integer.MAX_VALUE;
    int max = Integer.MIN_VALUE;

    // find global min and max
    for (int x : nums) {
        if (x < min) min = x;
        if (x > max) max = x;
    }

    // find any element that is neither min nor max
    for (int x : nums) {
        if (x != min && x != max) {
            return x;
        }
    }

    return -1;
}`,
  },
  {
    number: 3005,
    title: "Count Elements With Maximum Frequency",
    slug: "count-elements-with-maximum-frequency",
    difficulty: "Easy",
    topics: ["Array", "Hash Table", "Counting"],
    language: "Java",
    solution: `public static int maxFrequencyElements(int[] nums) {
    Arrays.sort(nums);
    int maxFreq = 0;
    int result = 0;
    int count = 0;

    for (int i = 0; i < nums.length - 1; i++) {

        if (nums.length % 2 == 0) {
            if (nums[i] == nums[i + 1]) {
                maxFreq += 2;
            } else if (nums[i] != nums[i + 1]) {
                maxFreq = 0;
            }
        }

        if (nums.length % 2 != 0) {
            if (nums[i] == nums[i + 1] && nums[i] != nums[i - 1]) {
                maxFreq += 2;
            } else if (nums[i] != nums[i + 1]) {
                maxFreq = 0;
            }
        }

        if (nums.length % 2 != 0) {
            if (nums[i] > 0 && nums[i] == nums[i + 1] && nums[i] == nums[i - 1]) {
                maxFreq -= 1;
            }
        }
        result += maxFreq;
    }

    if (result == 0) {
        return nums.length;
    }
    return result;
}`,
  },
  {
    number: 3024,
    title: "Type of Triangle",
    slug: "type-of-triangle",
    difficulty: "Easy",
    topics: ["Array", "Math", "Sorting"],
    language: "Java",
    solution: `/*Tests for some trangle properties:
The sum of two sides are greater than one side. (this is represented by the String return "none".)
If no two sides are the same then the triangle is scalene.
If all sides are the same the triangle is equilateral.
*/
public String triangleType(int[] nums) {

    if (nums[0] + nums[1] > nums[2] && nums[1] + nums[2] > nums[0] && nums[2] + nums[0] > nums[1]) {
        if (nums[0] != nums[2] && nums[0] != nums[1] && nums[1] != nums[2]) {
            return "scalene";
        }
    } else {
        return "none";
    }

    nums = triLogic(nums);

    if (nums.length == 0) {
        return "equilateral";
    }

    return "isosceles";
}

public int[] triLogic(int[] nums) {
    if (nums[0] == nums[1] && nums.length == 3) {
        return triLogic(new int[]{nums[1], nums[2]});
    } else if (nums[0] == nums[1] && nums.length == 2) {
        return new int[]{};
    } else {
        return nums;
    }
}`,
  },
  {
    number: 3174,
    title: "Clear Digits",
    slug: "clear-digits",
    difficulty: "Easy",
    topics: ["String", "Stack", "Simulation"],
    language: "Java",
    solution: `public String clearDigits(String s) {

    int len = s.length();

    for (int i = 0; i < len; i++) {
        if (isNumber(s.charAt(i))) {
            StringBuilder adjust = new StringBuilder(s);
            adjust.deleteCharAt(i).deleteCharAt(i - 1);
            return clearDigits(adjust.toString());
        }
    }
    return s;
}

public boolean isNumber(char ch) {
    try {
        Integer.parseInt(ch + "");
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
}`,
  },
];

const UNSORTED = "Uncategorized";

const buildChapters = () => {
  const groups = new Map();
  LeetCodeProblems.forEach((problem) => {
    const topics = problem.topics && problem.topics.length ? problem.topics : [UNSORTED];
    topics.forEach((topic) => {
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push(problem);
    });
  });
  return [...groups.entries()]
    .map(([topic, problems]) => ({
      topic,
      problems: [...problems].sort((a, b) => a.number - b.number),
    }))
    .sort((a, b) => {
      if (a.topic === UNSORTED) return 1;
      if (b.topic === UNSORTED) return -1;
      return a.topic.localeCompare(b.topic, "en", { sensitivity: "base" });
    });
};

const LeetCodeDex = () => {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showCode, setShowCode] = useState(null);

  const chapters = useMemo(buildChapters, []);
  const chapter = chapters[pageIndex];

  const turnTo = (index) => {
    if (index < 0 || index >= chapters.length || index === pageIndex) return;
    setDirection(index > pageIndex ? 1 : -1);
    setPageIndex(index);
  };

  const flip = reduceMotion ? 0 : 1;

  return (
    <section
      className="ae-render-queue ae-leetcode"
      id="leetcode-panel"
      role="tabpanel"
      aria-labelledby="leetcode-tab"
    >
      <div className="ae-render-queue-heading">
        <div>
          <p className="home-card-label">LeetCode</p>
          <h1>Competition-dex</h1>
        </div>
        <span>{LeetCodeProblems.length} logged</span>
      </div>

      <p className="ae-leetcode-description">
        This is an attempt to log my problems, to brush up on completed problems, and to share new solutions.
      </p>

      <div className="ae-book-stage">
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            <motion.button
              key="cover"
              type="button"
              className="ae-book-cover"
              onClick={() => setIsOpen(true)}
              aria-label="Open the competition-dex"
              initial={{ opacity: 0, rotateY: flip * 35 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: flip * -35 }}
              transition={{ duration: 0.22 }}
              style={{ transformOrigin: "left center" }}
            >
              <span className="ae-book-cover-label">Dex</span>
              <strong>Competition-dex</strong>
              <span className="ae-book-cover-count">
                {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"} · {LeetCodeProblems.length}{" "}
                {LeetCodeProblems.length === 1 ? "problem" : "problems"}
              </span>
              <span className="ae-book-cover-open">Open the book ↗</span>
            </motion.button>
          ) : (
            <motion.div
              key="spread"
              className="ae-book"
              initial={{ opacity: 0, rotateY: flip * -35 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: flip * 35 }}
              transition={{ duration: 0.22 }}
              style={{ transformOrigin: "left center" }}
            >
              <div className="ae-book-page ae-book-page--left">
                <p className="ae-book-page-label">Contents</p>
                {chapters.length === 0 ? (
                  <p className="ae-leetcode-empty">No problems logged yet.</p>
                ) : (
                  <ol className="ae-book-contents">
                    {chapters.map((item, index) => (
                      <li key={item.topic}>
                        <button
                          type="button"
                          className={`ae-book-contents-item${index === pageIndex ? " is-active" : ""}`}
                          aria-current={index === pageIndex ? "page" : undefined}
                          onClick={() => turnTo(index)}
                        >
                          <span>{item.topic}</span>
                          <span className="ae-book-contents-count">{item.problems.length}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
                <button type="button" className="ae-book-close" onClick={() => setIsOpen(false)}>
                  Close the book
                </button>
              </div>

              <div className="ae-book-page ae-book-page--right">
                {chapter ? (
                  <>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={chapter.topic}
                        className="ae-book-chapter"
                        initial={{ opacity: 0, rotateY: flip * direction * -30 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: flip * direction * 30 }}
                        transition={{ duration: 0.18 }}
                        style={{ transformOrigin: "left center" }}
                      >
                        <p className="ae-book-page-label">Chapter {pageIndex + 1}</p>
                        <h2 className="ae-book-chapter-title">{chapter.topic}</h2>
                        <div className="ae-book-entries">
                          {chapter.problems.map((problem) => (
                            <div key={problem.number} className="ae-book-entry">
                              <div className="ae-book-entry-row">
                                <span className="ae-leetcode-number">#{problem.number}</span>
                                <span className="ae-book-entry-title">
                                  <strong>{problem.title}</strong>
                                  {problem.language && <span className="ae-leetcode-lang">{problem.language}</span>}
                                </span>
                                <span
                                  className={`ae-leetcode-badge ae-leetcode-badge--${(problem.difficulty || "").toLowerCase()}`}
                                >
                                  {problem.difficulty}
                                </span>
                                <span className="ae-leetcode-actions">
                                  {problem.slug && (
                                    <a
                                      className="ae-button ae-button--small"
                                      href={`https://leetcode.com/problems/${problem.slug}/`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Problem <span aria-hidden="true">↗</span>
                                    </a>
                                  )}
                                  {problem.solution && (
                                    <button
                                      type="button"
                                      className="ae-button ae-button--small"
                                      onClick={() =>
                                        setShowCode(showCode === problem.number ? null : problem.number)
                                      }
                                    >
                                      {showCode === problem.number ? "Hide" : "Code"}
                                    </button>
                                  )}
                                </span>
                              </div>
                              {showCode === problem.number && problem.solution && (
                                <pre className="ae-leetcode-code"><code><Highlight code={problem.solution} /></code></pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="ae-book-turn" aria-live="polite">
                      <button
                        type="button"
                        className="ae-button ae-button--small"
                        onClick={() => turnTo(pageIndex - 1)}
                        disabled={pageIndex === 0}
                      >
                        ← Previous
                      </button>
                      <span>
                        {pageIndex + 1} of {chapters.length}
                      </span>
                      <button
                        type="button"
                        className="ae-button ae-button--small"
                        onClick={() => turnTo(pageIndex + 1)}
                        disabled={pageIndex === chapters.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="ae-leetcode-empty">The pages are blank for now.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LeetCodeDex;
