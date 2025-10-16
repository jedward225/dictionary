class BuzzwordDisplay {
    constructor() {
        this.buzzwordData = null;
        this.frequencyChart = null;
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

    displayBuzzwordData(data) {
        // 更新页面标题和头部
        document.getElementById('headword').textContent = data.headword;
        document.getElementById('pronunciation').textContent = data.pronunciation;

        // 更新档案信息
        document.getElementById('info-headword').textContent = data.headword;
        document.getElementById('info-language').textContent = data.language;
        document.getElementById('info-pos').textContent = data.partOfSpeech;
        document.getElementById('info-pronunciation').textContent = data.pronunciation;
        document.getElementById('info-first-recorded').textContent = data.firstRecorded;
        document.getElementById('info-trending').textContent = data.trendingPeriod;
        document.getElementById('info-senses').textContent = data.numberOfSenses;

        // 更新定义
        document.getElementById('trending-sense').textContent = data.trendingSense;
        document.getElementById('etymology').textContent = data.etymology;

        // 更新例句
        this.updateExamples(data.examples);

        // 更新历史
        document.getElementById('history-content').textContent = data.history;
        document.getElementById('history-source').textContent = data.source;

        // 更新相关词汇
        this.updateThesaurus(data.thesaurus);

        // 创建词频图表
        this.createFrequencyChart(data.frequencyData);
    }

    updateExamples(examples) {
        const examplesList = document.getElementById('examples-list');
        examplesList.innerHTML = '';
        examples.forEach(example => {
            const li = document.createElement('li');
            li.textContent = example;
            li.className = 'text-gray-300';
            examplesList.appendChild(li);
        });
    }

    updateThesaurus(thesaurusData) {
        const container = document.getElementById('thesaurus-content');
        container.innerHTML = '';

        thesaurusData.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'p-4 bg-white/5 rounded-lg border border-white/10';
            div.innerHTML = `
                <div class="flex items-center space-x-2 text-lg">
                    <span class="text-gray-400">${item.leftContext}</span>
                    <span class="font-bold text-cyan-300 px-2 py-1 bg-cyan-500/20 rounded">${item.word}</span>
                    <span class="text-gray-400">${item.rightContext}</span>
                    ${item.link ? `<a href="${item.link}" class="text-blue-400 hover:text-blue-300 ml-2">🔗</a>` : ''}
                </div>
            `;
            container.appendChild(div);
        });
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