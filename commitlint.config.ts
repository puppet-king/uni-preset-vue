// 参照 https://cz-git.qbb.sh/zh/recipes/，
module.exports = {
  prompt: {
    scopes: [{ value: 'index', name: 'index: 主页' }],
    skipQuestions: [
      'body', // 跳过：详细描述 (更长篇幅的变更原因或逻辑说明)
      'breaking', // 跳过：重大破坏性更新说明 (通常指会导致不兼容升级的改动)
      'footerPrefix', // 跳过：关联 Issue 的前缀 (例如: FIXES, CLOSES)
      'footer', // 跳过：关联 Issue 的编号 (例如: #123)
      'confirmCommit', // 跳过：最后的“是否确认提交”询问 (选完直接执行 git commit)
    ],
  },
}
