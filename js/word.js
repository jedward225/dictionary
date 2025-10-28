class BuzzwordDisplay {
    constructor() {
        this.buzzwordData = null;
        this.frequencyChart = null;
        this.currentLang = 'zh'; // 默认显示中文，可以根据需要切换
        this.init();
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const term = params.get('term');

        if (!term) {
            document.getElementById('headword').textContent = '未找到词条';
            return;
        }

        try {
            // 加载词典数据
            const response = await fetch('buzzwords.json');
            const data = await response.json();

            this.buzzwordData = data.buzzwords[term.toLowerCase()];

            if (this.buzzwordData) {
                this.displayBuzzwordData(this.buzzwordData);
            } else {
                this.show404();
            }
        } catch (error) {
            console.error('加载数据失败:', error);
            this.show404();
        }

        // 初始化标签页功能
        this.setupTabs();
    }

    // 获取多语言文本
    getText(field, lang = this.currentLang) {
        if (typeof field === 'string') {
            return field;
        }
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['zh'] || field['en'] || '';
        }
        return '';
    }

    // 格式化发音信息
    formatPronunciation(pronunciation) {
        const parts = [];

        // 英语发音
        if (pronunciation.uk) {
            parts.push(`英 ${pronunciation.uk}`);
        }
        if (pronunciation.us) {
            parts.push(`美 ${pronunciation.us}`);
        }

        // 中文发音
        if (pronunciation.pinyin) {
            parts.push(pronunciation.pinyin);
        }

        // 国际音标（通用）
        if (pronunciation.ipa && !pronunciation.uk && !pronunciation.us) {
            parts.push(`IPA ${pronunciation.ipa}`);
        }

        // 罗马化拼写（俄语、韩语等）
        if (pronunciation.romanization) {
            parts.push(pronunciation.romanization);
        }

        // 日语发音
        if (pronunciation.romaji) {
            parts.push(pronunciation.romaji);
        }
        if (pronunciation.hiragana) {
            parts.push(pronunciation.hiragana);
        }

        // 韩语发音
        if (pronunciation.hangul) {
            parts.push(pronunciation.hangul);
        }

        return parts.join(' ') || 'No pronunciation available';
    }

    displayBuzzwordData(data) {
        // 更新页面标题和头部
        document.getElementById('headword').textContent = data.headword;
        const pronunciationText = this.formatPronunciation(data.pronunciation);
        document.getElementById('pronunciation').textContent = pronunciationText;

        // 添加音频播放按钮（如果有音频）
        this.addAudioPlayer(data.pronunciation.audio);

        // 更新档案信息
        this.updateInfoSheet(data);

        // 更新定义（显示所有义项）
        this.updateDefinition(data.senses);

        // 更新历史
        document.getElementById('history-content').textContent = this.getText(data.history);
        document.getElementById('history-source').textContent = this.getText(data.source);

        // 更新相关词汇
        this.updateRelatedTerms(data.relatedTerms, data.senses);

        // 创建词频图表
        this.createFrequencyChart(data.frequencyData);
    }

    updateInfoSheet(data) {
        document.getElementById('info-headword').textContent = data.headword;
        document.getElementById('info-language').textContent =
            `${this.getText(data.language, 'en')} | ${this.getText(data.language, 'zh')}`;
        document.getElementById('info-pos').textContent =
            `${this.getText(data.partOfSpeech, 'en')} | ${this.getText(data.partOfSpeech, 'zh')}`;
        document.getElementById('info-pronunciation').textContent =
            this.formatPronunciation(data.pronunciation);
        document.getElementById('info-first-recorded').textContent =
            this.getText(data.firstRecorded);
        document.getElementById('info-trending').textContent = data.trendingPeriod;
        document.getElementById('info-senses').textContent = data.numberOfSenses;
    }

    updateDefinition(senses) {
        const container = document.getElementById('definition');
        container.innerHTML = '<h3 class="text-3xl font-bold mb-6 text-cyan-400">定义 | Definition</h3>';

        senses.forEach((sense, index) => {
            const senseDiv = document.createElement('div');
            senseDiv.className = 'mb-8 pb-6 border-b border-white/10';

            // 义项标题
            const titleDiv = document.createElement('div');
            titleDiv.className = 'mb-4';
            titleDiv.innerHTML = `
                <h4 class="text-2xl font-semibold text-cyan-400">${this.getText(sense.title)}</h4>
                <p class="text-xl text-cyan-300 mt-1">${this.getText(sense.label)}</p>
            `;
            senseDiv.appendChild(titleDiv);

            // 定义
            if (sense.definition) {
                const defDiv = document.createElement('div');
                defDiv.className = 'mb-4';
                defDiv.innerHTML = `
                    <p class="text-lg text-gray-300 leading-relaxed">
                        <span class="text-cyan-400 font-semibold">EN:</span> ${this.getText(sense.definition, 'en')}
                    </p>
                    <p class="text-lg text-gray-300 leading-relaxed mt-2">
                        <span class="text-cyan-400 font-semibold">ZH:</span> ${this.getText(sense.definition, 'zh')}
                    </p>
                `;
                senseDiv.appendChild(defDiv);
            }

            // 处理子义项
            if (sense.subsenses && sense.subsenses.length > 0) {
                sense.subsenses.forEach((subsense, subIndex) => {
                    const subsenseDiv = document.createElement('div');
                    subsenseDiv.className = 'ml-4 mb-4 pl-4 border-l-2 border-cyan-500';
                    subsenseDiv.innerHTML = `
                        <p class="text-xl text-cyan-300 font-semibold mb-2">
                            (${String.fromCharCode(97 + subIndex)}) ${this.getText(subsense.label)}
                        </p>
                        <p class="text-lg text-gray-300 leading-relaxed">
                            <span class="text-cyan-400 font-semibold">EN:</span> ${this.getText(subsense.definition, 'en')}
                        </p>
                        <p class="text-lg text-gray-300 leading-relaxed mt-1">
                            <span class="text-cyan-400 font-semibold">ZH:</span> ${this.getText(subsense.definition, 'zh')}
                        </p>
                    `;

                    // 添加子义项的例句
                    if (subsense.examples && subsense.examples.length > 0) {
                        subsenseDiv.appendChild(this.createExamplesSection(subsense.examples));
                    }

                    senseDiv.appendChild(subsenseDiv);
                });
            }

            // 添加例句（针对顶级义项）
            if (sense.examples && sense.examples.length > 0) {
                senseDiv.appendChild(this.createExamplesSection(sense.examples));
            }

            // 词源
            if (sense.etymology) {
                const etymDiv = document.createElement('div');
                etymDiv.className = 'mt-4 p-4 bg-blue-900/20 rounded-lg';
                etymDiv.innerHTML = `
                    <h5 class="text-xl font-semibold text-blue-400 mb-3">Etymology | 词源</h5>
                    <p class="text-lg text-gray-300 leading-relaxed">
                        <span class="text-blue-400 font-semibold">EN:</span> ${this.getText(sense.etymology, 'en')}
                    </p>
                    <p class="text-lg text-gray-300 leading-relaxed mt-2">
                        <span class="text-blue-400 font-semibold">ZH:</span> ${this.getText(sense.etymology, 'zh')}
                    </p>
                `;
                senseDiv.appendChild(etymDiv);
            }

            container.appendChild(senseDiv);
        });
    }

    createExamplesSection(examples) {
        const examplesDiv = document.createElement('div');
        examplesDiv.className = 'mt-4';
        examplesDiv.innerHTML = '<h5 class="text-xl font-semibold text-cyan-400 mb-3">Examples 例句</h5>';

        examples.forEach((example) => {
            const exampleItem = document.createElement('div');
            exampleItem.className = 'mb-4 p-4 bg-white/5 rounded-lg';

            const enSentence = this.getText(example.sentence, 'en');
            const zhSentence = this.getText(example.sentence, 'zh');

            // 高亮关键词
            const highlightedEn = this.highlightKeyword(
                enSentence,
                example.keyword,
                example.keywordPosition
            );

            exampleItem.innerHTML = `
                <p class="text-base text-gray-400 mb-2">${example.year}</p>
                <p class="text-lg text-gray-300 leading-relaxed mb-2">${highlightedEn}</p>
                <p class="text-base text-gray-400 leading-relaxed italic mb-2">译文：${zhSentence}</p>
                ${example.source && example.source.author ? `
                    <p class="text-sm text-blue-400">
                        — ${example.source.author}${example.source.title ? `. ${example.source.title}` : ''}
                        ${example.source.url ? `<a href="${example.source.url}" target="_blank" class="ml-1 hover:text-blue-300">🔗</a>` : ''}
                    </p>
                ` : ''}
            `;

            examplesDiv.appendChild(exampleItem);
        });

        return examplesDiv;
    }

    highlightKeyword(sentence, keyword, position) {
        if (!position || !keyword) {
            return sentence;
        }

        const before = sentence.substring(0, position.start);
        const word = sentence.substring(position.start, position.end);
        const after = sentence.substring(position.end);

        return `${before}<span class="font-bold text-cyan-300 bg-cyan-500/20 px-1 rounded">${word}</span>${after}`;
    }

    updateRelatedTerms(relatedTerms, senses) {
        const container = document.getElementById('thesaurus-content');
        container.innerHTML = '';

        if (!relatedTerms || relatedTerms.length === 0) {
            container.innerHTML = '<p class="text-gray-400">暂无相关词汇</p>';
            return;
        }

        // 显示相关词汇标签
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'mb-6';
        tagsDiv.innerHTML = '<h4 class="text-2xl font-semibold text-cyan-400 mb-4">相关词汇 | Related Terms</h4>';

        const tagContainer = document.createElement('div');
        tagContainer.className = 'flex flex-wrap gap-3';

        relatedTerms.forEach(term => {
            const tag = document.createElement('span');
            tag.className = 'px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-base';
            tag.textContent = term;
            tagContainer.appendChild(tag);
        });

        tagsDiv.appendChild(tagContainer);
        container.appendChild(tagsDiv);

        // 从所有义项中提取例句作为语境展示
        const examplesDiv = document.createElement('div');
        examplesDiv.innerHTML = '<h4 class="text-2xl font-semibold text-cyan-400 mb-4 mt-8">语境示例 | Contextual Examples</h4>';

        let allExamples = [];
        senses.forEach(sense => {
            if (sense.examples) {
                allExamples = allExamples.concat(sense.examples);
            }
            if (sense.subsenses) {
                sense.subsenses.forEach(subsense => {
                    if (subsense.examples) {
                        allExamples = allExamples.concat(subsense.examples);
                    }
                });
            }
        });

        // 显示最多5个例句
        allExamples.slice(0, 5).forEach(example => {
            const contextDiv = document.createElement('div');
            contextDiv.className = 'p-5 bg-white/5 rounded-lg border border-white/10 mb-4';

            // 提取上下文
            const sentence = this.getText(example.sentence, 'en');
            const leftContext = sentence.substring(0, example.keywordPosition?.start || 0);
            const word = example.keyword;
            const rightContext = sentence.substring(example.keywordPosition?.end || sentence.length);

            contextDiv.innerHTML = `
                <div class="flex items-center space-x-2 text-lg mb-3">
                    <span class="text-gray-300">${leftContext}</span>
                    <span class="font-bold text-cyan-300 px-2 py-1 bg-cyan-500/20 rounded">${word}</span>
                    <span class="text-gray-300">${rightContext}</span>
                </div>
                <p class="text-sm text-gray-400 mt-2">${example.year} - ${example.source?.title || 'Source'}</p>
            `;

            examplesDiv.appendChild(contextDiv);
        });

        container.appendChild(examplesDiv);
    }

    addAudioPlayer(audio) {
        if (!audio) return;

        const pronunciationEl = document.getElementById('pronunciation');
        const audioDiv = document.createElement('div');
        audioDiv.className = 'mt-2 flex gap-2';

        if (audio.uk) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.uk}').play()"
                        class="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full transition-colors">
                    🔊 UK
                </button>
            `;
        }

        if (audio.us) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.us}').play()"
                        class="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full transition-colors">
                    🔊 US
                </button>
            `;
        }

        if (audio.zh) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.zh}').play()"
                        class="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full transition-colors">
                    🔊 中文
                </button>
            `;
        }

        pronunciationEl.appendChild(audioDiv);
    }

    show404() {
        document.getElementById('headword').textContent = '词条未找到';
        document.getElementById('pronunciation').textContent = '404 Not Found';

        // 隐藏所有标签页内容，显示错误信息
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="text-center py-16">
                <h3 class="text-3xl font-bold text-red-400 mb-4">抱歉，未找到该流行语</h3>
                <p class="text-gray-300 mb-8">请检查输入的词汇是否正确，或返回主页重新搜索。</p>
                <a href="index.html" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    返回主页
                </a>
            </div>
        `;
    }

    setupTabs() {
        // 标签页切换功能
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // 更新按钮状态
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // 更新标签页内容
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BuzzwordDisplay();
});