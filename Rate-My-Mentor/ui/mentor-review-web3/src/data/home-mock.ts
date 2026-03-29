/** 首页展示用模拟数据（后续替换为索引服务 / 合约读） */

export type MockMentorRank = {
  rank: number;
  id: string;
  name: string;
  title: string;
  domain: string;
  rating: number;
  reviewCount: number;
  trendPct: number;
};

export type MockCompanyRank = {
  rank: number;
  id: string;
  name: string;
  industry: string;
  mentorLinked: number;
  score: number;
  region: string;
};

export const MOCK_TOP_MENTORS: MockMentorRank[] = [
  {
    rank: 1,
    id: "m-demo-01",
    name: "Alex Chen",
    title: "Solidity · DeFi 架构",
    domain: "智能合约 / 安全审计",
    rating: 4.95,
    reviewCount: 428,
    trendPct: 12,
  },
  {
    rank: 2,
    id: "m-demo-02",
    name: "Jordan Wu",
    title: "全栈 · 链上产品",
    domain: "dApp / 钱包集成",
    rating: 4.91,
    reviewCount: 356,
    trendPct: 8,
  },
  {
    rank: 3,
    id: "m-demo-03",
    name: "Samira Okonkwo",
    title: "密码学 · L2",
    domain: "Rollup / 零知识入门",
    rating: 4.88,
    reviewCount: 290,
    trendPct: 5,
  },
  {
    rank: 4,
    id: "m-demo-04",
    name: "Li Wei",
    title: "Move · 基础设施",
    domain: "节点 / 索引器",
    rating: 4.85,
    reviewCount: 241,
    trendPct: 3,
  },
  {
    rank: 5,
    id: "m-demo-05",
    name: "Noah Park",
    title: "前端 · Web3 UX",
    domain: "RainbowKit / wagmi",
    rating: 4.82,
    reviewCount: 198,
    trendPct: 6,
  },
  {
    rank: 6,
    id: "m-demo-06",
    name: "Elena Rossi",
    title: "代币经济 · 治理",
    domain: "DAO / 激励设计",
    rating: 4.79,
    reviewCount: 176,
    trendPct: 2,
  },
  {
    rank: 7,
    id: "m-demo-07",
    name: "Marcus Bell",
    title: "安全 · 渗透",
    domain: "审计前置 / 漏洞赏金",
    rating: 4.76,
    reviewCount: 154,
    trendPct: 4,
  },
  {
    rank: 8,
    id: "m-demo-08",
    name: "Yuki Tanaka",
    title: "NFT · 游戏化",
    domain: "动态 NFT / 元数据",
    rating: 4.73,
    reviewCount: 132,
    trendPct: 1,
  },
  {
    rank: 9,
    id: "m-demo-09",
    name: "Priya Nair",
    title: "合规 · 法币出入金",
    domain: "支付 / 监管科技",
    rating: 4.7,
    reviewCount: 119,
    trendPct: 0,
  },
  {
    rank: 10,
    id: "m-demo-10",
    name: "Chris Ortiz",
    title: "数据 · 链上分析",
    domain: "Dune / 子图",
    rating: 4.68,
    reviewCount: 105,
    trendPct: -1,
  },
];

export const MOCK_TOP_COMPANIES: MockCompanyRank[] = [
  {
    rank: 1,
    id: "c-demo-01",
    name: "NovaChain Labs",
    industry: "基础设施",
    mentorLinked: 42,
    score: 96.4,
    region: "新加坡",
  },
  {
    rank: 2,
    id: "c-demo-02",
    name: "Aurora Guild",
    industry: "开发者教育",
    mentorLinked: 38,
    score: 94.8,
    region: "远程",
  },
  {
    rank: 3,
    id: "c-demo-03",
    name: "LedgerForge",
    industry: "安全审计",
    mentorLinked: 31,
    score: 93.1,
    region: "香港",
  },
  {
    rank: 4,
    id: "c-demo-04",
    name: "Citadel DAO Tools",
    industry: "DAO 工具",
    mentorLinked: 27,
    score: 91.5,
    region: "北美",
  },
  {
    rank: 5,
    id: "c-demo-05",
    name: "Zenith Pay",
    industry: "支付 / RWA",
    mentorLinked: 24,
    score: 90.2,
    region: "欧盟",
  },
  {
    rank: 6,
    id: "c-demo-06",
    name: "PixelRealm Studio",
    industry: "链游",
    mentorLinked: 22,
    score: 88.9,
    region: "首尔",
  },
  {
    rank: 7,
    id: "c-demo-07",
    name: "Harbor Index",
    industry: "索引 / 数据",
    mentorLinked: 19,
    score: 87.4,
    region: "上海",
  },
  {
    rank: 8,
    id: "c-demo-08",
    name: "OpenCampus",
    industry: "教育凭证",
    mentorLinked: 17,
    score: 86.0,
    region: "远程",
  },
  {
    rank: 9,
    id: "c-demo-09",
    name: "GreenLedger",
    industry: "ReFi",
    mentorLinked: 15,
    score: 84.6,
    region: "柏林",
  },
  {
    rank: 10,
    id: "c-demo-10",
    name: "Mesh Identity",
    industry: "DID / 隐私",
    mentorLinked: 14,
    score: 83.2,
    region: "东京",
  },
];
