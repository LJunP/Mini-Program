// interview-algorithms.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）

const questions = [
  {
    "id": "interview_algorithms_046_lru_cache",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "algorithms",
    "title": "LRU 缓存设计",
    "difficulty": 4,
    "frequency": 5,
    "question": "设计并实现一个 O(1) 时间复杂度的 LRU（最近最少使用）缓存机制。",
    "answer": {
      "short": "HashMap + 双向链表：HashMap O(1) 查找，双向链表 O(1) 移动节点到头部。淘汰时删除尾部节点。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【LRU 缓存设计】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 数据结构：HashMap 存 key→Node 映射，双向链表维护访问顺序。\n2. get：查 HashMap，命中则移到链表头部。\n3. put：存在则更新+移到头部；不存在则新建节点插头部，超容量则删尾部。\n4. 哨兵节点简化边界处理。",
      "deepDive": "双向链表的原因：需要 O(1) 删除任意节点（需要前后指针）。单链表删除需要前驱指针，O(n)。LRU 在操作系统页面置换、Redis 淘汰策略、浏览器缓存中都有应用。Java 的 LinkedHashMap 天然支持 LRU（accessOrder=true）。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【LRU 缓存设计】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "HashMap + 双向链表",
        "get/put 均 O(1)",
        "访问后移到链表头部",
        "淘汰链表尾部",
        "哨兵节点简化边界"
      ]
    },
    "keyPoints": [
      "LRU",
      "双向链表",
      "HashMap",
      "O(1)",
      "页面置换"
    ],
    "traps": [
      "面试官追问：为什么用双向链表而非单向？答：O(1) 删除任意节点。",
      "LinkedHashMap 如何实现 LRU？accessOrder=true。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_algorithms_048_quick_sort",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "algorithms",
    "title": "快速排序原理与实现",
    "difficulty": 3,
    "frequency": 5,
    "question": "请手写快速排序，并分析其时间复杂度和优化策略。",
    "answer": {
      "short": "分治：选 pivot 将数组分为小于和大于两部分，递归排序。平均 O(n log n)，最坏 O(n²)。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【快速排序原理与实现】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 选 pivot：随机化、三数取中、五数取中。\n2. Partition：Lomuto 法（单指针）或 Hoare 法（双指针）。\n3. 递归：对左右子数组递归。\n4. 优化：小数组改用插入排序、尾递归优化。",
      "deepDive": "随机化 pivot 可保证期望 O(n log n)。Hoare 分区比 Lomuto 更高效（交换次数少）。三路快排（Dutch National Flag）处理大量重复元素更优。C++ STL 的 sort 用内省排序：快排+堆排+插入排的混合。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【快速排序原理与实现】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "分治：选 pivot 分区递归",
        "Lomuto 单指针 / Hoare 双指针",
        "随机 pivot 保证期望 O(nlogn)",
        "三路快排处理重复元素",
        "小数组用插入排序"
      ]
    },
    "keyPoints": [
      "快速排序",
      "Partition",
      "Lomuto",
      "Hoare",
      "三路快排"
    ],
    "traps": [
      "面试官追问：最坏情况怎么避免？答：随机 pivot 或内省排序。",
      "三路快排适合什么场景？答：大量重复元素。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_algorithms_008_lca_binary_tree",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "algorithms",
    "title": "二叉树的最近公共祖先",
    "difficulty": 3,
    "frequency": 4,
    "question": "给定二叉树和两个节点 p、q，找到 p 和 q 的最近公共祖先（LCA）。",
    "answer": {
      "short": "递归：在左子树和右子树分别找 p 和 q。如果左右各找到一个，当前节点就是 LCA；如果只在一边找到，结果在那一侧。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【二叉树的最近公共祖先】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 终止条件：当前节点为 null 或等于 p 或 q，直接返回当前节点。\n2. 递归：left = lca(root.left), right = lca(root.right)。\n3. 判断：left 和 right 都非空 → root 是 LCA；只有 left → 答案在左；只有 right → 答案在右。",
      "deepDive": "LCA 是二叉树经典题。如果树是 BST，可以更高效：利用 BST 性质，比较节点值与 p/q 的值决定方向，O(h) 时间。如果是普通树，可以先用 DFS 记录 p 和 q 的路径，再找路径最后一个公共节点。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【二叉树的最近公共祖先】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "递归在左右子树分别查找",
        "左右都非空则当前节点为 LCA",
        "BST 可利用值大小加速",
        "时间 O(n) 空间 O(n)"
      ]
    },
    "keyPoints": [
      "最近公共祖先 LCA",
      "递归回溯",
      "二叉搜索树优化",
      "路径法"
    ],
    "traps": [
      "面试官追问：如果是 BST 怎么优化？答：利用 BST 性质 O(h) 完成。",
      "p 或 q 不在树中时的处理需和面试官确认。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_algorithms_010_merge_k_sorted_lists",
    "mode": "study",
    "domain": "interview",
    "type": "system_design",
    "track": "backend",
    "topic": "algorithms",
    "title": "合并 K 个有序链表",
    "difficulty": 3,
    "frequency": 4,
    "question": "给定 K 个有序链表，将它们合并为一个有序链表。分析不同方案的时间复杂度。",
    "answer": {
      "short": "最小堆方案：将 K 个链表头节点入堆，每次弹出最小节点接到结果链表，再将其 next 入堆。O(N log K)。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【合并 K 个有序链表】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 朴素法：两两合并 O(K*N)。\n2. 最小堆：K 个头入堆，弹出最小接上，next 入堆，O(N log K)。\n3. 分治法：两两配对合并 O(N log K)，空间 O(log K)。",
      "deepDive": "最小堆方案的优势在于不需要额外数组，适合流式数据。分治法的优势是空间 O(log K) 且可以利用递归的并行性。如果 K 很大且数据在分布式环境，可以用 MapReduce 模式：先分桶再合并。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【合并 K 个有序链表】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "最小堆 O(N log K) 时间",
        "分治两两合并 O(N log K) 空间 O(log K)",
        "堆中维护 K 个链表当前最小节点",
        "弹出后入堆其 next"
      ]
    },
    "keyPoints": [
      "最小堆",
      "分治合并",
      "K 路归并",
      "时间复杂度分析"
    ],
    "traps": [
      "面试官追问：K 路归并在外部排序中怎么应用？",
      "堆中元素过多时的性能考虑，可以用败者树优化。"
    ],
    "relatedIds": []
  },
  {
    "id": "interview_algorithms_011_lis",
    "mode": "study",
    "domain": "interview",
    "type": "baguwen",
    "track": "backend",
    "topic": "algorithms",
    "title": "最长递增子序列",
    "difficulty": 3,
    "frequency": 4,
    "question": "给定一个无序整数数组，找到其中最长严格递增子序列的长度。要求 O(n log n) 解法。",
    "answer": {
      "short": "贪心+二分：维护一个 tails 数组，对每个元素用二分查找替换 tails 中的位置，最终 tails 长度即为答案。",
      "thinkingProcess": "大厂高级技术官考查此题的底层意图在于验证候选人对【最长递增子序列】的真实物理实践经验和系统设计眼界，看其能否理清底层原理与工程妥协，而不是单纯死记硬背八股文。\n\n1. 朴素 DP：dp[i] = 以 nums[i] 结尾的 LIS 长度，O(n²)。\n2. 贪心+二分：维护 tails 数组，tails[i] 表示长度为 i+1 的 LIS 的最小末尾元素。\n3. 对每个 nums[i] 在 tails 中二分查找替换位置，O(n log n)。",
      "deepDive": "tails 数组不一定是真实的 LIS，但其长度正确。如需还原路径，需额外维护前驱数组。此思想在俄罗斯套娃信封问题、摆动序列等题中也有应用。在工程上，LIS 可用于最长时间序列趋势分析。\n\n【工程折中与最佳实践】：在实际大厂大流量生产场景中，针对【最长递增子序列】的落地必须遵循边界守卫与监控对齐原则。技术选型需要在性能、研发维护成本、网络延迟及高可用架构之间做出最合理的折中，同时必须在后台部署哨兵机制以防偶发的脏数据雪崩。",
      "structured": [
        "DP O(n²)：dp[i]=max(dp[j])+1 for j<i",
        "贪心+二分 O(n logn)：维护 tails 数组",
        "tails[i]=长度 i+1 的 LIS 最小末尾",
        "二分查找替换位置"
      ]
    },
    "keyPoints": [
      "动态规划",
      "贪心+二分",
      "tails 数组",
      "O(n log n)"
    ],
    "traps": [
      "面试官追问：如何还原具体的 LIS 路径？答：额外维护 predecessor 数组。",
      "tails 数组不是真实 LIS，只保证长度正确。"
    ],
    "relatedIds": []
  }
];

module.exports = questions;
