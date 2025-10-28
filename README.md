# RUC-Buzzword-Dictionary

这是一个流行语词典网页，功能是效仿牛津词典做一个展示网页，深蓝色调。requirements.md有一些简单的会议记录。网页主要由两部分组成——①检索主页；②单词定义页面。其中，单词定义页面分为5个可以点击切换的栏目—— "流行语档案 Info Sheet", "定义 Definition", "词频 Frequency", "演化历史界面样例 History", "相关词汇界面样例 Thesaurus"

## 项目结构

```
dictionary-project/
│
├── index.html          # 网站的主页，包含搜索框和3D地球
├── word.html           # 流行语展示页面，包含5个栏目切换
├── buzzwords.json      # 流行语数据库，存储词汇信息
├── brat.md             # 词条示例参考文档
├── requirements.md     # 项目需求文档和会议记录
├── JSON_SCHEMA.md      # JSON数据结构规范文档
├── DATA_ENTRY_GUIDE.md # 数据填写指南（给后端团队使用）
├── css/
│   └── style.css       # 自定义样式，包含主页和词条页面样式
├── js/
│   ├── main.js         # 主页逻辑，包含3D地球渲染和搜索功能
│   ├── word.js         # 词汇页面逻辑，包含数据加载和页面渲染
│   └── charts.js       # 图表功能，用于词频数据可视化
└── assets/
    ├── images/         # 图片资源目录
    └── audio/          # 音频文件目录
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

流行语数据采用通用的多语种JSON格式存储在 `buzzwords.json` 中。详细的数据结构规范请参考 `JSON_SCHEMA.md`。

### 主要特性

1. **多语种支持**：所有文本字段支持多语言（en/zh等）
2. **层级化义项**：支持trending（流行义）、common（主流义）、other（其他义）等类型
3. **完整例句信息**：包含年份、完整句子、出处和关键词位置
4. **音频支持**：发音字段支持音频文件路径（uk/us/zh等）
5. **关键词位置标记**：便于算法提取上下文

### 核心字段

- **headword**: 词目（字符串）
- **language**: 来源语言（多语种对象，如 `{en: "English", zh: "英语"}`）
- **partOfSpeech**: 词类（多语种对象）
- **pronunciation**: 发音信息，包含音标和可选的音频路径
- **firstRecorded**: 首次记录时间（多语种对象）
- **trendingPeriod**: 流行时间
- **numberOfSenses**: 义项数量
- **senses**: 义项数组，支持嵌套子义项（subsenses）
  - 每个义项包含 type、title、label、definition、examples、etymology 等字段
  - 例句包含 year、sentence、source、keyword、keywordPosition 等信息
- **frequencyData**: 年度使用频次数据
- **history**: 演化历史（多语种对象）
- **source**: 信息来源（多语种对象）
- **relatedTerms**: 相关词汇数组

### 示例数据片段

```json
{
  "headword": "brat",
  "language": { "en": "English", "zh": "英语" },
  "pronunciation": {
    "uk": "/brat/",
    "us": "/bræt/",
    "audio": {
      "uk": "assets/audio/brat-uk.mp3",
      "us": "assets/audio/brat-us.mp3"
    }
  },
  "senses": [
    {
      "type": "trending",
      "title": { "en": "Trending Sense", "zh": "流行义" },
      "definition": {
        "en": "A confident, independent...",
        "zh": "指一种自信、独立..."
      },
      "examples": [
        {
          "year": 2024,
          "sentence": {
            "en": "To be a brat is to be confident...",
            "zh": "\"做一个 brat\"意味着..."
          },
          "keyword": "brat",
          "keywordPosition": { "start": 5, "end": 9 }
        }
      ]
    }
  ]
}
```

完整数据结构和字段说明请参考 `JSON_SCHEMA.md` 文档。

## 数据填写指南

### 给后端团队

如果你需要向 `buzzwords.json` 添加新的流行语数据，请参考：

📘 **[DATA_ENTRY_GUIDE.md](DATA_ENTRY_GUIDE.md)** - 详细的数据填写指南

该指南包含：
- 快速开始步骤
- 完整的字段说明
- 填写示例（中文和英文词条）
- 关键词位置计算方法
- 常见问题解答
- 检查清单

### 添加新词条的步骤

1. 编辑 `buzzwords.json`，按照规范添加新词条
2. 更新 `js/main.js` (第97行)，将新词条ID添加到搜索列表
3. （可选）添加音频文件到 `assets/audio/`
4. 验证JSON格式正确性
5. 测试新词条是否能正常搜索和显示

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
