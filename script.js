// switchPage 已在 app.js 中定义，此处删除重复定义

function toggleMechBar() {
    const mechBar = document.getElementById('mech-bar');
    const mechBtn = document.querySelector('.mech-btn');
    if (!mechBar || !mechBtn) return;

    const isExpanded = mechBar.classList.toggle('expanded');
    mechBtn.classList.toggle('open', isExpanded);
}

function toggleCard(cardElement) {
    if (!cardElement) return;
    cardElement.classList.toggle('open');
}

window.toggleLeader = function(event, slotStr) {
    if (event) {
        event.stopPropagation();
        const btn = event.currentTarget;
        if (btn) {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }
    }
    console.log(`[PKM UI] Request Set Leader -> ${slotStr}`);
    
    // 调用父窗口注入到 iframe window 的回调函数
    if (window.pkmSetLeaderCallback) {
        console.log('[PKM UI] 调用 pkmSetLeaderCallback');
        window.pkmSetLeaderCallback(slotStr);
    } else {
        console.warn('[PKM UI] pkmSetLeaderCallback 不可用');
    }
};
