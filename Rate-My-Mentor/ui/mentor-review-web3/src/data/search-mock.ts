export type SearchMentorResult = {
  id: string;
  name: string;
  title: string;
  domain: string;
  rating: number;
  reviewCount: number;
};

export type SearchCompanyResult = {
  id: string;
  name: string;
  industry: string;
  region: string;
  score: number;
  mentorCount: number;
};

export const MOCK_SEARCH_MENTORS: SearchMentorResult[] = [
  { id: "m-demo-01", name: "Alex Chen", title: "Solidity · DeFi 架构", domain: "智能合约 / 安全审计", rating: 4.95, reviewCount: 428 },
  { id: "m-demo-02", name: "Jordan Wu", title: "全栈 · 链上产品", domain: "dApp / 钱包集成", rating: 4.91, reviewCount: 356 },
  { id: "m-demo-03", name: "Samira Okonkwo", title: "密码学 · L2", domain: "Rollup / 零知识入门", rating: 4.88, reviewCount: 290 },
  { id: "m-demo-04", name: "Li Wei", title: "Move · 基础设施", domain: "节点 / 索引器", rating: 4.85, reviewCount: 241 },
  { id: "m-demo-05", name: "Noah Park", title: "前端 · Web3 UX", domain: "RainbowKit / wagmi", rating: 4.82, reviewCount: 198 },
  { id: "m-demo-06", name: "Elena Rossi", title: "代币经济 · 治理", domain: "DAO / 激励设计", rating: 4.79, reviewCount: 176 },
  { id: "m-demo-07", name: "Marcus Bell", title: "安全 · 渗透", domain: "审计前置 / 漏洞赏金", rating: 4.76, reviewCount: 154 },
  { id: "m-demo-08", name: "Yuki Tanaka", title: "NFT · 游戏化", domain: "动态 NFT / 元数据", rating: 4.73, reviewCount: 132 },
  { id: "m-demo-09", name: "Priya Nair", title: "合规 · 法币出入金", domain: "支付 / 监管科技", rating: 4.7, reviewCount: 119 },
  { id: "m-demo-10", name: "Chris Ortiz", title: "数据 · 链上分析", domain: "Dune / 子图", rating: 4.68, reviewCount: 105 },
  { id: "m-eth-01", name: "Vitalik Dev", title: "以太坊核心开发", domain: "EVM / 共识机制", rating: 4.98, reviewCount: 892 },
  { id: "m-defi-02", name: "DeFi Master", title: "DeFi 协议设计", domain: "AMM / 借贷", rating: 4.92, reviewCount: 567 },
  { id: "m-nft-03", name: "NFT Artist", title: "NFT 创作与市场", domain: "ERC-721 / ERC-1155", rating: 4.78, reviewCount: 345 },
  { id: "m-dao-04", name: "DAO Architect", title: "DAO 治理结构", domain: "投票机制 / 提案系统", rating: 4.85, reviewCount: 234 },
  { id: "m-layer2-05", name: "L2 Specialist", title: "Layer2 解决方案", domain: "ZK-Rollup / OP-Rollup", rating: 4.91, reviewCount: 421 },
];

export const MOCK_SEARCH_COMPANIES: SearchCompanyResult[] = [
  { id: "c-demo-01", name: "NovaChain Labs", industry: "基础设施", region: "新加坡", score: 96.4, mentorCount: 42 },
  { id: "c-demo-02", name: "Aurora Guild", industry: "开发者教育", region: "远程", score: 94.8, mentorCount: 38 },
  { id: "c-demo-03", name: "LedgerForge", industry: "安全审计", region: "香港", score: 93.1, mentorCount: 31 },
  { id: "c-demo-04", name: "Citadel DAO Tools", industry: "DAO 工具", region: "北美", score: 91.5, mentorCount: 27 },
  { id: "c-demo-05", name: "Zenith Pay", industry: "支付 / RWA", region: "欧盟", score: 90.2, mentorCount: 24 },
  { id: "c-demo-06", name: "PixelRealm Studio", industry: "链游", region: "首尔", score: 88.9, mentorCount: 22 },
  { id: "c-demo-07", name: "Harbor Index", industry: "索引 / 数据", region: "上海", score: 87.4, mentorCount: 19 },
  { id: "c-demo-08", name: "OpenCampus", industry: "教育凭证", region: "远程", score: 86.0, mentorCount: 17 },
  { id: "c-demo-09", name: "GreenLedger", industry: "ReFi", region: "柏林", score: 84.6, mentorCount: 15 },
  { id: "c-demo-10", name: "Mesh Identity", industry: "DID / 隐私", region: "东京", score: 83.2, mentorCount: 14 },
  { id: "c-chain-01", name: "ChainForge Inc", industry: "基础设施", region: "旧金山", score: 95.1, mentorCount: 55 },
  { id: "c-web3-02", name: "Web3 Academy", industry: "开发者教育", region: "伦敦", score: 93.7, mentorCount: 48 },
  { id: "c-sec-03", name: "SecuChain Labs", industry: "安全审计", region: "特拉维夫", score: 94.2, mentorCount: 36 },
  { id: "c-game-04", name: "MetaGame Studio", industry: "链游", region: "东京", score: 89.5, mentorCount: 29 },
  { id: "c-eth-05", name: "Ethereum Foundation Asia", industry: "基础设施", region: "新加坡", score: 97.8, mentorCount: 68 },
];

export function searchMentors(query: string): SearchMentorResult[] {
  const q = query.toLowerCase();
  return MOCK_SEARCH_MENTORS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.domain.toLowerCase().includes(q),
  );
}

export function searchCompanies(query: string): SearchCompanyResult[] {
  const q = query.toLowerCase();
  return MOCK_SEARCH_COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q),
  );
}