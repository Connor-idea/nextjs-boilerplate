/**
 * auto-push.mjs
 * 监听 src/ 目录下的文件变动，防抖后自动执行：
 *   git add -A && git commit -m "auto: <timestamp>" && git push origin main
 *
 * 使用: node scripts/auto-push.mjs
 */

import { watch } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const WATCH_DIR = resolve(ROOT, 'src');
const DEBOUNCE_MS = 2000; // 文件变动后等待 2 秒再提交，合并连续修改

let timer = null;

function gitPush(reason = 'file change') {
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
  const message = `auto: ${timestamp}`;
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT }).toString().trim();
    if (!status) {
      console.log('[auto-push] 无变更，跳过提交');
      return;
    }
    console.log(`[auto-push] 检测到变更（${reason}），正在提交并推送...`);
    execSync(`git add -A && git commit -m "${message}" && git push origin main`, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: true,
    });
    console.log('[auto-push] 推送成功 ✓');
  } catch (err) {
    console.error('[auto-push] 推送失败:', err.message);
  }
}

function scheduleGitPush(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => gitPush(reason), DEBOUNCE_MS);
}

// 监听 src/ 目录（递归）
watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  // 忽略编辑器临时文件
  if (filename.endsWith('~') || filename.includes('.swp') || filename.startsWith('.')) return;
  console.log(`[auto-push] ${eventType}: ${filename}`);
  scheduleGitPush(filename);
});

console.log(`[auto-push] 开始监听 src/ 目录，文件变更后将自动提交并推送`);
console.log(`[auto-push] 防抖间隔: ${DEBOUNCE_MS}ms | 按 Ctrl+C 停止`);
