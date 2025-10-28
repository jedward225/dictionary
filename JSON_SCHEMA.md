# Buzzwords JSON 数据结构规范

## 设计理念

基于 brat.md 的详细词条结构，设计了一套通用的、支持多语种的流行语数据格式。该格式具有以下特点：

1. **多语种支持**：所有文本字段均支持多语言对象（en/zh等）
2. **灵活的义项结构**：支持trending（流行义）、common（主流义）、other（其他义）等多种类型
3. **完整的例句信息**：包含年份、完整句子、出处和关键词位置
4. **音频支持**：发音字段支持音频文件路径
5. **可扩展性**：结构设计便于添加新语种和新字段

## 数据结构

### 顶层结构

```json
{
  "buzzwords": {
    "词条id": { ... },
    "词条id2": { ... }
  }
}
```

### 词条结构

每个词条包含以下字段：

#### 1. 基本信息

```json
{
  "headword": "brat",                    // 词目（字符串）
  "language": {                          // 来源语言（对象）
    "en": "English",
    "zh": "英语"
  },
  "partOfSpeech": {                      // 词类（对象）
    "en": "noun",
    "zh": "名词"
  },
  "pronunciation": {                     // 发音（对象）
    "uk": "/brat/",                      // 英式发音（可选）
    "us": "/bræt/",                      // 美式发音（可选）
    "pinyin": "yǒng yuǎn de shén",       // 拼音（可选，用于中文词）
    "audio": {                           // 音频文件（对象，可选）
      "uk": "assets/audio/brat-uk.mp3",
      "us": "assets/audio/brat-us.mp3",
      "zh": "assets/audio/word-zh.mp3"
    }
  },
  "firstRecorded": {                     // 首次记录时间（对象）
    "en": "Old English (before 1150)",
    "zh": "古英语时期（公元1150年前）"
  },
  "trendingPeriod": "2024",              // 流行时间（字符串）
  "numberOfSenses": 7                    // 义项数量（数字）
}
```

#### 2. 义项（senses）

义项是一个数组，每个元素代表一个语义分类：

```json
{
  "senses": [
    {
      "type": "trending",                // 义项类型：trending/common/other
      "title": {                         // 义项标题（对象）
        "en": "Trending Sense",
        "zh": "流行义"
      },
      "label": {                         // 义项标签（对象）
        "en": "Confident, Independent Person or Attitude",
        "zh": "自信独立者"
      },
      "definition": {                    // 定义（对象）
        "en": "A confident, independent...",
        "zh": "指一种自信、独立..."
      },
      "examples": [ ... ],               // 例句数组（见下文）
      "etymology": {                     // 词源（对象或null）
        "en": "Originally emerged from...",
        "zh": "最初出现在..."
      }
    }
  ]
}
```

##### 2.1 带子义项的义项

对于复杂的义项（如 common 或 other），可以包含 `subsenses` 数组：

```json
{
  "type": "common",
  "title": {
    "en": "Common Modern Sense",
    "zh": "现代主流义"
  },
  "subsenses": [
    {
      "label": {
        "en": "Spoiled or Mischievous Child",
        "zh": "被宠坏的孩子"
      },
      "definition": {
        "en": "(Usually derogatory) A child...",
        "zh": "（常作贬义）指无礼..."
      },
      "examples": [ ... ]
    },
    {
      "label": { ... },
      "definition": { ... },
      "examples": [ ... ]
    }
  ],
  "etymology": {                         // 词源可以在义项层级
    "en": "...",
    "zh": "..."
  }
}
```

#### 3. 例句结构（examples）

例句记录完整的句子信息，不再拆分为 leftContext 和 rightContext：

```json
{
  "examples": [
    {
      "year": 2024,                      // 年份（数字）
      "sentence": {                      // 完整句子（对象）
        "en": "To be a brat is to be confident...",
        "zh": "\"做一个 brat\"意味着..."
      },
      "source": {                        // 来源信息（对象）
        "author": "Gwen Tam",
        "title": "BRAT: a shiny, lime green breakdown",
        "url": "https://..."
      },
      "keyword": "brat",                 // 关键词（字符串）
      "keywordPosition": {               // 关键词位置（对象，用于后续算法处理）
        "start": 5,                      // 起始位置（字符索引）
        "end": 9                         // 结束位置（字符索引）
      }
    }
  ]
}
```

**关键词位置说明**：
- `keywordPosition` 记录关键词在**英文句子**中的字符位置
- 这些位置信息可以用于算法自动提取 leftContext 和 rightContext
- 如果需要支持中文位置，可以添加额外字段

#### 4. 词频数据（frequencyData）

```json
{
  "frequencyData": [
    {"year": 2020, "count": 150},
    {"year": 2021, "count": 300},
    {"year": 2022, "count": 800}
  ]
}
```

#### 5. 历史信息（history）

```json
{
  "history": {
    "en": "The term 'brat' has undergone...",
    "zh": "\"brat\"一词在2024年经历..."
  }
}
```

#### 6. 来源和相关词汇

```json
{
  "source": {                            // 信息来源（对象）
    "en": "Global Buzzwords Report 2024",
    "zh": "《2024年全球流行语报告》"
  },
  "relatedTerms": [                      // 相关词汇（数组）
    "aesthetic",
    "confidence",
    "authenticity"
  ]
}
```

## 完整示例

参见 `buzzwords.json` 中的 "brat" 词条。

## 多语种扩展

如需添加新语种（如日语、韩语等），只需在相应对象中添加语言代码：

```json
{
  "language": {
    "en": "English",
    "zh": "英语",
    "ja": "英語",
    "ko": "영어"
  }
}
```

## 音频文件命名规范

音频文件应放置在 `assets/audio/` 目录下，建议命名格式：

- 英语词汇：`{headword}-{region}.mp3`（如 `brat-uk.mp3`, `brat-us.mp3`）
- 中文词汇：`{headword}-zh.mp3`（如 `yyds-zh.mp3`, `tangping-zh.mp3`）

## 关键词位置的算法应用

`keywordPosition` 字段设计用于后续算法处理：

```javascript
// 示例：从完整句子中提取上下文
function extractContext(sentence, keyword, position) {
  const leftContext = sentence.substring(0, position.start).trim();
  const word = sentence.substring(position.start, position.end);
  const rightContext = sentence.substring(position.end).trim();

  return { leftContext, word, rightContext };
}
```

## 字段必需性

### 必需字段
- `headword`
- `language`
- `partOfSpeech`
- `pronunciation`
- `trendingPeriod`
- `numberOfSenses`
- `senses` (至少包含一个义项)

### 可选字段
- `firstRecorded`
- `examples` (可以为空数组)
- `etymology` (可以为 null)
- `frequencyData`
- `history`
- `source`
- `relatedTerms`
- `pronunciation.audio`

## 注意事项

1. 所有文本字段应使用 UTF-8 编码
2. URL 字段可以为空字符串（""），表示无链接
3. 多语种对象至少应包含 `en` 和 `zh` 两个键
4. 年份使用数字类型，便于排序和计算
5. 数组字段即使为空也应保留为空数组 `[]`，而非 `null`