
```markdown
# Coding Challenge - Maximum Subarray Sum

## Problem Statement

Given an array of integers, find the contiguous subarray (containing at least one number) that has the largest sum and return the maximum sum.

Write a function `maxSubArray` to solve this problem.

### Example

```javascript
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
```

**Output:**
```
6
```

**Explanation:**
The contiguous subarray `[4, -1, 2, 1]` has the largest sum of 6.

### Constraints

- The input array can contain both positive and negative integers.
- The array can be empty or have at least one element.

## Explanation

This problem can be solved using the Kadane's algorithm, which is an efficient way to find the maximum subarray sum.

The idea is to keep track of the maximum sum ending at each position. We start with a variable to track the maximum sum (`maxSum`) and another variable to track the maximum sum ending at the current position (`currentSum`).

We iterate through the array and at each position, we have two choices:

1. Extend the current subarray by including the current element.
2. Start a new subarray from the current element.

We choose the option that gives us the maximum sum. To do this, we compare `currentSum + nums[i]` with `nums[i]` and update `currentSum` accordingly. We also update `maxSum` to keep track of the maximum sum encountered so far.

Finally, `maxSum` will contain the maximum subarray sum, which is the solution to the problem.

## Sample Input and Output

### Input

```javascript
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
```

### Output

```
6
```

### Input

```javascript
maxSubArray([1]);
```

### Output

```
1
```

### Input

```javascript
maxSubArray([-1]);
```

### Output

```
-1
```

### Input

```javascript
maxSubArray([]);
```

### Output

```
0
```

## Boundary Constraints

- The input array can contain up to 10^5 elements.
- The values of the elements can be in the range of -10^4 to 10^4.
```

You can save the above Markdown content to a `.md` file, and it provides a clear and complete coding challenge with problem statement, explanation, sample input, output, and boundary constraints.