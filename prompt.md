📝 Cursor 项目提示词（复制到 Cursor）

你是一个资深全栈开发助手，帮我开发一个项目：AI 提示词管理平台。
项目要求如下，请严格遵循：

🔧 技术栈

前端：Next.js + TailwindCSS + TypeScript

后端：Next.js API Routes (内置，不使用外部服务器)

数据存储：使用 JSON 文件 或 LocalStorage（站长单人使用即可，不需要数据库）

部署：Vercel（免费，无需 VPS）

📌 功能需求

单用户模式

不支持用户注册登录

默认站长身份，所有操作都开放

提示词管理

新增提示词（标题 + 内容 + 分类）

编辑提示词

删除提示词

按分类浏览提示词

支持关键词搜索

分类功能

站长可以新增、修改、删除分类

提示词可绑定到分类

搜索功能

支持在所有提示词标题和内容里搜索关键词

界面设计

简洁清爽，TailwindCSS 风格

左侧：分类列表 + 搜索框

右侧：提示词展示区（卡片式）

顶部按钮：新增提示词、新增分类

📂 项目结构
/project-root
  /pages
    index.tsx        # 首页，展示搜索 & 分类
    /api
      prompts.ts     # 提示词 API (增删改查)
      categories.ts  # 分类 API (增删改查)
  /components
    PromptCard.tsx   # 提示词展示卡片
    PromptForm.tsx   # 添加/编辑提示词表单
    CategoryList.tsx # 分类列表
  /data
    prompts.json     # 存储提示词
    categories.json  # 存储分类

🚀 部署要求

代码完成后，提供 vercel.json 配置文件

部署到 Vercel 时，只需运行 npm run build 即可

所有功能必须在 单机环境 下可运行，无需任何云数据库