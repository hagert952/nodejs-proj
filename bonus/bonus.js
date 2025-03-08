var canJump = function(nums) {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
      if (i > maxReach) return false; // If current index is beyond the max reachable index, return false
      maxReach = Math.max(maxReach, i + nums[i]); // Update the farthest reach
      if (maxReach >= nums.length - 1) return true; // If we can reach or exceed the last index, return true
  }
  
  return false;
};
