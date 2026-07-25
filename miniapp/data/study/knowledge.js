// knowledge.js
// 提审精简版（原完整版已备份至 cdn_backup，上线后由云数据库动态下发）

const items = [
  {
    "id": "knowledge_001",
    "mode": "study",
    "domain": "knowledge",
    "title": "Transformer 变革：八位作者的《Attention Is All You Need》黑科技始末",
    "category": "tech_history",
    "difficulty": 2,
    "duration": 15,
    "tags": [
      "Transformer",
      "大语言模型",
      "AI发展史"
    ],
    "summary": "从 RNN 的串行瓶颈到自注意力机制的并行神话，拆解 Transformer 的核心数学机制、现实多模态落地以及如何入门大模型实战。",
    "keyPoints": [
      "Transformer 机制",
      "Self-Attention",
      "学习路径",
      "大模型基座"
    ],
    "sections": [
      {
        "type": "heading",
        "text": "一、历史起源与痛点"
      },
      {
        "type": "paragraph",
        "text": "在 2017 年之前，自然语言处理（NLP）主要依赖循环神经网络（RNN/LSTM）。RNN 的核心物理缺陷是它的“串行依赖”：计算当前单词时，必须等待前一个单词计算完毕。这使得它完全无法利用 GPU 的并行计算能力，且在处理超长文本时容易丢失远距离的上下文关联信息。2017年6月，8位谷歌研究员发表了划时代论文《Attention Is All You Need》，用注意力机制彻底终结了这一瓶颈。"
      },
      {
        "type": "heading",
        "text": "二、它是什么与核心能力"
      },
      {
        "type": "paragraph",
        "text": "Transformer 是一种基于“自注意力（Self-Attention）”机制的通用神经网络架构。它能做任何序列到序列（Seq2Seq）的转换，包括机器翻译、文本生成、代码编写甚至图像和视频理解。其核心能力是打破了文本序列的物理距离限制，一次性把整句话输入 GPU，并以极高精度关联任意两个单词的语义。"
      },
      {
        "type": "heading",
        "text": "三、底层架构与运转机制"
      },
      {
        "type": "paragraph",
        "text": "Transformer 由 Encoder（编码器）和 Decoder（解码器）组成。其核心数学公式是缩放点积注意力：Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V。通过计算 Query、Key 和 Value 的点积并除以缩放因子，计算出每个词对其他所有词的注意力权重。此外，它通过“位置编码（Positional Encoding）”为无序的并行输入注入绝对位置信息，通过“多头注意力（Multi-Head Attention）”在多个不同的子空间中捕捉多维度语义。"
      },
      {
        "type": "heading",
        "text": "四、商业落地与现实应用"
      },
      {
        "type": "paragraph",
        "text": "目前 Transformer 已成为整个 AI 时代的“物理底座”。包括 OpenAI 的 GPT 系列（如 ChatGPT、GPT-4）、谷歌的 Gemini、百度的文心一言等大语言模型均基于该架构。此外，它还跨界进入计算机视觉领域（Vision Transformer, ViT），在图像识别、多模态图文生成中大放异彩。"
      },
      {
        "type": "heading",
        "text": "五、推荐学习路径与权威资源"
      },
      {
        "type": "list",
        "items": [
          "阅读经典论文：精读 2017 论文《Attention Is All You Need》（必读）。",
          "手写极简代码：阅读哈佛大学开源的《The Annotated Transformer》，用 PyTorch 从头实现一个完整的编码器与解码器。",
          "掌握前沿框架：学习 Hugging Face 官方的《Hugging Face Course》教程，实操如何用 Transformers 库加载、微调大模型。"
        ]
      }
    ]
  },
  {
    "id": "knowledge_002",
    "mode": "study",
    "domain": "knowledge",
    "title": "Linux & Git 之父：Linus Torvalds 的黑客人生与工程品味",
    "category": "person",
    "difficulty": 2,
    "duration": 12,
    "tags": [
      "Linus",
      "Linux",
      "开源文化"
    ],
    "summary": "深度解读 Linus 独特的“二级指针”工程品味，剖析 Linux 与 Git 的 15 天开发传奇，并指引黑客成长与内核贡献路径。",
    "keyPoints": [
      "Linus Torvalds",
      "工程品味",
      "Linux 内核",
      "Git 历史"
    ],
    "sections": [
      {
        "type": "heading",
        "text": "一、历史起源与痛点"
      },
      {
        "type": "paragraph",
        "text": "1991年，物理上 UNIX 昂贵且闭源，普通人无法看源码。Linus 买了电脑后出于“好玩”写了微型内核 Linux 并开源。2005年，因为 BitKeeper 停止免费授权，激怒了 Linus，他花 15 天写出分布式版本控制系统 Git，颠覆了整个分支合并与协作流程。"
      },
      {
        "type": "heading",
        "text": "二、它是什么与核心能力"
      },
      {
        "type": "paragraph",
        "text": "Linux 作为一个开源操作系统的内核，具备强大的跨平台移植性、极致的进程调度与网络性能；Git 则是分布式版本控制系统，彻底解决了大型项目多人开发时的分支合并速度与安全防篡改难题。"
      },
      {
        "type": "heading",
        "text": "三、底层架构与运转机制"
      },
      {
        "type": "paragraph",
        "text": "Linus 强调的“工程品味”（Code Taste）精髓在于消除特例判断。以单向链表删除节点为例，普通人会写出 if 判断头节点；而具有好品味的写法是使用二级指针 `void remove(Node **head, Node *target)`，直接操作地址，从而用一行代码兼容所有特例。"
      },
      {
        "type": "heading",
        "text": "四、商业落地与现实应用"
      },
      {
        "type": "paragraph",
        "text": "如今，Linux 运行在全球 99% 的服务器、超级计算机、所有的 Android 手机以及各大科技巨头的云计算底座中。Git 也演变成为了全球事实上的代码协同标准。"
      },
      {
        "type": "heading",
        "text": "五、推荐学习路径与权威资源"
      },
      {
        "type": "list",
        "items": [
          "阅读自传名作：阅读 Linus 亲笔自传《Just for Fun》（乐在其中）。",
          "学习内核源码：阅读《Linux 内核设计与实现》（Robert Love 著），并编译一次 Linux 内核。",
          "参与开源贡献：访问 kernel.org，阅读内核贡献指南，学习提交 patch 邮件列表。"
        ]
      }
    ]
  },
  {
    "id": "knowledge_003",
    "mode": "study",
    "domain": "knowledge",
    "title": "关系型数据库奠基人：埃德加·科德的数学叛逆与关系代数胜利",
    "category": "person",
    "difficulty": 2,
    "duration": 12,
    "tags": [
      "数据库历史",
      "埃德加·科德",
      "关系代数"
    ],
    "summary": "揭秘科德如何打破层级和网状数据库物理锁定限制，通过严谨的关系代数和 SQL 定义关系模型，并给出关系型数据库进阶路线图。",
    "keyPoints": [
      "埃德加·科德",
      "关系代数",
      "SQL原理",
      "存储设计"
    ],
    "sections": [
      {
        "type": "heading",
        "text": "一、历史起源与痛点"
      },
      {
        "type": "paragraph",
        "text": "1960年代，数据库被层次和网状模型统治。查询数据必须知道物理指针，一旦存储结构变动，所有业务代码都必须推倒重写。埃德加·科德对此发起挑战，提出了纯数学集合论作为数据表示底座的理论。"
      },
      {
        "type": "heading",
        "text": "二、它是什么与核心能力"
      },
      {
        "type": "paragraph",
        "text": "科德提出的关系模型把数据抽象为二维表，通过元组和属性表达映射。其核心能力是实现“物理存储与逻辑查询的彻底解耦”，用户只需声明“我想查询什么数据”，而无需关心“数据在磁盘上是怎么存储的”。"
      },
      {
        "type": "heading",
        "text": "三、底层架构与运转机制"
      },
      {
        "type": "paragraph",
        "text": "关系型数据库基于科德的关系代数：包括选择、投影、连接等集合运算符。基于此，IBM 开发组发明了 SQL 语言（结构化查询语言），将这套关系代数公式转化为了命令，并在数据库内核中通过查询优化器自动计算路径。"
      },
      {
        "type": "heading",
        "text": "四、商业落地与现实应用"
      },
      {
        "type": "paragraph",
        "text": "关系数据库是当今银行业、金融系统、核心订单结算系统的根基。Oracle、MySQL、PostgreSQL 均完全基于科德的关系数据理论。"
      },
      {
        "type": "heading",
        "text": "五、推荐学习路径与权威资源"
      },
      {
        "type": "list",
        "items": [
          "阅读圣经教材：学习《数据库系统概念》（黑皮书），打牢关系代数和范式理论基础。",
          "阅读经典论文：阅读 Codd 1970 年发表的论文《A Relational Model of Data for Large Shared Data Banks》。",
          "深入内核实践：下载开源 PostgreSQL 源码，重点学习查询优化器和并发控制的实现。"
        ]
      }
    ]
  }
];

module.exports = items;
