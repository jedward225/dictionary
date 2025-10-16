# RUC-Buzzword-Dictionary

这是一个流行语词典网页，功能是效仿牛津词典做一个展示网页，深蓝色调。requirements.md有一些简单的会议记录。网页主要由两部分组成——①检索主页；②单词定义页面。其中，单词定义页面分为5个可以点击切换的栏目—— "流行语档案 Info Sheet", "定义 Definition", "词频 Frequency", "演化历史界面样例 History", "相关词汇界面样例 Thesaurus"

## 项目结构

```
dictionary-project/
│
├── index.html          # 网站的主页，包含搜索框和3D地球
├── word.html           # 流行语展示页面，包含5个栏目切换
├── buzzwords.json      # 流行语数据库，存储词汇信息
├── requirements.md     # 项目需求文档和会议记录
├── css/
│   └── style.css       # 自定义样式，包含主页和词条页面样式
├── js/
│   ├── main.js         # 主页逻辑，包含3D地球渲染和搜索功能
│   ├── word.js         # 词汇页面逻辑，包含数据加载和页面渲染
│   └── charts.js       # 图表功能，用于词频数据可视化
└── assets/
    └── images/         # 图片资源目录
```

## 功能特性

### 主页 (index.html)
- **3D地球背景**: 使用 Three.js 实现的交互式3D地球点阵
- **流行语搜索**: 支持搜索预设的流行语词汇
- **深蓝色主题**: 模仿牛津词典的视觉设计
- **响应式设计**: 支持不同屏幕尺寸

### 词条展示页 (word.html)
- **流行语档案**: 表格形式展示词目、语言、词类、发音等基础信息
- **定义说明**: 详细的流行义、例句和词源信息
- **词频分析**: 交互式图表展示年度使用频次变化
- **演化历史**: 文本形式展示词汇发展历程和信息来源
- **相关词汇**: 展示上下文用例，支持链接跳转

## 技术栈

- **前端框架**: 原生 JavaScript + HTML5 + CSS3
- **样式库**: Tailwind CSS
- **3D渲染**: Three.js
- **图表库**: Chart.js
- **数据存储**: JSON 文件
- **模块化**: ES6 模块系统

## 数据结构

流行语数据存储在 `buzzwords.json` 中，包含以下字段：
- headword: 词目
- language: 来源语言
- partOfSpeech: 词类
- pronunciation: 发音
- firstRecorded: 首次记录时间
- trendingPeriod: 流行时间
- numberOfSenses: 义项数量
- trendingSense: 流行义
- examples: 例句
- etymology: 词源
- frequencyData: 年度使用频次数据
- history: 演化历史
- source: 信息来源
- thesaurus: 相关词汇上下文

## 快速开始

1. 克隆项目到本地
2. 使用本地服务器运行项目（如 `python -m http.server` 或 Live Server）
3. 在浏览器中访问 `index.html`
4. 搜索预设的流行语：`brat`, `yyds`, `躺平`, `内卷`

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

支持所有现代浏览器，需要 ES6 模块和 WebGL 支持。
