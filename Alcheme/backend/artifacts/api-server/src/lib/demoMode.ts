/**
 * 全局 Demo 模式开关（内存状态）
 * demo = true 时，/api/smelt 和 /api/forge 跳过 AI 生图，改用现有图片预览
 */

let _demoMode = false;

export function isDemoMode(): boolean {
  return _demoMode;
}

export function setDemoMode(value: boolean): void {
  _demoMode = value;
}
