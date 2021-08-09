# Rollupjs.org

这是网站的源码。需要注意的是，实际的指南现在是 [rollup 主仓库](https://github.com/rollup/rollup/tree/master/docs) 的一部分，并且需要在那里更新，请参见下文。

## 在本地构建网站的步骤

1. `npm install`
2. `npm run update-guide`
3. `npm run dev`
4. 打开 http://localhost:3000

## 更新指南内容

该指南是 rollup 主仓库的一部分，它再次以子模块的形式添加到此仓库中。运行 `npm run update-guide` 应该会自动初始化子模块并将最新的指南复制到本地文件夹中。要更新指南内容：

1. 更新 rollup 主仓库的复刻或分支（如果你有访问权限）中的指南，并发起一个拉取请求。添加或修改功能的拉取请求也应该始终更新指南。
2. 合并后，检出子模块中最新的主分支：
   ```bash
   cd rollup-submodule
   git checkout master
   git pull
   ```
3. 在主仓库中提交新分支：
   ```bash
   cd ..
   git add rollup-submodule
   git commit -m "Update guide"
   ```

步骤 2 和 3 应由合并 rollup 主仓库中的拉取请求的人完成。提交推送到 `origin/master` 之后，网站应该被 CI 自动更新。如有需要，除了检出最新 master 分支之外，还可以检出任何其他提交，例如测试一个拉取请求。

## 风格指南

- 请使用 `-` 表示带项目符号的列表项。
- 请在你的编辑器中为此仓库的 Markdown 文件设置 100 个字符的首选行长度。
- 请不要使用硬换行符来设置纯文本块的格式。相反，请在你的编辑器中启用软换行符。

## REPL 链接

除了通过包含由 REPL 本身生成的 `shareable=` 参数的共享之外，REPL 还可以从 Github gist 预加载。要做到这一点

- 向 URL 添加 `gist=<gist-id>` 参数，例如 [`rollupjs.org/repl/?gist=e9c6c04b8f96adc562a70c096c3e7705`](https://rollupjs.org/repl/?gist=e9c6c04b8f96adc562a70c096c3e7705)
- 如果 gist 包含 `main.js` 文件，这将用作 REPL 中的第一个模块，否则将创建一个空的 `main.js` 文件
- 可以通过添加 `entry=<comma-separated list of entry points>` 参数来指定其他入口点，例如 [`rollupjs.org/repl/?gist=e9c6c04b8f96adc562a70c096c3e7705&entry=lower.js,upper.js`](https://rollupjs.org/repl?gist=e9c6c04b8f96adc562a70c096c3e7705&entry=lower.js,upper.js)
