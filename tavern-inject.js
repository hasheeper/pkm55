/**
 * PKM Dashboard - SillyTavern 悬浮球注入脚本
 * 点击悬浮球打开 GitHub Pages 上的 PKM 面板
 * 包含 ERA 变量获取、位置上下文注入逻辑
 */

(function() {
    'use strict';
    
    const PKM_URL = 'https://hasheeper.github.io/pkm55/';
    const LOCATION_INJECT_ID = 'pkm_location_context';
    
    // 等待 jQuery 加载
    function waitForJQuery(callback) {
        if (typeof jQuery !== 'undefined') {
            callback(jQuery);
        } else {
            setTimeout(() => waitForJQuery(callback), 100);
        }
    }
    
    waitForJQuery(function($) {
        console.log('[PKM] 悬浮球脚本加载中...');
        
        // 清理旧元素
        $('[id^="pkm-"]').remove();
        
        // 动画样式
        const animationStyle = `
            <style id="pkm-anim-style">
                @keyframes pkm-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes pkm-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
                    50% { box-shadow: 0 0 0 12px rgba(255, 215, 0, 0); }
                }
            </style>
        `;
        if (!$('#pkm-anim-style').length) {
            $('head').append(animationStyle);
        }
        
        // 创建容器
        const container = $('<div>')
            .attr('id', 'pkm-container')
            .css({
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: '99999'
            });
        
        // 悬浮球
        const ball = $('<div>')
            .attr('id', 'pkm-ball')
            .css({
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(255, 165, 0, 0.5)',
                animation: 'pkm-float 3s ease-in-out infinite, pkm-pulse 2s ease-in-out infinite',
                transition: 'transform 0.2s ease'
            })
            .html(`
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
                    <circle cx="12" cy="12" r="10" stroke="#333" stroke-width="2" fill="none"/>
                    <line x1="2" y1="12" x2="22" y2="12" stroke="#333" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="#333"/>
                </svg>
            `)
            .hover(
                function() { $(this).css({ transform: 'scale(1.1)' }); },
                function() { $(this).css({ transform: 'scale(1)' }); }
            );
        
        // 遮罩层（参考 build-iframe.js）
        const overlay = $('<div>')
            .attr('id', 'pkm-overlay')
            .css({
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'width': '100vw',
                'height': '97.5vh',
                'background': 'rgba(0, 0, 0, 0.5)',
                'backdrop-filter': 'blur(4px)',
                'pointer-events': 'auto',
                'display': 'none',
                'align-items': 'center',
                'justify-content': 'center',
                'padding': '1px',
                'z-index': 2147483646,
                'overflow': 'hidden'
            });
        
        // 内容包装器（参考 build-iframe.js）
        const contentWrapper = $('<div>')
            .attr('id', 'pkm-content-wrapper')
            .css({
                'position': 'relative',
                'width': '100%',
                'max-width': '485px',
                'height': '95vh',
                'max-height': '850px',
                'display': 'flex',
                'flex-direction': 'column',
                'align-items': 'center',
                'justify-content': 'center',
                'pointer-events': 'auto'
            });
        
        // iframe
        const iframe = $('<iframe>')
            .attr('id', 'pkm-iframe')
            .css({
                'width': '100%',
                'height': '100%',
                'border': 'none',
                'border-radius': '24px',
                'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'background': '#f2f4f8',
                'overflow': 'hidden'
            });
        
        // 关闭按钮（参考 build-iframe.js）
        const closeIconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
        
        const closeBtn = $('<div>')
            .attr('id', 'pkm-close-btn')
            .html(closeIconSvg)
            .css({
                'position': 'absolute',
                'top': '-5px',
                'right': '-10px',
                'width': '40px',
                'height': '40px',
                'background': 'rgba(255, 255, 255, 0.85)',
                'backdrop-filter': 'blur(4px)',
                'border-radius': '50%',
                'cursor': 'pointer',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'color': '#636e72',
                'z-index': 100,
                'pointer-events': 'auto',
                'transition': 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        
        closeBtn.hover(
            function() {
                $(this).css({
                    'transform': 'rotate(90deg) scale(1.1)',
                    'background': '#ff7675',
                    'color': '#fff'
                });
            },
            function() {
                $(this).css({
                    'transform': 'rotate(0deg) scale(1)',
                    'background': 'rgba(255, 255, 255, 0.85)',
                    'color': '#636e72'
                });
            }
        );
        
        // 组装
        contentWrapper.append(iframe).append(closeBtn);
        overlay.append(contentWrapper);
        container.append(ball);
        $('body').append(container).append(overlay);
        
        // ========== ERA 变量获取 ==========
        async function getEraVars() {
            return new Promise((resolve) => {
                if (typeof eventEmit === 'undefined' || typeof eventOn === 'undefined') {
                    console.warn('[PKM] eventEmit/eventOn 不可用');
                    resolve(null);
                    return;
                }
                
                const timeout = setTimeout(() => {
                    console.warn('[PKM] ERA 查询超时');
                    resolve(null);
                }, 3000);
                
                eventOn('era:queryResult', (detail) => {
                    if (detail.queryType === 'getCurrentVars') {
                        clearTimeout(timeout);
                        resolve(detail.result?.statWithoutMeta || null);
                    }
                }, { once: true });
                
                eventEmit('era:getCurrentVars');
            });
        }
        
        // ========== 位置上下文注入（接收来自 iframe 的完整上下文）==========
        let lastLocationContext = null;
        
        function doInjectLocationContext(contextText) {
            if (!contextText) {
                console.log('[PKM] 无位置上下文内容，跳过注入');
                return;
            }
            
            const promptContent = `<location_context>
${contextText}
</location_context>`;
            
            // 先清除旧注入
            if (typeof uninjectPrompts === 'function') {
                try {
                    uninjectPrompts([LOCATION_INJECT_ID]);
                } catch (e) {
                    // 忽略
                }
            }
            
            // 注入新内容
            if (typeof injectPrompts === 'function') {
                injectPrompts([{
                    id: LOCATION_INJECT_ID,
                    position: 'after_wi_scan',
                    depth: 0,
                    role: 'system',
                    should_scan: false,
                    content: promptContent
                }]);
                console.log('[PKM] ✓ 位置上下文已注入到世界书');
            } else {
                console.warn('[PKM] injectPrompts API 不可用');
            }
        }
        
        // 如果有缓存的位置上下文，重新注入
        function reinjectLocationContext() {
            if (lastLocationContext) {
                doInjectLocationContext(lastLocationContext);
            }
        }
        
        // ========== iframe 初始化 ==========
        let iframeInitialized = false;
        
        // ========== 事件绑定 ==========
        ball.on('click', async function() {
            console.log('[PKM] 打开面板');
            overlay.css('display', 'flex');
            
            if (!iframeInitialized) {
                // 获取 ERA 数据
                console.log('[PKM] 正在获取 ERA 数据...');
                const eraData = await getEraVars();
                
                // 设置 iframe src 并等待加载
                iframe.attr('src', PKM_URL);
                
                iframe.on('load', function() {
                    // 向 iframe 发送 ERA 数据
                    if (eraData && iframe[0].contentWindow) {
                        iframe[0].contentWindow.postMessage({
                            type: 'PKM_ERA_DATA',
                            data: eraData
                        }, '*');
                        console.log('[PKM] ✓ ERA 数据已发送到 iframe');
                    }
                });
                
                iframeInitialized = true;
                console.log('[PKM] iframe 已初始化');
            }
        });
        
        closeBtn.on('click', function(e) {
            e.stopPropagation();
            overlay.css('display', 'none');
        });
        
        overlay.on('click', function(e) {
            if (e.target === overlay[0]) {
                overlay.css('display', 'none');
            }
        });
        
        // ESC 关闭
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && overlay.css('display') !== 'none') {
                overlay.css('display', 'none');
            }
        });
        
        // ========== 刷新函数 ==========
        async function refreshDashboard() {
            if (!iframeInitialized) return;
            
            console.log('[PKM] 刷新面板数据...');
            const eraData = await getEraVars();
            
            if (eraData && iframe[0].contentWindow) {
                iframe[0].contentWindow.postMessage({
                    type: 'PKM_REFRESH',
                    data: eraData
                }, '*');
            }
        }
        
        // ========== 监听酒馆事件 ==========
        if (typeof eventOn !== 'undefined') {
            eventOn('era:writeDone', () => {
                console.log('[PKM] 检测到 ERA 变量更新，刷新面板和位置注入');
                refreshDashboard();
                reinjectLocationContext(); // 重新注入缓存的位置上下文
            });
            
            eventOn('generation_ended', () => {
                console.log('[PKM] 检测到消息生成完成，刷新面板和位置注入');
                refreshDashboard();
                reinjectLocationContext(); // 重新注入缓存的位置上下文
            });
            
            eventOn('chat_changed', () => {
                console.log('[PKM] 检测到对话切换，重置面板');
                iframeInitialized = false;
                reinjectLocationContext(); // 切换对话时也重新注入
            });
        }
        
        // ========== 监听 iframe 的 postMessage 请求 ==========
        window.addEventListener('message', function(event) {
            if (!event.data || !event.data.type) return;
            
            // 处理完整位置上下文注入请求（来自 iframe 的 LocationContextGenerator）
            if (event.data.type === 'PKM_LOCATION_CONTEXT') {
                const { content } = event.data;
                console.log('[PKM] 收到完整位置上下文');
                
                // 缓存位置上下文
                lastLocationContext = content;
                
                // 执行注入
                doInjectLocationContext(content);
            }
            
            // 处理旧格式的位置上下文注入请求（兼容）
            if (event.data.type === 'PKM_INJECT_LOCATION') {
                const { id, content, position, depth } = event.data;
                console.log('[PKM] 收到位置上下文注入请求:', id);
                
                // 缓存位置上下文
                lastLocationContext = content;
                
                // 执行注入
                doInjectLocationContext(content);
            }
            
            // 处理清除注入请求
            if (event.data.type === 'PKM_CLEAR_INJECTION') {
                const { id } = event.data;
                console.log('[PKM] 收到清除注入请求:', id);
                
                try {
                    if (typeof uninjectPrompts === 'function') {
                        uninjectPrompts([id]);
                        console.log('[PKM] ✓ 注入已清除');
                    }
                } catch (e) {
                    console.error('[PKM] 清除注入失败:', e);
                }
            }
        });
        
        console.log('[PKM] ✓ 悬浮球已加载，点击打开 PKM 面板');
    });
})();
