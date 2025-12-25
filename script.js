// 核心业务选题数据 (贴合小红书爆款复刻、新年/元旦专题场景)
const defaultTopics = [
    { id: 9101, title: 'Jan 圣诞粒子互动动画复刻 (Map 还原版本)', status: '已发布', priority: 'P0', type: '交互动画', source: '小红书', owner: 'Developer_C', isPinned: true },
    { id: 9102, title: '2024 元旦倒计时交互贺卡', status: '制作中', priority: 'P0', type: '新年贺卡', source: '原创', owner: 'Designer_B', isPinned: true },
    { id: 9103, title: '视觉复刻：爆款流体渐变背景 CSS 实现', status: '策划中', priority: 'P1', type: '视觉特效', source: '即刻', owner: 'Admin', isPinned: false },
    { id: 9104, title: '一句话代码实现酷炫 3D 旋转画廊', status: '待定', priority: 'P1', type: '交互动画', source: 'Instagram', owner: 'Editor_A', isPinned: false },
    { id: 9105, title: '龙年/新年主题氛围感 UI 动效集锦', status: '策划中', priority: 'P2', type: '新年贺卡', source: '小红书', owner: 'Designer_B', isPinned: false }
];

let topics = JSON.parse(localStorage.getItem('mypopku_nexus_v3_topics')) || defaultTopics;

// DOM 元素
const topicGrid = document.getElementById('topic-grid');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const cancelBtn = document.querySelector('.btn-cancel');
const topicForm = document.getElementById('topic-form');
const topicTitleInput = document.getElementById('topic-title');
const topicIdInput = document.getElementById('topic-id');
const pinnedInput = document.getElementById('topic-pinned');
const modalTitle = document.getElementById('modal-title');
const filterBtns = document.querySelectorAll('.filter-pill');

// 标签映射
const priorityLabels = {
    'P0': 'P0 · CRITICAL',
    'P1': 'P1 · NORMAL',
    'P2': 'P2 · LOW'
};

// 渲染卡片 (包含置顶排序逻辑)
function renderTopics(filter = 'all') {
    topicGrid.innerHTML = '';

    // 排序逻辑：置顶项目始终排在最前，其次按 ID 倒序
    const sortedTopics = [...topics].sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
            return b.isPinned ? 1 : -1;
        }
        return b.id - a.id;
    });

    let filtered = sortedTopics;
    if (filter === 'high') filtered = sortedTopics.filter(t => t.priority === 'P0');
    if (filter === 'ongoing') filtered = sortedTopics.filter(t => t.status === '策划中' || t.status === '制作中');

    filtered.forEach((topic) => {
        const card = document.createElement('div');
        card.className = `topic-card status-${topic.status} ${topic.isPinned ? 'pinned-card' : ''}`;
        card.innerHTML = `
            ${topic.isPinned ? '<div class="pin-indicator">● PINNED</div>' : ''}
            <div class="card-actions">
                <button class="action-icon-btn" onclick="togglePin(${topic.id})">${topic.isPinned ? '📌' : '📍'}</button>
                <button class="action-icon-btn" onclick="editTopic(${topic.id})">✎</button>
                <button class="action-icon-btn" onclick="deleteTopic(${topic.id})">✕</button>
            </div>
            <div class="card-top">
                <span class="brand-meta" style="font-size: 0.6rem; opacity: 0.6; display: block; margin-bottom: 0.5rem;">
                    FROM ${topic.source.toUpperCase()} / BY ${topic.owner.toUpperCase()}
                </span>
                <span class="priority-tag priority-${topic.priority}">${priorityLabels[topic.priority]}</span>
                <h3 class="card-title">${topic.title}</h3>
                <div class="card-meta">
                    <span class="meta-icon">♢</span> ${topic.type}
                </div>
            </div>
            <div class="card-bottom">
                <div class="card-status">
                    <span class="status-dot-inner"></span>
                    ${topic.status}
                </div>
                <div class="card-id">#${topic.id}</div>
            </div>
        `;
        topicGrid.appendChild(card);
    });

    // 更新角标
    document.getElementById('total-count-badge').textContent = `(${topics.length})`;

    // 保存到本地
    localStorage.setItem('mypopku_nexus_v3_topics', JSON.stringify(topics));
}

// 置顶切换逻辑
window.togglePin = (id) => {
    const topic = topics.find(t => t.id === id);
    if (topic) {
        topic.isPinned = !topic.isPinned;
        renderTopics();
    }
};

// 模态框逻辑
function showModal(isEdit = false, topic = null) {
    modal.classList.add('active');
    if (isEdit && topic) {
        modalTitle.textContent = '编辑选题情报';
        topicIdInput.value = topic.id;
        topicTitleInput.value = topic.title;
        pinnedInput.checked = topic.isPinned || false;
        document.getElementById('topic-status').value = topic.status;
        document.getElementById('topic-owner').value = topic.owner || 'Admin';
        document.getElementById('topic-priority').value = topic.priority;
        document.getElementById('topic-type').value = topic.type;
        document.getElementById('topic-source').value = topic.source;
    } else {
        modalTitle.textContent = '录入新内容情报';
        topicForm.reset();
        topicIdInput.value = '';
        pinnedInput.checked = false;
    }
}

function hideModal() {
    modal.classList.remove('active');
}

// 事件处理
window.deleteTopic = (id) => {
    if (confirm('确认要在 Nexus 中抹除此项情报吗？')) {
        topics = topics.filter(t => t.id !== id);
        renderTopics();
    }
};

window.editTopic = (id) => {
    const topic = topics.find(t => t.id === id);
    if (topic) showModal(true, topic);
};

addBtn.addEventListener('click', () => showModal(false));
cancelBtn.addEventListener('click', hideModal);

topicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = topicIdInput.value;
    const newTopic = {
        id: id ? parseInt(id) : Math.floor(9000 + Math.random() * 1000),
        title: topicTitleInput.value,
        status: document.getElementById('topic-status').value,
        owner: document.getElementById('topic-owner').value,
        priority: document.getElementById('topic-priority').value,
        type: document.getElementById('topic-type').value,
        source: document.getElementById('topic-source').value,
        isPinned: pinnedInput.checked
    };

    if (id) {
        const index = topics.findIndex(t => t.id === parseInt(id));
        topics[index] = newTopic;
    } else {
        topics.unshift(newTopic);
    }

    renderTopics();
    hideModal();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTopics(btn.dataset.filter);
    });
});

window.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
});

// 初始化
renderTopics();
