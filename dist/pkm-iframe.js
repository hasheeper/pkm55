/**
 * PKM Dashboard - iframe 隔离版本
 * 悬浮球用 jQuery（已验证成功），面板用 iframe 隔离样式
 */

(function() {
    'use strict';

    console.log('[PKM] 开始加载...');

    $(function() {
        console.log('[PKM] DOM 就绪');

        // 清理旧版本
        $('[id^="pkm-"]').remove();

        /* =========================================================================
           [NEW] PKM 赛博悬浮终端 - Ver. Dawn Style
           Data Link Stick 设计：矩形毛玻璃材质 + Rotom Phone SVG
           ========================================================================= */

        // 0. 注入全局动画样式 (Keyframes for Float & Pulse)
        const animationStyle = `
        <style id="pkm-anim-style">
            @keyframes pkm-float-idle {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
            }
            @keyframes pkm-scan-pulse {
                0%, 100% { filter: drop-shadow(0 0 0 rgba(112, 161, 255, 0)); }
                50% { filter: drop-shadow(0 0 4px rgba(112, 161, 255, 0.4)); }
            }
        </style>
        `;
        if (!$('#pkm-anim-style').length) {
            $('head').append(animationStyle);
        }

        // ========== 悬浮终端容器 ==========
        const container = $('<div>')
            .attr('id', 'pkm-container')
            .css({
                'position': 'fixed',
                'inset': '0',
                'pointer-events': 'none',
                'z-index': 2147483647
            });

        // ========== Data Link Stick (矩形终端设备) ==========
        const ball = $('<div>')
            .attr('id', 'pkm-ball')
            .css({
                'position': 'absolute',
                'top': '80px',
                'right': '15px',
                
                // 形状：垂直手机/手持终端比例
                'width': '44px',
                'height': '66px',
                'border-radius': '12px',
                
                // 材质：Ver. Dawn 标志性的高亮毛玻璃
                'background': 'rgba(255, 255, 255, 0.65)',
                'backdrop-filter': 'blur(6px)',
                '-webkit-backdrop-filter': 'blur(6px)',
                
                // 边框：做出实体厚度感
                'border': '2px solid rgba(255, 255, 255, 0.85)',
                'border-bottom': '4px solid #dfe6e9',
                
                // 阴影：锐利的边缘+柔和的扩散
                'box-shadow': '0 8px 20px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255,255,255,0.2)',
                
                // 布局与交互
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'cursor': 'pointer',
                'pointer-events': 'auto',
                'z-index': 2147483647,
                'user-select': 'none',
                
                // 动画基础属性
                'animation': 'pkm-float-idle 3.5s ease-in-out infinite',
                'transition': 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            });

        // ========== SVG 核心图标 (Rotom Phone Device) ==========
        const rotomSvg = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="32 15 36 70" 
             style="width: 26px; height: auto; fill: #636e72; transition: all 0.3s ease; animation: pkm-scan-pulse 4s infinite;">
           <g>
               <path d="M61,19.9H39c-2.5,0-4.5,2-4.5,4.5v51.3c0,2.5,2,4.5,4.5,4.5h22c2.5,0,4.5-2,4.5-4.5V24.4C65.5,21.9,63.5,19.9,61,19.9z M47.9,24.2h4.3c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5h-4.3c-0.3,0-0.5-0.2-0.5-0.5S47.6,24.2,47.9,24.2z M45.3,24.1 c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5s-0.5-0.2-0.5-0.5S45,24.1,45.3,24.1z M50,78.2c-1.5,0-2.8-1.2-2.8-2.8 c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8C52.8,76.9,51.5,78.2,50,78.2z M63.2,71H36.8V29h26.4V71z"/>
               <path d="M50,58.5c4.7,0,8.5-3.8,8.5-8.5s-3.8-8.5-8.5-8.5s-8.5,3.8-8.5,8.5S45.3,58.5,50,58.5z M50,47.1c1.6,0,2.9,1.3,2.9,2.9 s-1.3,2.9-2.9,2.9s-2.9-1.3-2.9-2.9S48.4,47.1,50,47.1z M42.6,50h2.8c0,0,0,0,0,0c0,2.6,2.1,4.6,4.6,4.6c2.6,0,4.6-2.1,4.6-4.6 c0,0,0,0,0,0h2.8c0,0,0,0,0,0c0,4.1-3.3,7.4-7.4,7.4C45.9,57.4,42.6,54.1,42.6,50C42.6,50,42.6,50,42.6,50z"/>
           </g>
        </svg>
        `;

        ball.html(rotomSvg);

        // ========== 交互动画逻辑 (Hover Effects) ==========
        ball.hover(
            // Mouse Enter
            function() {
                $(this).css({
                    'transform': 'scale(1.08) translateY(-2px)',
                    'background': 'rgba(255, 255, 255, 0.95)',
                    'border-bottom-color': '#70a1ff',
                    'box-shadow': '0 12px 28px rgba(112, 161, 255, 0.25), 0 0 0 1px rgba(112, 161, 255, 0.3)',
                    'animation': 'none'
                });
                
                $(this).find('svg').css({
                    'fill': '#0984e3',
                    'filter': 'drop-shadow(0 0 3px rgba(9, 132, 227, 0.5))'
                });
            },
            // Mouse Leave
            function() {
                $(this).css({
                    'transform': 'scale(1) translateY(0)',
                    'background': 'rgba(255, 255, 255, 0.65)',
                    'border-bottom-color': '#dfe6e9',
                    'box-shadow': '0 8px 20px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255,255,255,0.2)',
                    'animation': 'pkm-float-idle 3.5s ease-in-out infinite'
                });
                
                $(this).find('svg').css({
                    'fill': '#636e72',
                    'filter': 'none'
                });
            }
        );

        // ========== 面板覆盖层 ==========
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

        // ========== 布局包装层 (用于让关闭按钮永远吸附在面板上) ==========
        const contentWrapper = $('<div>')
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

        // ========== iframe 面板（完全隔离样式）==========
        const iframe = $('<iframe>')
            .attr('id', 'pkm-iframe')
            .css({
                'width': '100%',
                'height': '100%',
                'border': 'none',
                'border-radius': '24px',
                'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
                'background': '#f2f4f8',
                'overflow': 'hidden',
                'mask-image': 'radial-gradient(white, black)'
            });

        // ========== 现代化的关闭按钮 ==========
        const closeIconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;

        const closeBtn = $('<div>')
            .attr('id', 'pkm-close')
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
                'border': 'none',
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

        contentWrapper.append(iframe).append(closeBtn);
        overlay.empty().append(contentWrapper);
        container.append(ball).append(overlay);
        $('body').append(container);

        console.log('[PKM] 悬浮球已添加');

        // ========== iframe 内容 ==========
        const iframeContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,700;1,900&family=M+PLUS+Rounded+1c:wght@500;800;900&display=swap" rel="stylesheet">
    <style>
.evs-group {
    flex-shrink: 0;
    gap: 8px;
    margin-left: 10px;
}

.tile-party::before {
    content: '';
    position: absolute;
    left: 0;
    top: 15%;
    bottom: 15%;
    width: 4px;
    background: #ff4757;
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 0 8px rgba(255, 71, 87, 0.4);
    opacity: 0.8;
}

/* =========================================
   Unit Header Strip (队伍状态条 - 改良版)
   ========================================= */
.team-header-dash {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 15px 5px 8px 5px;
    margin: -20px 0 10px 0;
    transform: skewX(var(--s-deg));
    border-bottom: 2px dashed rgba(178, 190, 195, 0.3);
}

.th-title {
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 1.1rem;
    font-style: italic;
    color: #c8d0d8;
    letter-spacing: 0.5px;
    transform: skewX(var(--ns-deg));
    line-height: 1;
    position: relative;
    padding-left: 12px;
}

.th-title::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 8px;
    width: 6px;
    height: 6px;
    background: #ffb3b0;
    box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
    transform: skewX(-6deg);
}

.th-status-grp {
    display: flex;
    align-items: center;
    gap: 15px;
    transform: skewX(var(--ns-deg));
}

.th-count {
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 1.2rem;
    color: #2d3436;
    line-height: 0.9;
}
.th-count small {
    color: #b2bec3;
    font-size: 0.95rem;
    font-weight: 600;
    margin-left: 1px;
}

.th-slots-viz {
    display: flex;
    gap: 3px;
    align-items: center;
    height: 100%;
}

.th-dot {
    width: 8px;
    height: 14px;
    background: #dfe4ea;
    transform: skewX(-15deg);
    border-radius: 2px;
    transition: all 0.3s;
}
.th-dot.active {
    background: #7db8ff;
    height: 18px;
}

/* =========================================
   Gender Indicators (性别符号)
   ========================================= */
.gender-mark {
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
    font-size: 0.9em;
    font-weight: 700;
    letter-spacing: -0.5px;
    font-family: ui-sans-serif, system-ui, sans-serif;
    opacity: 1;
}
.gender-mark.male {
    color: #8ecbff;
    text-shadow: 0 0 2px rgba(142, 203, 255, 0.45);
}
.gender-mark.female {
    color: #ff9eb1;
    text-shadow: 0 0 2px rgba(255, 158, 177, 0.45);
}
.gender-mark.neutral {
    color: #b2bec3;
    opacity: 0.7;
}
.shiny-mark {
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
    font-size: 0.9rem;
    color: #ffd86b;
    text-shadow: 0 0 4px rgba(255, 216, 107, 0.5);
}
/* =========================================
   全局基础 (Global)
   ========================================= */
:root {
    --s-deg: -10deg;
    --ns-deg: 10deg;
    
    --r-frame: 24px;
    --r-item: 8px;

    /* 基础调色 */
    --c-bg: #f2f4f8; --c-frame: #ffffff;
    --c-text: #2d3436; --c-gray: #b2bec3;
    --c-pink: #ff6b81; --c-blue: #70a1ff;

    --font-ui: 'Exo 2', 'Noto Sans SC', sans-serif;
    --font-txt: 'M PLUS Rounded 1c', sans-serif;
}

body { 
    margin: 0; padding: 0; 
    background: transparent;  /* 关键：确保不和酒馆UI撞色 */
    width: 100vw; height: 100vh;
    overflow: hidden; 
    font-family: var(--font-txt); color: var(--c-text); 
    background-color: #333; /* 开发用深底 */
}

/* =========================================
   1. 外部框架 (Frame) 【重点修复】
   ========================================= */
.ver-dawn-frame {
    position: relative; 
    margin: 0 auto;
    
    /* [Core Fix] 确容器拥有固定比例，不再忽大忽小 */
    width: 100%; 
    height: 100%; 
    max-width: 480px; 
    
    /* 解决内部被挤压崩溃的问题：使用 Flex 列布局 */
    display: flex; 
    flex-direction: column;
    
    /* 容器是垂直回正的矩形 */
    background-color: var(--c-bg);
    border-radius: var(--r-frame);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.5);
    
    /* [Key Fix] 之前设置 hidden 导致把斜着飞出去的尖角切了
       应该在这里允许一点溢出，或者必须在子容器加Padding 
       如果您是在 Webview 使用，建议保持 overflow: hidden 以维持圆角；
       所以修复点在下面的 .main-viewport */
    overflow: hidden;
}


/* 导航栏 - Dashboard模式下隐藏 */
.nav-wrap {
    flex-shrink: 0; /* 禁止被挤压 */
    background: var(--c-frame); padding: 0 16px 15px 16px;
    margin-bottom: 5px; display: none; gap: 8px; position:relative; z-index:15;
    box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05);
}
.tab {
    flex: 1; height: 36px; cursor: pointer;
    transform: skewX(var(--s-deg)); 
    border: 2px solid #ebedf0; border-radius: 6px; background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: 0.2s;
    min-width: 0; /* 允许收缩 */
}
.t-txt { 
    transform: skewX(var(--ns-deg)); 
    font-family: var(--font-ui); 
    font-weight: 800; 
    color: #b2bec3; 
    font-size: 0.65rem;
    letter-spacing: 0.5px;
}
.tab.active { background: var(--c-text); border-color: var(--c-text); color: #fff; box-shadow: 3px 3px 0 rgba(70,70,70,0.1); }
.tab.active .t-txt { color: #fff; }
.tab[data-t="soc"].active { background: var(--c-pink); border-color: var(--c-pink); }
.tab[data-t="box"].active { background: #00b894; border-color: #00b894; border-width: 1px; }

/* =========================================
   2. 主视口 (Viewport) 【崩坏修复点】
   ========================================= */
.main-viewport {
    /* 使用 flex: 1 自动填满剩下全部高度 */
    flex: 1; 
    width: 100%; 
    position: relative; 
    background: transparent;
    
    /* 
       [CRITICAL FIX 3.0] 
       1. 内边距 padding-left/right: 25px -> 保证斜切的卡片左右都不会贴边被切
       2. padding-top: 15px -> 给上方卡片悬停上浮留出空间
       3. padding-bottom -> 留白底部 
    */
    padding: 15px 25px 40px 25px; 
    
    /* 确保 Padding 挤压的是内容，而不是增加宽度 */
    box-sizing: border-box;
    
    /* 仅允许纵向滚动 (Scroll) */
    overflow-y: auto; 
    /* 横向必须 Hidden 防止出现横条 */
    overflow-x: hidden;
    
    /* 提升层级，防止被 nav 阴影遮挡 */
    z-index: 10;
    
    /* 滚动条隐藏Hack */
    -ms-overflow-style: none; scrollbar-width: none;
}
.main-viewport::-webkit-scrollbar { display: none; }

/* 页面切换动画 */
.page { 
    display: none !important; 
    flex-direction: column; 
    gap: 15px; 
    width: 100%; 
    min-height: 100%; 
    position: relative; /* 确保返回按钮定位正确 */
}
.page.curr { 
    display: grid !important; 
    grid-template-columns: 1fr; 
    gap: 15px; 
    animation: fadeUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
@keyframes fadeUp { from {opacity:0; transform:translateY(15px);} to {opacity:1; transform:translateY(0);} }

/* =========================================
   3. 卡片 (Content Card)
   ========================================= */
.dash-card-box {
    width: 100%;
    height: 100px;
    background: white;
    transform: skewX(var(--s-deg));
    box-sizing: border-box;
    border-radius: var(--r-item);
    box-shadow: 4px 4px 0 #ebedf0;
    border: 1px solid #ebedf0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    margin: 0;
}

/* 交互悬浮 (恢复上浮) */
.dash-card-box:hover {
    transform: skewX(var(--s-deg)) translateY(-4px);
    box-shadow: 6px 8px 0 #d1d8e0;
    border-color: var(--c-blue);
    z-index: 10;
}

.dcb-inner {
    width: 100%;
    transform: skewX(var(--ns-deg));
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ph-lbl { font-family: var(--font-ui); font-weight: 800; color: #dfe6e9; font-size: 2rem; user-select: none; }
.ph-sub { font-size: 0.6rem; font-weight: 700; color: #b2bec3; letter-spacing: 1px; margin-top: -5px; user-select: none; }

.section-label { font-size: 0.65rem; color: #b2bec3; font-weight: 800; margin: 0 0 2px 20px; letter-spacing: 1px; }
.dash-card-box.npc:hover { border-color: var(--c-pink); box-shadow: 6px 8px 0 rgba(253, 121, 168, 0.3); }

/* =================================
   Ver. Dawn - 宝可梦数据卡 (Style R)
   ================================= */

.dash-card-box {
    height: auto;
    min-height: 90px;
    align-items: stretch;
    padding: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: #fff;
    overflow: hidden;
}

.dcb-inner {
    width: 100%;
    height: 100%;
    transform: skewX(var(--ns-deg));
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
}
.dcb-inner::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: -20px;
    width: 140px;
    background: linear-gradient(90deg, transparent 0%, rgba(20,20,30,0.03) 1%, #f7f9fb 1%);
    transform: skewX(-20deg);
    z-index: -1;
    pointer-events: none;
    border-left: 2px solid rgba(255,255,255,0.8);
}

.pkm-summary {
    height: 90px;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 25px;
    box-sizing: border-box;
    background: transparent;
    cursor: pointer;
}

.pkm-summary::before {
    content: attr(data-slot);
    position: absolute;
    right: 25px;
    bottom: -18px;
    font-size: 5rem; font-weight: 900;
    font-family: var(--font-ui); font-style: italic;
    color: #eff2f5;
    pointer-events: none;
    z-index: -1;
}

.p-visual-grp {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 15px;
}

.p-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 84px;
    height: 84px;
    transform: translateY(-14px);
}

.p-avatar img {
    width: 84px;
    height: 84px;
    object-fit: contain;
    filter: drop-shadow(4px 6px 0 rgba(223, 230, 233, 0.5));
    transition: 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.p-avatar img.pixel-fallback {
    filter: none;
    image-rendering: pixelated;
    opacity: 0.85;
    width: 64px;
    height: 64px;
    margin-top: 36px;
}
.p-avatar img.regional-sprite {
    transform: translateY(20px);
}
.dash-card-box:hover .p-avatar img { transform: scale(1.1) rotate(5deg); }
.dash-card-box:hover .p-avatar img.regional-sprite { transform: translateY(20px) scale(1.1) rotate(5deg); }

.p-texts {
    display: flex; flex-direction: column;
    line-height: 1; transform: translateY(2px);
}

.p-meta-line {
    display: flex; align-items: baseline; gap: 6px;
    font-family: var(--font-ui);
    color: #b2bec3; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;
}
.p-lv-val { color: var(--c-text); font-size: 0.9rem; }

.p-name {
    font-size: 1.6rem; font-weight: 900; color: #2d3436;
    letter-spacing: -1px; margin-top: 2px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.summary-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    height: 100%;
    gap: 4px;
    position: relative;
}

.expand-action {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 100%;
    margin-right: -10px;
    color: #e2e6ea;
    transition: all 0.3s;
    z-index: 2;
}
.expand-action svg { 
    stroke-width: 4; 
    width: 18px; 
    filter: drop-shadow(1px 1px 0 #fff);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dash-card-box.open .expand-action svg {
    transform: rotate(180deg);
}

.pkm-details {
    display: grid !important;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    width: 90%;
    position: relative;
    z-index: 2;
    background: transparent;
}

.dash-card-box.open .pkm-details {
    grid-template-rows: 1fr;
    background-image: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 100%, transparent 100%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top left;
}

.details-overflow {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* ========================================================
   Ver. Dawn - HUD System [Refined]
   ======================================================== */
.detail-padder.tech-mode {
    padding: 0 16px 20px 16px !important;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 280px;
    box-sizing: border-box;
    cursor: default;
    transform: translateY(-15px);
    opacity: 0;
    transition: all 0.3s ease;
}
.dash-card-box.open .detail-padder.tech-mode {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
}

.top-rail {
    display: flex;
    align-items: center;
    height: 36px;
    gap: 10px;
    margin-bottom: 20px;
    position: relative;
    border-bottom: none;
}
.element-grp {
    display: flex;
    gap: 4px;
    margin-right: auto;
}
.type-mini {
    transform: skewX(-15deg);
    padding: 2px 12px;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 900;
    color: #fff;
    font-family: var(--font-ui);
    text-transform: uppercase;
    box-shadow: 2px 3px 6px rgba(0,0,0,0.15);
    line-height: 1.4;
}
.type-mini span {
    display: block;
    transform: skewX(15deg);
}

.meta-chips {
    display: flex;
    gap: 6px;
    align-items: center;
}
.m-tag {
    transform: skewX(-15deg);
    padding: 3px 12px;
    border-radius: 2px;
    font-size: 0.65rem;
    font-weight: 900;
    font-family: var(--font-ui);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
}
.m-tag span {
    transform: skewX(15deg);
}
.m-tag.nature {
    background: #fff;
    box-shadow: 2px 2px 0 var(--prim-color);
    border: 1px solid #f1f2f6;
    color: var(--prim-color);
}
.m-tag.ability {
    background: #e1e7ec;
    color: #2d3436;
    box-shadow: 2px 2px 0 #cfd6db;
}

.item-box {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: #f1f2f6;
    box-shadow: inset 0 0 0 1px #fff, 2px 2px 0 #d1d8e0;
    border-radius: 4px;
    transform: skewX(-15deg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: transform 0.2s;
    overflow: hidden;
}
.item-box img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transform: skewX(15deg);
    image-rendering: -webkit-optimize-contrast;
}
.item-box:hover {
    transform: skewX(-15deg) translateY(-2px);
    z-index: 10;
    background: #fff;
}
.item-box:hover::after {
    content: attr(data-name);
    position: absolute;
    bottom: -28px;
    right: -5px;
    background: #2d3436;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.6rem;
    font-weight: 700;
    white-space: nowrap;
    z-index: 20;
    transform: skewX(15deg);
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.kinetic-moves {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 10px;
    margin: 15px 0;
    width: 100%;
    min-width: 100%;
    height: 120px;
    box-sizing: border-box;
}
.k-move-shell {
    position: relative;
    transform: skewX(-15deg);
    border-radius: 3px;
    background: #2d3436;
    border-left: 8px solid var(--bar-c, var(--prim-color, #ff6b6b));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0 rgba(70,70,70,0.15);
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding: 6px 10px;
    min-height: 36px;
    width: 100%;
    box-sizing: border-box;
}
.k-move-shell span {
    transform: skewX(15deg);
    color: #fff;
    font-family: var(--font-txt);
    font-weight: 900;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 2px 0 rgba(0,0,0,0.2);
    width: 100%;
    padding: 0 5px;
    text-align: center;
}
.k-move-shell.empty {
    background: transparent;
    border: 2px dashed rgba(255,255,255,0.2);
    border-left: 8px solid rgba(255,255,255,0.15);
    box-shadow: none;
}
.k-move-shell.empty span {
    color: rgba(255,255,255,0.3);
}
.k-move-shell:hover {
    background: var(--prim-color, #ff6b6b);
    transform: skewX(-15deg) scale(1.05) translateY(-3px);
    z-index: 10;
    box-shadow: 6px 8px 12px rgba(0,0,0,0.2);
}

.bot-stat-strip {
    margin-top: auto;
    background: #f1f3f5;
    border: 1px solid #ebedf0;
    padding: 6px 10px;
    margin-bottom: 2px;
    transform: skewX(-15deg);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    box-shadow: inset 0 1px 0 #fff;
    width: 100%;
    box-sizing: border-box;
}
.ivs-group,
.evs-group {
    transform: skewX(15deg);
    display: flex;
    align-items: center;
    gap: 8px;
}
.ivs-group {
    flex: 1;
    white-space: nowrap;
}
.micro-lbl {
    font-size: 0.55rem;
    font-weight: 800;
    color: #b2bec3;
    font-family: var(--font-ui);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1px;
}
.hex-chips {
    display: inline-flex;
    gap: 3px;
}
.chip-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 24px;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #dfe4ea;
    font-family: var(--font-ui);
    font-size: 0.7rem;
    font-weight: 700;
    color: #636e72;
    line-height: 0.9;
    position: relative;
    cursor: default;
    transition: 0.2s;
}
.chip-cell::before {
    content: attr(data-stat);
    font-size: 0.45rem;
    font-weight: 900;
    color: #b2bec3;
    margin-bottom: 1px;
}
.chip-cell.max {
    border-color: rgba(0,0,0,0.1);
    color: var(--prim-color, #2d3436);
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.chip-cell.max::before {
    color: var(--prim-color, #b2bec3);
    opacity: 0.6;
}
.chip-cell:hover {
    transform: translateY(-2px);
    border-color: var(--prim-color, #2d3436);
    z-index: 5;
}
.evs-group .evs-val {
    font-family: var(--font-txt);
    font-size: 0.85rem;
    font-weight: 900;
    color: var(--sec-color, #70a1ff);
    letter-spacing: -0.5px;
    background: #fff;
    padding: 0 6px;
    border-radius: 3px;
    border: 1px solid #ebedf0;
}

/* =========================================
   Empty Slot Styling (Ultra Flat & Light)
   极致轻量化：无内衬线、浅灰字、极淡背景
   ========================================= */

.dash-card-box.empty {
    position: relative;
    border: 2px dashed #dcdde1; 
    background-color: rgba(245, 246, 250, 0.4); 
    background-image: none !important; 
    box-shadow: none !important;
    opacity: 1; 
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease-out;
}

.dash-card-box.empty::before,
.dash-card-box.empty::after,
.dash-card-box.empty .dcb-inner::before,
.dash-card-box.empty .dcb-inner::after {
    display: none !important;
    content: none !important;
    border: none !important;
    background: none !important;
}

.dash-card-box.empty .dcb-inner {
    height: 100%;
    display: flex;
    justify-content: center; 
    align-items: center;  
    z-index: 2;
}

.empty-placeholder {
    background: transparent;
    border: none;
    padding: 0;
    font-family: var(--font-ui);
    font-weight: 800;         
    font-size: 1.4rem;        
    color: #dfe4ea;           
    letter-spacing: 1px;
    text-transform: uppercase;
    transform: skewX(15deg);  
    text-shadow: none; 
    font-style: italic;
    opacity: 1;
    transition: color 0.2s;
}
.nb-icon-img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    image-rendering: pixelated;
    image-rendering: -webkit-optimize-contrast;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
}

.dash-card-box.empty:hover {
    border-color: #a4b0be; 
    background-color: #fff;
    border-style: dashed;
    transform: skewX(var(--s-deg)); 
    box-shadow: none; 
}

.dash-card-box.empty:hover .empty-placeholder {
    color: #a4b0be;
}

/* =========================================
   4. 战术弹药 (Mech Bar) [悬浮修正版]
   ========================================= */
.mech-wrapper { 
    position: relative;
    display: flex; 
    align-items: center; 
    justify-content: flex-end;
    gap: 8px;
    height: 36px; 
}

.mech-btn {
    position: relative;
    z-index: 60;
    width: 20px;
    height: 32px;
    flex-shrink: 0;
    background: #dfe4ea;
    color: #636e72;
    border-radius: 4px; 
    border: none;
    transform: skewX(-15deg); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: 0.2s ease;
    box-shadow: 1px 1px 0 rgba(0,0,0,0.1); 
}
.mech-btn:hover { background: #ced6e0; color: #2d3436; }
.mech-btn svg {
    width: 22px; height: 22px;
    transform: skewX(15deg) scale(1.8);
    transition: transform 0.3s;
    stroke-width: 4.5;
}
.mech-btn.open {
    background: transparent;
    color: #ff8fa1;
    border: 2px solid #ff8fa1;
    width: 24px;
    transform: skewX(-15deg) translateY(1px);
    box-shadow: none;
}
.mech-btn.open svg { transform: skewX(15deg) scale(1.8) rotate(180deg); }

.mech-matrix.icon-mode {
    position: absolute;
    right: 32px;
    top: 50%;
    transform: translate(0, -50%) skewX(-15deg);
    display: flex; 
    align-items: center; 
    flex-wrap: nowrap;
    padding: 0;
    gap: 2px;
    background: transparent;
    border-radius: 8px; 
    z-index: 55;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
}
.mech-matrix.icon-mode.expanded {
    pointer-events: auto;
}

.mech-matrix.icon-mode .cell {
    width: 8px;
    height: 32px;
    background: #e2e6ea; 
    border-radius: 2px;
    transform: skewX(0deg); 
    margin-right: 2px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    color: transparent;
}
.mech-matrix.icon-mode .cell:not(.active):hover { cursor: default; }

.mech-matrix.icon-mode .cell.active {
    opacity: 1;
    background: var(--c-lite);
    box-shadow: inset 0 -4px 0 0 var(--bar-color);
}
.mech-matrix.icon-mode .cell svg {
    opacity: 0; 
    transform: skewX(15deg) scale(0.5);
    transition: opacity 0.2s, transform 0.3s;
}
.mech-matrix.icon-mode .cell[data-mech="mega"] svg,
.mech-matrix.icon-mode .cell[data-mech="style"] svg {
    transform: skewX(15deg) scale(0.5) translateY(2px);
}

.mech-matrix.icon-mode.expanded {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    padding: 6px 10px;
    right: 32px;
    transform: translate(0, -50%) skewX(-15deg);
}

.mech-matrix.icon-mode.expanded .cell {
    width: 32px;
    border-radius: 6px; 
    background: transparent;
    opacity: 0.5;
    margin-right: 0;
    transform: none;
}
.mech-matrix.icon-mode.expanded .cell svg {
    opacity: 1;
    color: #b2bec3;
    transform: skewX(15deg) scale(1.0);
    transition-delay: 0.1s;
}
.mech-matrix.icon-mode.expanded .cell[data-mech="mega"] svg,
.mech-matrix.icon-mode.expanded .cell[data-mech="style"] svg {
    transform: skewX(15deg) scale(1.0) translateY(2px);
}
.mech-matrix.icon-mode.expanded .cell.active {
    background: transparent;
    box-shadow: none;
    opacity: 1;
}
.mech-matrix.icon-mode.expanded .cell.active svg { color: var(--bar-color); }
.mech-matrix.icon-mode.expanded .cell.active:hover { 
    transform: translateY(-3px);
    filter: brightness(1.05); 
}

.cell[data-mech="mega"]  { --bar-color: #6c5ce7; --c-lite: #efeafa; }
.cell[data-mech="z"]     { --bar-color: #f1c40f; --c-lite: #fcf6d6; }
.cell[data-mech="dmax"]  { --bar-color: #e84393; --c-lite: #fbebf4; }
.cell[data-mech="tera"]  { --bar-color: #00cec9; --c-lite: #dcfbfb; }
.cell[data-mech="bond"]  { --bar-color: #2ecc71; --c-lite: #e4fbf0; }
.cell[data-mech="style"] { --bar-color: #d63031; --c-lite: #fae3e3; }
.cell[data-mech="eye"]   { --bar-color: #636e72; --c-lite: #f1f2f6; }
.cell[data-mech="cap"]   { --bar-color: #e67e22; --c-lite: #fdebd0; }

/* =========================================
   AVS UI Upgrade (美化后的仪表板)
   ========================================= */
.avs-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 100%;
    margin-right: -2px;
    margin-top: -6px;
    color: #b2bec3;
    cursor: pointer;
    z-index: 35;
    transition: all 0.3s;
    align-self: flex-start;
}
.avs-action svg {
    width: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    transition: all 0.3s cubic-bezier(0.34, 1.6, 0.64, 1);
    filter: drop-shadow(0 0 0 transparent);
}
.avs-action:hover {
    color: #ff6b81;
    transform: translateY(-2px);
}
.avs-action:hover svg {
    fill: rgba(255, 107, 129, 0.2);
}
.avs-action.active {
    color: #ff6b81;
}
.avs-action.active svg {
    fill: #ff6b81;
    transform: scale(1.15);
    filter: drop-shadow(0 2px 5px rgba(255,107,129,0.5));
}

.avs-dashboard {
    position: absolute;
    left: 85px;
    right: 50px;
    top: 50%;
    height: 52px;
    transform: translateY(-32%) translateX(-8px) skewX(var(--s-deg));
    transform-origin: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid #fff;
    border-bottom: 2px solid #ebedf0;
    border-radius: 4px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1);
    z-index: 20;
    display: flex;
    pointer-events: none;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.avs-dashboard.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(-32%) translateX(-8px) skewX(var(--s-deg));
}
.avs-stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: skewX(var(--ns-deg));
    border-right: 1px dashed rgba(0,0,0,0.1);
}
.avs-stat-item:last-child {
    border-right: none;
}
.avs-stat-item::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 8px;
    right: 8px;
    height: 3px;
    background: currentColor;
    border-radius: 0 0 2px 2px;
    box-shadow: 0 1px 3px currentColor;
    opacity: 0.8;
}
.asi-label {
    font-size: 0.45rem;
    font-weight: 900;
    color: #b2bec3;
    letter-spacing: 0.5px;
    margin-bottom: 1px;
}
.asi-val {
    font-family: var(--font-ui);
    font-style: italic;
    font-weight: 800;
    font-size: 1.05rem;
    line-height: 0.9;
    color: #2d3436;
}
.asi-stat-trust    { color: #feca57; }
.asi-stat-passion  { color: #ff6b6b; }
.asi-stat-insight  { color: #54a0ff; }
.asi-stat-devotion { color: #a55eea; }
.asi-stat-trust .asi-val    { color: #f1c40f; }
.asi-stat-passion .asi-val  { color: #e55039; }
.asi-stat-insight .asi-val  { color: #4a90e2; }
.asi-stat-devotion .asi-val { color: #8e44ad; }

/* =========================================
   SOCIAL GRID SYSTEM (NPC 关系网)
   ========================================= */
#social-grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
    padding: 10px 0 50px 0;
}

.npc-card {
    position: relative;
    height: 180px;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #ebedf0;
    border-bottom: 4px solid var(--r-color);
    box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.npc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.12);
    z-index: 5;
}

.npc-portrait {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, #f5f6fa 0%, #dcdde1 100%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
}
.npc-portrait img {
    height: 85%;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
    transition: transform 0.3s ease;
}
.npc-card:hover .npc-portrait img {
    transform: scale(1.08);
}

.npc-info-shade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 68px;
    background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.98) 100%);
    backdrop-filter: blur(3px);
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-top: 1px solid rgba(255,255,255,0.6);
}

.n-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.n-name {
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 0.95rem;
    text-transform: uppercase;
    color: #2d3436;
}
.n-stage-icon {
    font-size: 0.85rem;
}

.n-bar-box {
    margin-top: 4px;
    width: 100%;
    position: relative;
}
.n-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.55rem;
    font-weight: 700;
    color: #636e72;
    text-transform: uppercase;
    letter-spacing: 0.6px;
}
.progress-track {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    margin-top: 2px;
    background: #dfe6e9;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--r-color);
    transition: width 0.3s ease;
}

.npc-card[data-stage="-2"] .npc-portrait {
    filter: grayscale(100%) contrast(1.2);
    background: repeating-linear-gradient(45deg, #2d3436, #2d3436 10px, #353b48 10px, #353b48 20px);
}
.npc-card[data-stage="4"] .npc-info-shade {
    background: linear-gradient(180deg, transparent 0%, rgba(255,245,210,0.9) 60%, rgba(255,245,210,1) 100%);
}

/* =========================================
   NPC 特殊羁绊 Badge (右上角图标)
   ========================================= */
.npc-bond-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;
    border-radius: 4px;
    font-size: 1.1rem;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.npc-bond-badge .nb-bg {
    display: none;
}
.npc-bond-badge.locked {
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 50%;
    filter: grayscale(100%) opacity(0.75);
    color: #fff;
    transform: scale(0.9);
}
.npc-bond-badge.locked .nb-icon {
    opacity: 0.55;
    filter: blur(0.4px);
}
.npc-bond-badge.unlocked {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(4px);
    border: 1px solid #fff;
    border-radius: 6px;
    box-shadow:
        0 2px 8px rgba(0,0,0,0.12),
        inset 0 0 10px rgba(255,255,255,0.35),
        0 0 10px rgba(255,223,0,0.35);
    animation: badgeFloat 3s ease-in-out infinite;
}
.npc-bond-badge.unlocked .nb-bg {
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 70%);
    opacity: 0.4;
}
.npc-bond-badge:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255,255,255,0.5);
    background: #fff;
    color: #2d3436;
}
@keyframes badgeFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}

/* =========================================
   [NEW] LEADER SYSTEM STYLES
   ========================================= */

.dash-card-box.is-leader {
    border-color: #f1c40f;
    box-shadow: 4px 4px 0 rgba(241, 196, 15, 0.3);
}
.dash-card-box.is-leader:hover {
    border-color: #f39c12;
    box-shadow: 6px 8px 0 rgba(243, 156, 18, 0.4);
}

.lead-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 14px;
    padding: 0 4px;
    transform: skewX(-6deg);
    background: #f1c40f;
    border-radius: 2px;
    margin-left: 6px;
    box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
}
.lead-text {
    transform: skewX(6deg);
    font-size: 0.6rem;
    font-weight: 900;
    color: #fff;
    line-height: 1;
    letter-spacing: 0.5px;
}

.leader-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 100%;
    margin-right: 0;
    color: #b2bec3;
    cursor: pointer;
    z-index: 36;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.leader-action svg {
    width: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: inherit;
    transform: skewX(5deg);
}

.leader-action:not(.active):hover {
    color: #70a1ff;
    transform: scale(1.1);
}

.leader-action.active {
    color: #f1c40f;
    cursor: default;
    filter: drop-shadow(0 0 3px rgba(241, 196, 15, 0.5));
}
.leader-action.active svg {
    fill: #f1c40f;
    transform: skewX(0deg) scale(1.1) translateY(-1px);
}

/* =========================================
   Z-Index Layer Patch (图层与层级修正)
   确保展开的 AVS 仪表盘盖住下面的功能图标
   ========================================= */
.avs-dashboard {
    z-index: 40 !important;
}
.leader-action {
    z-index: 20;
    position: relative;
}
.avs-action {
    z-index: 60;
    position: relative;
}
.lead-tag {
    z-index: 25;
    position: relative;
}

/* =========================================
   SYS.CONFIG PAGE STYLES
   ========================================= */

/* 设置项卡片容器 */
.config-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* 单个设置条目：类似战术卡片的扁平化设计 */
.cfg-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    background: #fff;
    border: 1px solid #ebedf0;
    border-radius: 6px; /* 使用稍小的圆角 */
    padding: 0 24px;
    transform: skewX(var(--s-deg)); /* 核心倾斜风格 */
    box-shadow: 2px 3px 0 rgba(0,0,0,0.03);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    overflow: hidden;
}

/* 装饰左侧的色条 */
.cfg-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 6px;
    background: var(--cfg-color, #b2bec3);
    transition: background 0.3s;
}

.cfg-card:hover {
    transform: skewX(var(--s-deg)) translateX(4px);
    box-shadow: 4px 6px 12px rgba(0,0,0,0.08);
    border-color: var(--cfg-color, #c8d6e5);
}

/* 左侧文字信息 */
.cfg-info {
    display: flex;
    flex-direction: column;
    transform: skewX(var(--ns-deg)); /* 文字回正 */
    gap: 4px;
}
.cfg-label {
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 1.1rem;
    color: #2d3436;
    letter-spacing: -0.5px;
    text-transform: uppercase;
}
.cfg-desc {
    font-size: 0.7rem;
    font-weight: 600;
    color: #b2bec3;
    font-family: var(--font-txt);
}

/* 右侧自定义开关 (Mechanical Toggle) */
.tgl-track {
    width: 56px;
    height: 28px;
    background: #e2e6ea;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    transform: skewX(var(--ns-deg)); /* 回正，但也保持一定的硬朗感 */
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s;
    border: 1px solid transparent;
}

/* 滑块按钮 */
.tgl-thumb {
    position: absolute;
    top: 2px; bottom: 2px;
    left: 2px; 
    width: 24px;
    background: #fff;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
    border-radius: 1px;
    transition: all 0.3s cubic-bezier(0.5, 1.6, 0.4, 0.7);
    display: flex; 
    align-items: center; justify-content: center;
}
/* 滑块上的小装饰 */
.tgl-thumb::after {
    content: '';
    width: 4px; height: 12px;
    border-left: 2px solid #ebedf0;
    border-right: 2px solid #ebedf0;
}

/* 激活状态 */
.tgl-track.active {
    background: var(--cfg-color); /* 跟随主题色 */
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.2);
}
.tgl-track.active .tgl-thumb {
    transform: translateX(26px); /* 移动滑块 */
    box-shadow: -1px 1px 3px rgba(0,0,0,0.2);
}
/* 用装饰线表示“通电”状态 */
.cfg-card.active::after {
    content: '';
    position: absolute;
    right: 15px; top: -10px; bottom: -10px;
    width: 80px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transform: rotate(20deg);
    opacity: 0;
    pointer-events: none;
    animation: sheen 3s infinite ease-in-out;
}
.cfg-card.active {
    background: linear-gradient(90deg, #fff 40%, rgba(255,255,255,0.5) 100%);
}

@keyframes sheen {
    0% { transform: translateX(-100px) skewX(-20deg); opacity: 0; }
    20% { opacity: 0.5; }
    100% { transform: translateX(200px) skewX(-20deg); opacity: 0; }
}

/* Config page layout adjustments */
#pg-settings .team-header-dash {
    margin-top: -25px;
    margin-bottom: 10px;
    position: relative;
    z-index: 5;
}

#pg-settings .config-grid {
    margin-top: -5px;
    gap: 15px;
}

/* =========================================
   修正补丁 Ver 2.0 (强制顶部对齐)
   解决内容过短时页面垂直被撑开的问题
   ========================================= */

/* 1. 强制页面只要是 Grid 模式，内容必须顶格排列，不允许垂直分散 */
.page.curr {
    align-content: start !important;
}

/* 2. 针对设置(Config)页面做特殊的大幅上移 */
#pg-settings,
#pg-settings.page.curr {
    grid-template-rows: max-content max-content;
    align-items: start !important;
    justify-items: stretch !important;
    margin-top: -8px !important;
}

#pg-settings .team-header-dash {
    margin-top: 12px !important;
    margin-bottom: 10px !important;
    padding-top: 0 !important;
}

#pg-settings .config-grid {
    margin-top: 0 !important;
}

/* 3. 头部层级补丁 */
.header-section {
    z-index: 50;
}

/* =========================================
   [ADDON] BOX SYSTEM (PC / Storage) v3.0 FIXED
   空间传输协议终端界面 - 修复布局与动效
   ========================================= */

/* 页面容器微调 */
#pg-box {
    padding-bottom: 90px; /* 给底部悬浮操作栏留出更多空间 */
    align-content: start;
}

/* 分区标题栏 */
.box-header-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-left: 20px;
    border-left: 4px solid var(--accent-color, #a29bfe);
    transform: skewX(var(--s-deg));
}
.box-header-strip.storage-green {
    border-left-color: #00b894;
}
.box-header-title {
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 0.95rem;
    color: #636e72;
    transform: skewX(var(--ns-deg));
}
.box-header-meta {
    font-size: 0.7rem;
    color: #b2bec3;
    font-weight: 700;
    transform: skewX(var(--ns-deg));
}

/* =========================================
   [REMASTERED v3.1] CLOUD STORAGE & CELLS
   Tech-Green Grid + Dot Matrix Hover Effect
   ========================================= */

/* --- 1. UPPER AREA: 当前队伍 (Hand Party) --- */
.box-party-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    gap: 10px;
    margin-bottom: 25px;
}

.box-char-card {
    position: relative;
    height: 56px;
    background: #f6fffc;
    border: 1px solid rgba(0, 184, 148, 0.25);
    border-radius: 6px;
    transform: skewX(var(--s-deg));
    box-shadow: 2px 2px 0 rgba(0,0,0,0.03);
    cursor: pointer;
    transition: all 0.2s ease-out;
    display: flex;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
}

.box-char-card:not(.empty):hover {
    transform: skewX(var(--s-deg)) translateY(-2px);
    box-shadow: 4px 4px 6px rgba(0,0,0,0.05);
    border-color: #55efc4;
    z-index: 5;
    background-image: radial-gradient(rgba(0, 184, 148, 0.25) 1px, transparent 1px);
    background-size: 7px 7px;
    background-position: center;
}

.box-char-card.selected {
    background: #eafff7;
    border: 1px solid #00b894 !important;
    box-shadow: 0 0 0 1px #00b894, 4px 4px 15px rgba(0, 184, 148, 0.2);
}
.box-char-card.selected::before {
    content: 'TARGET';
    position: absolute;
    right: 5px; bottom: -6px;
    font-family: var(--font-ui);
    font-size: 1.8rem;
    font-weight: 900;
    font-style: italic;
    color: rgba(0, 184, 148, 0.08);
    pointer-events: none;
    transform: skewX(var(--ns-deg));
}

.bcc-inner {
    width: 100%;
    transform: skewX(var(--ns-deg));
    display: flex;
    align-items: center;
    gap: 12px;
}

.bcc-icon {
    width: 52px; height: 52px;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.bcc-icon img {
    width: 100%; height: 100%; object-fit: contain;
    filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.1));
}
.bcc-icon img.regional-icon {
    width: 120%; height: 120%;
    transform: translateY(-8px);
}

.bcc-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.1;
    overflow: hidden;
}
.bcc-name {
    font-size: 0.85rem;
    font-weight: 800;
    color: #2d3436;
    text-transform: uppercase;
    font-family: var(--font-ui);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bcc-lv {
    font-size: 0.65rem;
    font-family: var(--font-ui);
    font-weight: 700;
    color: #b2bec3;
}
.bcc-type {
    display: none;
}

/* 空槽：绿色调虚线 & 点阵呼吸 */
.box-char-card.empty {
    border: 2px dashed #00b894;
    background: rgba(0, 184, 148, 0.02);
    opacity: 0.6;
    box-shadow: none;
}
.box-char-card.empty:hover {
    opacity: 1;
    border-color: #55efc4;
    background-image: radial-gradient(#7af2d0 1px, transparent 1px);
    background-size: 8px 8px;
    transform: skewX(var(--s-deg)) translateY(-2px);
}
.box-char-card.empty .bcc-name {
    color: rgba(0, 184, 148, 0.4);
    -webkit-text-stroke: 0;
    font-weight: 900;
    font-style: italic;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.2s ease, -webkit-text-stroke 0.2s ease;
}
.box-char-card.empty.selected {
    border: 2px solid #00b894 !important;
    background: #dbfff8;
    background-image: none;
    opacity: 1;
}
.box-char-card.empty:hover .bcc-name {
    color: rgba(122, 242, 208, 0.85);
}
.box-char-card.empty.selected .bcc-name {
    color: #00b894;
}

/* =========================================
   2. LOWER AREA: Cloud Storage Container
   ========================================= */

.box-storage-area {
    background-color: rgba(250, 251, 252, 0.95);
    background-image: 
        linear-gradient(rgba(0, 184, 148, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 184, 148, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  
    border: 1px solid #fff;
    border-top: 4px solid #00b894;
    border-radius: 12px;
  
    box-shadow: 
        inset 0 4px 12px rgba(0,0,0,0.02),
        0 10px 30px -10px rgba(0, 184, 148, 0.1);
      
    position: relative;
    transform: none;
    overflow: hidden;
    padding: 12px;
    height: 700px;
}

.box-storage-matrix {
    background-color: rgba(0, 184, 148, 0.02);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: 12px;
    transform: none;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 80px; 
    scroll-behavior: smooth;
    background-image: 
        linear-gradient(rgba(0, 184, 148, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 184, 148, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
}

.box-storage-matrix::-webkit-scrollbar { width: 4px; }
.box-storage-matrix::-webkit-scrollbar-track { background: transparent; }
.box-storage-matrix::-webkit-scrollbar-thumb {
    background: #dcdde1; 
    border-radius: 4px;
}

/* 3. 仓库单元格 (正圆角风格) */
.storage-cell {
    position: relative;
    aspect-ratio: 1 / 1;
    background: #fff;
    border-radius: 8px;
    border: 2px solid rgba(0, 184, 148, 0.15);
    cursor: pointer;
  
    display: flex; flex-direction: column; 
    align-items: center; justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
}

.storage-cell:hover:not(.empty) {
    transform: translateY(-2px) scale(1.05);
    border-color: #55efc4;
  
    background-color: #ecfff6;
    background-image: radial-gradient(rgba(0, 184, 148, 0.25) 1px, transparent 1px);
    background-size: 6px 6px;
  
    box-shadow: 
        0 5px 15px -3px rgba(0, 184, 148, 0.15),
        0 0 0 1px #55efc4; 
    z-index: 10;
}

.storage-cell.selected {
    border-color: #00b894;
    border-width: 1px;
    background: #e6fffa;
    background-image: none;
  
    box-shadow: 
        0 0 0 1px rgba(0, 184, 148, 0.9),
        0 6px 12px -2px rgba(0, 184, 148, 0.25);
  
    transform: translateY(-2px);
    z-index: 5;
}

.storage-cell.selected::after {
    content: ''; 
    position: absolute;
    top: -6px; right: -6px;
    width: 22px; height: 22px;
    background: #00b894 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
    background-size: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sc-img {
    width: 70%; height: 70%;
    object-fit: contain;
    image-rendering: auto;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.06));
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sc-img.regional-icon {
    width: 90%; height: 90%;
    transform: translateY(-6px);
}
.storage-cell:hover .sc-img, 
.storage-cell.selected .sc-img {
    transform: scale(1.2);
}
.storage-cell:hover .sc-img.regional-icon,
.storage-cell.selected .sc-img.regional-icon {
    transform: translateY(-6px) scale(1.2);
}

.sc-lv {
    position: absolute;
    bottom: 2px;
    font-size: 0.55rem;
    font-weight: 800;
    font-family: var(--font-ui);
    color: #636e72;
    background: rgba(255,255,255,0.8);
    padding: 1px 4px;
    border-radius: 4px;
}
.storage-cell:hover .sc-lv,
.storage-cell.selected .sc-lv {
    color: #006266;
    background: rgba(85, 239, 196, 0.3);
}

.sc-shiny {
    position: absolute;
    top: 4px; left: 4px;
    color: #f1c40f;
    font-size: 0.8rem;
    filter: drop-shadow(0 0 2px #fff);
    z-index: 2;
}

/* 5. 空白单元格 */
.storage-cell.empty {
    border: 2px dashed rgba(0, 184, 148, 0.3);
    background: rgba(0, 184, 148, 0.02);
    transform: none; 
    opacity: 0.6;
    transition: all 0.2s;
    box-shadow: none;
}
.storage-cell.empty:hover {
    opacity: 1;
    border-color: #00cec9;
    border-style: solid;
    transform: scale(0.98);

    background-color: #e0fbf6;
    background-image: radial-gradient(rgba(0, 184, 148, 0.4) 1px, transparent 1px);
    background-size: 10px 10px; 
}
.storage-cell.empty.selected {
    border: 2px solid #00b894;
    background: rgba(85, 239, 196, 0.2);
    background-image: none;
    box-shadow: inset 0 0 10px rgba(0, 184, 148, 0.2);
    transform: none;
    opacity: 1;
}

/* --- BOTTOM: 悬浮操作控制台 (Remastered) --- */
/* 拒绝死黑板，改用磨砂玻璃 Floating Bar，增加呼吸感 */

.box-ops-bar {
    position: fixed;
    /* 稍微悬空，增加层次 */
    bottom: 25px; 
    left: 20px; right: 20px;
    max-width: 500px;
    margin: 0 auto;  /* 居中保护 */
  
    height: auto;
    /* 磨砂玻璃深色底 */
    background: rgba(45, 52, 54, 0.85); /* 半透明黑灰 */
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
  
    /* 边框发光 */
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
        0 15px 40px rgba(0,0,0,0.35),
        0 0 0 1px rgba(0,0,0,0.1);
      
    border-radius: 12px;
    padding: 16px;
  
    /* 入场动画 */
    transform: translateY(120%) scale(0.95);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 999;
}

.box-ops-bar.active {
    transform: translateY(0) scale(1);
    opacity: 1;
}

/* 提示文字行 */
.ops-text-row {
    background: rgba(0,0,0,0.2);
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-left: 3px solid #74b9ff; /* 默认蓝色指引 */
}

.ops-log {
    font-family: 'Exo 2', sans-serif; /* 确保用科技字体 */
    color: #dfe6e9;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.3;
}

/* 高亮词：加底色块 */
.ops-highlight {
    color: #fff;
    background: #00cec9;
    padding: 1px 6px;
    border-radius: 3px;
    font-weight: 800;
    font-size: 0.85rem;
    margin: 0 2px;
    box-shadow: 0 2px 5px rgba(0, 206, 201, 0.3);
    display: inline-block;
    transform: skewX(-5deg); /* 文字高亮再次倾斜 */
}

/* 按钮行：两端对齐 */
.ops-action-row {
    display: grid;
    grid-template-columns: 1fr 2fr; /* RESET占1，EXECUTE占2 */
    gap: 12px;
}

.btn-ops-cancel, .btn-ops-confirm {
    height: 44px;
    border: none;
    border-radius: 6px;
  
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.1s;
}

/* 取消按钮：幽灵式 */
.btn-ops-cancel {
    background: transparent;
    color: #636e72;
    background: #fff;
    border: 2px solid #ebedf0;
    box-shadow: 0 4px 0 #dfe6e9;
}
.btn-ops-cancel:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #dfe6e9;
}

/* 确认按钮：核心风格 - 使用斜纹背景和强阴影 */
.btn-ops-confirm {
    /* 渐变主色 */
    background: linear-gradient(135deg, #00b894 0%, #55efc4 100%);
    color: #0e3d32; /* 深色字增加对比度 */
  
    /* 按钮底 */
    box-shadow: 
        0 4px 0 #009174,
        0 8px 20px rgba(0, 184, 148, 0.35);
      
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* 给确认按钮加一点流光动画 */
.btn-ops-confirm::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transform: skewX(-20deg);
    animation: confirmSheen 3s infinite ease-in-out;
}
@keyframes confirmSheen {
    0% { left: -100%; }
    20% { left: 150%; }
    100% { left: 150%; }
}

.btn-ops-confirm:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow: 0 6px 0 #009174, 0 12px 25px rgba(0, 184, 148, 0.4);
}
.btn-ops-confirm:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #009174;
}

/* =========================================
   [IMPROVED] COPY NOTIFICATION
   更具科技感的横幅提示，不再是绿方块
   ========================================= */
.copy-notification {
    position: fixed;
    top: 60px; /* 从顶部滑入 */
    left: 20px; right: 20px;
    max-width: 400px;
    margin: 0 auto;
  
    background: rgba(30, 30, 35, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(85, 239, 196, 0.5); /* 绿色描边 */
    backdrop-filter: blur(16px);
    border-radius: 6px;
  
    /* 倾斜切角左上右下 */
    transform: skewX(-15deg) translateY(-20px);
  
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.copy-notification.show {
    opacity: 1;
    transform: skewX(-15deg) translateY(0); /* 滑入 */
}

/* 内部内容反转以保持正 */
.copy-notif-internal {
    transform: skewX(15deg);
    display: flex; 
    align-items: center; 
    gap: 15px; 
    width: 100%;
}

.copy-notif-icon {
    font-size: 1.5rem;
    color: #55efc4;
    display: flex; align-items: center;
}

.copy-notif-text {
    font-family: var(--font-ui);
    color: #fff;
    line-height: 1.2;
}
.copy-notif-title {
    font-weight: 800;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #55efc4; /* Tech Green */
}
.copy-notif-desc {
    font-size: 0.75rem;
    color: #b2bec3;
    font-weight: 500;
}

@keyframes scanline {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
}
/* 扫描线特效 */
.copy-notification::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    z-index: -1;
    animation: scanline 2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

/* =================================================================
   Responsive 锁区界面 FIX V6.0 (Stable & Centered)
   ================================================================= */
.box-offline-overlay {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: #f4f6f8;
    background-image: 
        linear-gradient(#e1e4e8 1px, transparent 1px),
        linear-gradient(90deg, #e1e4e8 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center;
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.box-offline-overlay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: repeating-linear-gradient(
        -45deg,
        #dfe4ea,
        #dfe4ea 10px,
        #ff7675 10px,
        #ff7675 20px
    );
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.boo-bg-deco {
    position: absolute;
    bottom: -10%;
    left: -10%;
    transform: rotate(-15deg);
    font-size: 12rem;
    font-weight: 900;
    font-family: Arial, sans-serif;
    color: rgba(0,0,0,0.03);
    white-space: nowrap;
    z-index: 0;
    pointer-events: none;
    user-select: none;
}

.boo-content {
    position: relative;
    z-index: 5;
    background: #ffffff;
    border-top: 5px solid #ff7675;
    border-radius: 12px;
    box-shadow: 
        0 15px 35px -5px rgba(0,0,0,0.15), 
        0 5px 15px rgba(0,0,0,0.05),
        0 0 0 1px rgba(0,0,0,0.02);
    width: 320px;
    padding: 40px 30px;
    text-align: center;
    animation: pop-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) backwards;
    transform-origin: center center;
}

.boo-icon-wrap {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px auto;
    color: #636e72;
}

.boo-svg {
    width: 100%;
    height: 100%;
}

.boo-svg .slash-line {
    stroke: #ff7675;
    stroke-width: 3;
    animation: slash-In 0.5s 0.2s ease-out forwards;
}

.boo-title {
    font-family: 'Exo 2', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    font-style: italic;
    color: #2d3436;
    letter-spacing: -1px;
    text-transform: uppercase;
    margin-bottom: 2px;
    text-shadow: 2px 0 0 rgba(255,0,0,0.1), -2px 0 0 rgba(0,255,255,0.1);
}

.boo-code {
    font-family: monospace;
    color: #b2bec3;
    font-size: 0.8rem;
    margin-bottom: 15px;
    letter-spacing: 1px;
    display: block;
}

.boo-alert-box {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #dfe6e9;
    width: 100%;
}

.boo-main-reason {
    font-size: 0.95rem;
    font-weight: 800;
    color: #d63031;
    margin-bottom: 6px;
    line-height: 1.4;
}

.boo-hint {
    font-size: 0.75rem;
    color: #636e72;
    background: #f1f2f6;
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-block;
}

.boo-terminal {
    font-family: 'Consolas', monospace;
    font-size: 0.7rem;
    color: #95a5a6;
    margin-top: 8px;
    text-align: center;
    z-index: 5;
    opacity: 0.8;
}

.boo-terminal span {
    display: block;
    margin-bottom: 2px;
}

.blink {
    display: inline-block;
    width: 6px;
    height: 10px;
    background: #2d3436;
    vertical-align: middle;
    margin-left: 2px;
    animation: cursor-blink 1s step-end infinite;
}

@keyframes pop-in {
    0% { transform: scale(0.9) translateY(20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes slash-In {
    to { stroke-dashoffset: 0; }
}

@keyframes cursor-blink {
    50% { opacity: 0; }
}

#pg-box.locked .box-header-strip,
#pg-box.locked .box-party-grid, 
#pg-box.locked .box-storage-area {
    display: none !important;
}

/* =========================================
   P-SYSTEM DASHBOARD (白色系 / Light Mode)
   赛博朋克风格仪表盘 - 清爽白底版
   ========================================= */

/* Dashboard 页面容器 */
#pg-dashboard.page {
    padding: 0 !important;
    gap: 8px !important;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    display: none !important;
    align-content: start !important;
}

#pg-dashboard.page.curr {
    display: flex !important;
}

/* Hero 欢迎区域 (TRAINER 卡片) */
.p-hero-dash {
    position: relative !important;
    overflow: visible !important;
    height: auto;
    min-height: 80px;
    flex-shrink: 0;
    margin: 0 0 0 0 !important;
    border-left-width: 0px;
    border-bottom: 3px solid var(--c-cyan, #00cec9);
    padding: 15px 24px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 5px 15px -10px rgba(0,0,0,0.1);
    animation: slideUpFade 0.4s ease-out;
    z-index: 5;
}
.p-hero-dash > * {
    transform: none;
}
.hero-main {
    flex: 1;
}
/* Dashboard 中的 mech-wrapper 绝对定位 */
.p-hero-dash .mech-wrapper {
    position: absolute !important;
    top: 18px !important;
    right: 24px !important;
    height: 10px;
    margin: 0 !important;
    z-index: 50;
}
.p-hero-dash .mech-matrix.icon-mode {
    top: 0;
    right: 24px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transform: skewX(-15deg);
}
.p-hero-dash .mech-matrix.icon-mode.expanded {
    transform: skewX(-15deg);
    padding: 3px 6px;
}

.p-hero-dash .mech-btn {
    margin-top: 8px;
}

@keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}

.hero-welcome { 
    font-size: 0.65rem; 
    color: rgba(45,52,54,0.5);
    font-weight: 700; 
    letter-spacing: 1.5px;
    text-transform: uppercase;
    opacity: 0.6;
}
.hero-name { 
    margin-top: 5px;
    font-size: 2.4rem; 
    font-weight: 900; 
    font-style: italic; 
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -2px;
    font-family: var(--font-ui);
    color: #2d3436;
    text-shadow: 3px 3px 0px rgba(0,0,0,0.05);
}
.hero-zone {
    font-size: 0.7rem; 
    background: var(--c-cyan, #00cec9); 
    color: #fff;
    display: inline-block; 
    padding: 3px 10px; 
    border-radius: 3px;
    font-weight: 800; 
    margin-top: 8px; 
    transform: skewX(-10deg);
    box-shadow: 2px 2px 0 rgba(0, 206, 201, 0.3);
}
.hero-zone span {
    display: inline-block;
    transform: skewX(6deg);
}

/* =========================================================
   HERO META ROW + GHOST BAG BUTTON
   ========================================================= */
.hero-meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    transform: skewX(-6deg);
}

.p-hero-dash .hero-zone {
    margin-top: 0 !important;
    transform: skewX(-6deg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    font-size: 0.7rem;
    background: var(--c-cyan, #00cec9);
    color: #fff;
    padding: 0 10px;
    border-radius: 3px;
    font-weight: 800;
    box-shadow: 2px 2px 0 rgba(0, 206, 201, 0.3);
}

.p-hero-dash .hero-zone span {
    transform: skewX(6deg);
}

/* ========================
   MOSAIC GRID SYSTEM
   ======================== */
.mosaic-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto auto auto auto min-content;
    gap: 14px;
    flex: 1;
    overflow: hidden !important;
    margin-top: 0 !important;
    width: 100%;
    box-sizing: border-box;
    align-content: start;
    padding: 4px 0px 0px 0px !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.mosaic-grid::-webkit-scrollbar { display: none; }

/* ========================
   LIVE TILE (万能磁贴块)
   ======================== */
.live-tile {
    padding: 0;
    display: flex;
    position: relative;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f1f3f5 !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    overflow: hidden;
    transition: all 0.2s;
    align-items: center;
    justify-content: center;
    background-image: none !important;
}

/* 1.5 DEPLOYED UNIT (PARTY快捷入口) - REMASTERED */
.tile-party {
    --tile-color: #ff4757;
    --tile-r: 255; --tile-g: 71; --tile-b: 87;
    grid-column: span 12;
    height: 85px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 
        0 4px 12px rgba(0,0,0,0.04), 
        0 1px 2px rgba(0,0,0,0.02);
    border: 1px solid #e2e6ea;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
}

.tile-party:active {
    transform: scale(0.98);
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}


.tile-party::after {
    display: none !important;
}

.tp-watermark {
    position: absolute;
    right: -25px;
    bottom: -35px;
    width: 130px;
    height: 130px;
    opacity: 0.05;
    color: #2d3436;
    margin: 0;
    pointer-events: none;
    transform: rotate(-15deg);
    z-index: 0;
    fill: currentColor;
    transition: all 0.5s ease;
}

.tp-roster-container {
    z-index: 5;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    height: 100%;
    padding-left: 0;
    padding-top: 40px;
    margin-left: -45px;
}

.roster-slot {
    width: 44px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.pk-icon {
    width: 75px;
    height: 75px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
    transform: translateY(-10px);
    transition: transform 0.2s cubic-bezier(0.3, 1.5, 0.5, 1);
}

.tile-party:hover .pk-icon {
    transform: scale(1.15) translateY(-15px);
}

.tile-party:hover .roster-slot:nth-child(1) .pk-icon { transition-delay: 0.00s; }
.tile-party:hover .roster-slot:nth-child(2) .pk-icon { transition-delay: 0.05s; }
.tile-party:hover .roster-slot:nth-child(3) .pk-icon { transition-delay: 0.10s; }
.tile-party:hover .roster-slot:nth-child(4) .pk-icon { transition-delay: 0.15s; }
.tile-party:hover .roster-slot:nth-child(5) .pk-icon { transition-delay: 0.20s; }
.tile-party:hover .roster-slot:nth-child(6) .pk-icon { transition-delay: 0.25s; }

.empty-dot {
    width: 5px;
    height: 5px;
    background: #dfe6e9;
    border-radius: 50%;
}

.tile-party:hover .tp-watermark {
    opacity: 0.08;
    transform: rotate(0deg) scale(1.1);
    color: #ff4757;
}

/* ========================================================
   MAIN VIEWPORT (主视口间距)
   ======================================================== */
.main-viewport {
    padding-top: 50px !important;
}

/* ========================================================
   [FINAL FIX] SYSTEM STATUS BAR - 顶栏完全体
   ======================================================== */
.p-status-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    z-index: 2000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    box-sizing: border-box;
    font-family: var(--font-ui), system-ui, -apple-system, sans-serif;
    color: #636e72;
    background: rgba(246, 247, 249, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: all 0.3s;
}

.ps-left {
    display: flex;
    align-items: center;
    width: 80px;
    height: 100%;
    position: relative;
}

.net-group {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s ease;
}

.net-signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
}
.n-bar {
    width: 3px;
    background: #b2bec3;
    border-radius: 2px;
}
.n-bar:nth-child(1) { height: 40%; }
.n-bar:nth-child(2) { height: 60%; }
.n-bar:nth-child(3) { height: 80%; background: #636e72; }
.n-bar:nth-child(4) { height: 100%; background: #636e72; }

.net-label {
    font-size: 0.75rem;
    font-weight: 800;
    font-style: italic;
    color: #b2bec3;
}

.back-trigger {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-10px);
    transition: all 0.3s ease 0.1s;
}

.p-status-bar.sub-mode .net-group {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-10px);
    position: absolute;
}

.p-status-bar.sub-mode .back-trigger {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
}

.back-icon {
    width: 20px;
    color: #ff7675;
}

.back-txt {
    font-size: 0.8rem;
    font-weight: 800;
    color: #2d3436;
}

.ps-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    font-weight: 800;
    color: #2d3436;
}

.ps-right {
    display: flex;
    align-items: center;
    width: 80px;
    justify-content: flex-end;
    gap: 5px;
}

.batt-val {
    font-size: 0.75rem;
    font-weight: 700;
    color: #b2bec3;
    letter-spacing: 0.5px;
    margin-top: 1px;
}

.batt-shell {
    width: 24px;
    height: 11px;
    border: 1.5px solid #b2bec366;
    border-radius: 4px;
    padding: 1.5px;
    position: relative;
    display: flex;
    align-items: center;
}

.batt-shell::after {
    content: '';
    position: absolute;
    right: -4.5px;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5px;
    height: 4px;
    background: #b2bec380;
    border-radius: 0 2px 2px 0;
}

.batt-fill {
    height: 100%;
    width: 94%;
    border-radius: 1.5px;
    background: #636e72;
}


/* ========================================================
   MECH-BAR (机制条样式)
   ======================================================== */
.mech-btn {
    height: 22px;
    width: 22px;
    border-radius: 3px;
    background: #e2e6ea;
    border: none;
    box-shadow: none;
}

.mech-btn svg {
    width: 18px;
    height: 18px;
    stroke-width: 4;
    transform: skewX(15deg) scale(1) translateY(0);
}

.mech-btn.open svg {
    transform: skewX(15deg) rotate(180deg);
}

.mech-matrix.icon-mode .cell {
    height: 20px;
}

.mech-matrix.icon-mode.expanded .cell {
    width: 20px;
}

.mech-matrix.icon-mode.expanded .cell svg {
    transform: skewX(15deg);
    color: #b2bec3;
}

.mech-matrix.icon-mode.expanded .cell[data-mech="mega"] svg,
.mech-matrix.icon-mode.expanded .cell[data-mech="style"] svg {
    transform: skewX(15deg) translateY(1px);
}

/* =========================================
   [优化] Hero Action Button (背包按钮重做)
   ========================================= */
.hero-bag-btn.refined {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    padding: 0 12px 0 10px;
    background: #2d3436;
    border: 1px solid #636e72;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    transform: skewX(-10deg);
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    overflow: hidden;
    position: relative;
    user-select: none;
}

.hero-bag-btn.refined .hbb-icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    margin-top: -1px;
    transform: skewX(10deg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-bag-btn.refined .hbb-icon svg {
    width: 100%;
    height: 100%;
    stroke: #b2bec3;
    stroke-width: 2.2;
    transition: stroke 0.2s;
}

.hero-bag-btn.refined .hbb-text {
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    line-height: 1;
    transform: skewX(10deg);
    color: #dfe6e9;
}

.hero-bag-btn.refined:hover {
    background: #0984e3;
    border-color: #74b9ff;
    transform: skewX(-6deg) translateY(-2px);
    box-shadow: 3px 4px 10px rgba(9, 132, 227, 0.3);
}

.hero-bag-btn.refined:hover .hbb-icon svg,
.hero-bag-btn.refined:hover .hbb-text {
    stroke: #fff;
    color: #fff;
}

.hero-bag-btn.refined:active,
.hero-bag-btn.refined.is-pressing {
    transform: skewX(-6deg) translateY(1px) scale(0.98);
    box-shadow: none;
    background: #00cec9;
    border-color: #00cec9;
}

.hero-bag-btn.refined.is-pressing {
    animation: simpleClick .2s ease forwards;
}

/* =========================================
   [Layout V3] 重构的 "Magazine" 风格栅格
   ========================================= */
.mosaic-grid.layout-v3 {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    grid-auto-rows: min-content;
    gap: 12px !important;
    padding: 4px 10px 50px 10px !important;
    align-content: start !important;
    grid-template-rows: unset !important;
}

/* =========================================
   [修复] Party 卡片回归 & 版面微调
   ========================================= */
.mosaic-grid.layout-v3 .tile-party,
.mosaic-grid.layout-v3 .full-width {
    grid-column: 1 / span 2 !important;
    width: calc(100% - 40px);
    margin: 0 auto 2px;
    height: 85px;
}

/* =========================================
   [Layout Mod] 底部三分停靠栏
   ========================================= */
.bottom-dock-layer {
    grid-column: 1 / span 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: -10px;
}

.bottom-dock-layer .live-tile {
    grid-column: span 1 !important;
    height: 70px !important;
    padding: 0 10px !important;
}

/* =========================================
   [IMPACT] PARTY 核心重制 - 指挥官模式
   ========================================= */
.mosaic-grid.layout-v3 .tile-party.remodel {
    grid-column: 1 / span 2 !important;
    height: 120px !important;
    background: #fff;
    border: 1px solid #e1e4e8;
    border-bottom: 4px solid #ff94a3;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    padding: 0 16px 0 24px !important;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}

.tp-bg-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.tp-giant-watermark {
    position: absolute;
    right: -20px;
    top: -40px;
    width: 200px;
    height: 200px;
    color: #2d3436;
    opacity: 0.04;
    transform: rotate(20deg);
}

.tile-party.remodel:hover .tp-giant-watermark {
    opacity: 0.08;
    transform: rotate(45deg) scale(1.1);
    transition: 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    color: #ff4757;
}

.tp-red-glow {
    position: absolute;
    width: 400px;
    height: 100%;
    left: -100px;
    top: 0;
    background: radial-gradient(circle at center, rgba(255, 71, 87, 0.08) 0%, transparent 70%);
}

.tp-stripe-bg {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 10px);
}

.tp-content-left {
    flex: 0 0 115px !important;
    width: 115px !important;
    z-index: 5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: visible;
    white-space: nowrap;
    margin-right: 5px;
}

.tp-top-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: -2px;
}

.tp-label-main {
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 1.5rem;
    font-style: italic;
    color: #2d3436;
    letter-spacing: -0.5px;
    white-space: nowrap;
    line-height: 1;
}

.tp-big-counter {
    line-height: 1;
    margin-top: 6px;
}

.curr-val {
    font-family: var(--font-ui);
    font-size: 2.8rem !important;
    font-weight: 800;
    color: #2d3436;
    letter-spacing: -2px;
}

.mosaic-grid.layout-v3 .tile-party.remodel {
    padding-right: 14px !important;
}

.max-val {
    font-family: var(--font-ui);
    font-size: 1rem;
    color: #b2bec3;
    font-weight: 700;
    margin-left: -5px;
}

.tp-roster-container {
    z-index: 5;
    flex: 1;
    display: flex;
}

.tp-roster-container .roster-slot {
    flex: 0 0 auto !important;
    width: 42px !important;
    height: 42px !important;
    max-width: none !important;
    border-radius: 6px !important;
    border: 1.5px dashed rgba(45, 52, 54, 0.15) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(45, 52, 54, 0.05);
    transition: all 0.2s;
}

.tp-roster-container .roster-slot:has(.pk-icon) {
    border: none;
    background: transparent;
}

.tp-roster-container .pk-icon {
    width: 54px !important;
    height: 54px !important;
    transform: translateY(-6px) !important;
    filter: drop-shadow(0 5px 5px rgba(0,0,0,0.25)) !important;
}

.empty-dot {
    display: none !important;
}

/* =========================================
   [TACTICAL UI UPGRADE] 全局战术化样式重构
   ========================================= */

/* --- 1. 高级战术方块 (Box / Relation) --- */
.live-tile.box-tactical {
    position: relative;
    background: #fff;
    border: 1px solid #e1e4e8;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    height: 160px;
    margin: 0;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 14px;
    z-index: 1;
}

.live-tile.theme-teal { border-bottom: 4px solid #66eed0; color: #0f9d7c; }
.live-tile.theme-purple { border-bottom: 4px solid #ffb5e0; color: #d452a2; }
.live-tile.theme-blue { border-bottom: 4px solid #b7dcff; color: #4a90e2; }

/* BOX/MAP/UNIT 底部边框强化，保持与其他磁贴一致 */
.box-tactical.theme-teal { border-bottom: 4px solid #66eed0 !important; }
.box-tactical.theme-purple { border-bottom: 4px solid #ffb5e0 !important; }
.box-tactical.theme-blue { border-bottom: 4px solid #b7dcff !important; }
.box-tactical.theme-teal,
.box-tactical.theme-purple {
    height: 150px !important;
}
.live-tile.box-tactical::after {
    content: '';
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: -14px;
    height: 24px;
    border-radius: 14px;
    background: var(--tile-shadow-fill, rgba(0, 0, 0, 0.08));
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
    opacity: 0.9;
    z-index: -1;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.live-tile.theme-teal { --tile-shadow-fill: rgba(0, 184, 148, 0.18); }
.live-tile.theme-purple { --tile-shadow-fill: rgba(255, 181, 224, 0.24); }
.live-tile.theme-blue { --tile-shadow-fill: rgba(116, 185, 255, 0.2); }
.live-tile.theme-amber { --tile-shadow-fill: rgba(253, 203, 110, 0.25); }
.live-tile.theme-slate,
.live-tile.theme-theme-slate,
.live-tile.theme-gray { --tile-shadow-fill: rgba(99, 110, 114, 0.18); }
.live-tile.theme-orange { border-bottom: 4px solid #ffd7cc; }

.t-decoration { position: absolute; inset: 0; pointer-events: none; }

.t-watermark {
    position: absolute;
    right: -20px;
    top: -30px;
    width: 140px;
    height: 140px;
    opacity: 0.05;
    color: #2d3436;
    transform: rotate(15deg);
    transition: 0.4s;
}

.t-stripe {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 12px);
    opacity: 0.7;
}

.t-content {
    z-index: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.t-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px dotted rgba(0,0,0,0.1);
    padding-bottom: 6px;
    margin-bottom: auto;
}

.t-id {
    font-family: var(--font-ui);
    font-size: 0.6rem;
    font-weight: 800;
    opacity: 0.6;
    padding-top: 2px;
}

.t-icon-sm { width: 18px; height: 18px; opacity: 0.8; color: inherit; }

.t-main-data { text-align: left; }

.t-num {
    font-family: var(--font-ui);
    font-size: 2.2rem;
    font-weight: 900;
    line-height: 1;
    color: #2d3436;
    letter-spacing: -1px;
}

.t-num small {
    font-size: 0.9rem;
    color: #b2bec3;
    font-weight: 700;
    margin-left: 2px;
}

.t-label {
    font-size: 0.9rem;
    font-weight: 900;
    font-style: italic;
    color: #2d3436;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.t-status {
    font-size: 0.5rem;
    font-weight: 800;
    margin-top: 2px;
    opacity: 0.8;
    color: inherit;
}

.map-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(116, 185, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(116, 185, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
}

.map-radar-ring {
    position: absolute;
    width: 60%;
    padding-bottom: 60%;
    border: 1px solid rgba(116, 185, 255, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(116, 185, 255, 0.1);
}

.map-radar-ring::after {
    content: '';
    position: absolute;
    inset: 10%;
    border: 1px dashed rgba(116, 185, 255, 0.3);
    border-radius: 50%;
}

/* =========================================
   [IMPROVED v2] 统一家族化外观：两段式渐变色块
   ========================================= */

/* 1. 家族渐变底色 */
.live-tile.theme-teal {
    background: linear-gradient(170deg, #ffffff 50%, #dcfbf2 80%, #bffcf0 100%) !important;
}
.live-tile.theme-purple {
    background: linear-gradient(170deg, #ffffff 50%, #ffe3f4 80%, #ffd3ec 100%) !important;
}
.live-tile.theme-blue {
    background: linear-gradient(180deg, #ffffff 50%, #e8f4fd 80%, #d6ecff 100%) !important;
    border-bottom: 4px solid #c5e1f5;
    color: #4a90e2;
}

.theme-teal .t-main-data,
.theme-purple .t-main-data,
.theme-blue .t-main-data {
    position: relative;
    z-index: 5;
}

/* 主题色标题文本（数值/副标题） */
.theme-teal .t-num,
.theme-teal .t-label { color: #0f9d7c; }

.theme-purple .t-num,
.theme-purple .t-label { color: #d452a2; }

.theme-blue .t-num,
.theme-blue .t-label { color: #3d7dc3; }

.theme-amber .t-num,
.theme-amber .t-label { color: #ce6a1d; }

.theme-gray .t-num,
.theme-gray .t-label,
.theme-slate .t-num,
.theme-slate .t-label { color: #4f5a63; }

/* MAP HUD 标题 & 坐标主题色 */
.theme-blue .mh-zone { color: #3d7dc3; }
.theme-blue .mh-coords { color: #3d7dc3; }
.theme-blue .mh-coords .axis { color: #5dade2; }

/* TRANSIT / WORK 小块标题 */
.theme-amber .mini-title-big { color: #ce6a1d; }
.theme-slate .mini-title-big,
.theme-gray .mini-title-big { color: #4f5a63; }

.t-watermark.logo-mode {
    opacity: 0.08;
    width: 120px;
    height: 120px;
    top: -10px;
    right: -10px;
}

/* 2. Tactical Map Pro 调整 */
.tactical-map-pro {
    align-items: stretch !important;
    justify-content: flex-start !important;
}

.tile-tall-map {
    height: 150px !important;
}

.t-map-visual {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -10px;
    margin-bottom: 5px;
}

.radar-ping {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px solid rgba(116, 185, 255, 0.5);
    border-radius: 50%;
    animation: pingOpac 3s infinite;
}
.radar-ping::after {
    content: '';
    position: absolute;
    inset: -4px;
    border: 1px dashed rgba(116, 185, 255, 0.3);
    border-radius: 50%;
}

@keyframes pingOpac {
    0% { transform: scale(0.8); opacity: 0.1; }
    50% { opacity: 0.5; }
    100% { transform: scale(1.2); opacity: 0.1; }
}

.corner-L-bra {
    position: absolute;
    width: 15px;
    height: 15px;
    border: 1.5px solid #74b9ff;
    opacity: 0.6;
}

.corner-L-bra.top-l {
    top: 50%;
    left: 50%;
    transform: translate(-50px, -50px);
    border-right: none;
    border-bottom: none;
}

.corner-L-bra.bot-r {
    top: 50%;
    left: 50%;
    transform: translate(35px, 35px);
    border-left: none;
    border-top: none;
}

.theme-blue .t-status {
    color: #2980b9;
    opacity: 0.7;
}

/* =========================================
   [CSS FIX] 右侧堆叠区对齐 & 窄条战术样式
   ========================================= */
.stack-col {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    height: 100% !important;
    grid-column: 2 / span 1;
    grid-row: span 2;
}

.theme-amber {
    border-bottom: 4px solid #ffd7cc;
    background: linear-gradient(170deg, #ffffff 40%, #fff7f5 80%, #ffede8 100%) !important;
    color: #e17055;
    position: relative;
    overflow: hidden;
}

.theme-gray {
    border-bottom: 4px solid #cbd4d8;
    background: linear-gradient(170deg, #ffffff 40%, #f6f7f8 80%, #ebedf0 100%) !important;
    color: #636e72;
    position: relative;
    overflow: hidden;
}

/* =========================================
   [REMASTER V3] Stack Column: Mini-Macro Style
   ========================================= */
.box-tactical.small-h {
    position: relative;
    padding: 0 !important;
    height: 82px;
    display: block !important;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.live-tile.theme-amber {
    background: linear-gradient(160deg, #ffffff 40%, rgba(253, 203, 110, 0.2) 100%) !important;
    border-bottom: 4px solid #ffd7cc !important;
    color: #e67e22;
}

.live-tile.theme-slate,
.live-tile.theme-theme-slate,
.live-tile.theme-gray {
    background: linear-gradient(160deg, #ffffff 40%, rgba(178, 190, 195, 0.2) 100%) !important;
    border-bottom: 4px solid #c9d2d8 !important;
    color: #2d3436;
}

.box-tactical.small-h .t-decoration {
    border-radius: inherit;
    overflow: hidden;
}

.box-tactical.small-h .t-watermark {
    width: 90px;
    height: 90px;
    right: -25px;
    top: -15px;
    opacity: 0.04;
    transform: rotate(15deg);
    color: inherit;
    z-index: 0;
}

.mini-header-icon {
    position: absolute;
    top: 10px;
    left: 14px;
    width: 20px;
    height: 20px;
    opacity: 0.6;
    color: inherit;
    z-index: 2;
}

.mini-header-icon svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 1px 0 rgba(255,255,255,0.8));
}

.mini-body {
    position: absolute;
    bottom: 16px;
    right: 14px;
    left: 14px;
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    z-index: 5;
    pointer-events: none;
}

.mini-title-big {
    font-family: var(--font-ui);
    font-size: 1.55rem;
    font-weight: 900;
    font-style: italic;
    line-height: 0.85;
    letter-spacing: -1px;
    color: #2d3436;
    text-shadow: 2px 2px 0 rgba(255,255,255,0.8);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* =========================================
   [DOCK REMASTER] Bottom Buttons: Micro-Tactical
   ========================================= */
.box-tactical.dock-mode {
    position: relative;
    height: auto !important;
    min-height: 48px;
    background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(241,243,246,0.4) 100%) !important;
    border: 1px solid rgba(0,0,0,0.05);
    border-bottom-width: 4px !important;
    border-bottom-style: solid !important;
    padding: 8px 18px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    overflow: hidden;
    border-radius: 8px !important;
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dock-news {
    border-bottom-color: #cbc0ff !important;
    color: #6c5ce7;
}

.dock-mart {
    border-bottom-color: #66eed0 !important;
    color: #006266;
}

.dock-config {
    border-bottom-color: #a5aeb5 !important;
    color: #2d3436;
    background: linear-gradient(180deg, #fff 0%, #f1f2f6 100%) !important;
}

.dock-config:hover {
    border-bottom-color: #ffb5b4 !important;
}

.dock-content-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
    z-index: 2;
    pointer-events: none;
}

.dock-icon {
    width: 18px;
    height: 18px;
    opacity: 0.8;
    color: inherit;
    transform: translateY(2px);
}

.dock-icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 2.2;
}

.dock-title {
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 1rem;
    font-style: italic;
    letter-spacing: -0.5px;
    color: #2d3436;
    line-height: 1;
}

.dock-news .dock-title {
    color: #6c5ce7;
}

.dock-mart .dock-title {
    color: #006266;
}

/* =========================================
   [CSS Mod] MAP 视觉重构：定位点风格
   ========================================= */
.map-point-dot {
    position: relative;
    width: 14px;
    height: 14px;
    background: #74b9ff;
    border: 2px solid #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 10px #74b9ff;
    animation: dotPulse 2s infinite ease-in-out;
}

@keyframes dotPulse {
    0% { transform: scale(0.9); box-shadow: 0 0 5px #74b9ff; }
    50% { transform: scale(1.1); box-shadow: 0 0 15px #74b9ff, 0 0 25px rgba(116, 185, 255, 0.4); }
    100% { transform: scale(0.9); box-shadow: 0 0 5px #74b9ff; }
}

.map-axis-x,
.map-axis-y {
    position: absolute;
    pointer-events: none;
    z-index: 1;
}

.map-axis-x {
    width: 120px;
    height: 1px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(90deg, transparent, rgba(116, 185, 255, 0.8), transparent);
}

.map-axis-y {
    width: 1px;
    height: 120px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, transparent, rgba(116, 185, 255, 0.8), transparent);
}

.radar-ping {
    border-color: rgba(116, 185, 255, 0.6);
    z-index: 0;
}

.map-radar-ring {
    width: 100px;
    padding-bottom: 100px;
    z-index: 0;
    opacity: 0.4;
}

.t-watermark.logo-mode {
    opacity: 0.06;
    transform: rotate(10deg) scale(1.2);
    right: -30px;
    top: 10%;
}

/* =========================================
   [Typo Mod] MAP卡片底部：坐标读数风格
   ========================================= */
.t-main-data.map-hud-layout {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 2px;
}

.mh-bar {
    width: 3px;
    height: 36px;
    background: #74b9ff;
    box-shadow: 0 0 5px rgba(116, 185, 255, 0.6);
    border-radius: 2px;
}

.mh-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1;
}

.mh-zone {
    font-family: var(--font-ui);
    font-style: italic;
    font-weight: 900;
    font-size: 1.6rem;
    color: #2d3436;
    letter-spacing: -1px;
}

.mh-coords {
    margin-top: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    color: #636e72;
    display: flex;
    align-items: center;
    background: rgba(116, 185, 255, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    width: fit-content;
    white-space: nowrap;
}

.mh-coords .axis {
    color: #74b9ff;
    margin-right: 3px;
    font-size: 0.55rem;
}

.mh-coords .val {
    color: #2d3436;
}

.mh-coords .sep {
    margin: 0 6px;
    opacity: 0.3;
    font-size: 0.6rem;
}

/* =========================================
   [UNIFIED] 统一磁贴悬浮效果
   ========================================= */

/* 基础过渡 */
.live-tile,
.tile-party,
.box-tactical {
    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 统一悬浮效果: 上浮 + 底部边框变亮 + 阴影增强 */
.live-tile.box-tactical:hover,
.tile-party.remodel:hover,
.box-tactical.small-h:hover,
.box-tactical.dock-mode:hover {
    transform: translateY(-4px);
    box-shadow: 
        0 12px 28px -8px rgba(0, 0, 0, 0.12),
        0 4px 10px -4px rgba(0, 0, 0, 0.08);
}

/* 底部边框变亮效果 */
.live-tile.theme-teal:hover { border-bottom-color: #8ff7de !important; }
.live-tile.theme-purple:hover { border-bottom-color: #ffd9ef !important; }
.live-tile.theme-blue:hover { border-bottom-color: #cfe8ff !important; }
.live-tile.theme-amber:hover { border-bottom-color: #ffe9c7 !important; }
.live-tile.theme-slate:hover,
.live-tile.theme-gray:hover { border-bottom-color: #dbe3e7 !important; }
.tile-party.remodel:hover { border-bottom-color: #ffb3be !important; }
.dock-news:hover { border-bottom-color: #ded8ff !important; }
.dock-mart:hover { border-bottom-color: #9bfadb !important; }
.dock-config:hover { border-bottom-color: #ffe1e0 !important; }

/* 悬浮时水印动画 */
.box-tactical:hover .t-watermark,
.box-tactical.small-h:hover .t-watermark {
    transform: rotate(0deg) scale(1.1);
    opacity: 0.1;
}

/* PARTY卡片悬浮特效 */
.tile-party.remodel:hover .tp-giant-watermark {
    opacity: 0.08;
    transform: rotate(45deg) scale(1.1);
    color: #ff4757;
}

.tile-party.remodel:hover .tp-roster-container .roster-slot {
    border-color: rgba(255, 71, 87, 0.3);
    background: rgba(255, 255, 255, 0.8);
}

.tile-party.remodel:hover .curr-val {
    color: #ff4757;
}

/* 点击反馈 */
.live-tile.box-tactical:active,
.tile-party.remodel:active,
.box-tactical.small-h:active,
.box-tactical.dock-mode:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.1);
}

/* =========================================
   MAP 模态框 (相对于手机容器)
   ========================================= */
.map-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 15, 25, 0.97);
    z-index: 9999;
    display: none;
    flex-direction: column;
    border-radius: inherit;
    overflow: hidden;
}

.map-modal.active {
    display: flex;
}

.map-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: linear-gradient(90deg, #1a1a2e, #16213e);
    border-bottom: 2px solid #3498db;
    flex-shrink: 0;
}

.map-modal-title {
    font-family: var(--font-ui);
    font-size: 0.85rem;
    font-weight: 800;
    color: #ecf0f1;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.map-modal-close {
    width: 28px;
    height: 28px;
    background: rgba(231, 76, 60, 0.2);
    border: 1px solid rgba(231, 76, 60, 0.4);
    border-radius: 4px;
    color: #e74c3c;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-modal-close:hover {
    background: rgba(231, 76, 60, 0.4);
    border-color: #e74c3c;
}

#map-iframe {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    min-height: 0;
}

    </style>
</head>
<body style="margin:0;padding:0;background:#f2f4f8;overflow:hidden;">
    <div class="ver-dawn-frame">
        <div class="header-section" id="inject-header"></div>
        <div class="nav-wrap" style="display:none;">
            <div class="tab" onclick="switchPage('party', this)">
                <span class="t-txt">PARTY</span>
            </div>
            <div class="tab" id="nav-box" data-t="box" onclick="switchPage('box', this)">
                <span class="t-txt">PC BOX</span>
            </div>
            <div class="tab" data-t="soc" onclick="switchPage('social', this)">
                <span class="t-txt">RELATION</span>
            </div>
            <div class="tab" data-t="cfg" onclick="switchPage('settings', this)">
                <span class="t-txt">CONFIG</span>
            </div>
        </div>
        <div class="main-viewport" id="inject-viewport">
            <div id="pg-dashboard" class="page curr"></div>
            <div id="pg-party" class="page"></div>
            <div id="pg-social" class="page"></div>
            <div id="pg-settings" class="page"></div>
            <div id="pg-box" class="page"></div>
        </div>
    </div>

    <div id="box-ops-console" class="box-ops-bar">
        <div class="ops-text" id="ops-log">
            选择操作对象...
        </div>
        <div class="ops-btn-group">
            <button class="btn-ops-cancel" onclick="resetBoxSelection()">取消 / RESET</button>
            <button class="btn-ops-confirm" onclick="confirmBoxTransfer()">确认传输 / EXE</button>
        </div>
    </div>

    <script src="https://files.catbox.moe/8oxf4b.js"><\/script>
    <script>
/* ============================================================
   DATA HELPERS - Lookup & Utility Functions
   Pure functions that bridge clean JSON data with UI presentation
   ============================================================ */

// Type color palette
const TypeColors = {
    'normal': '#b2bec3',
    'fire': '#ff6b6b',
    'water': '#54a0ff',
    'electric': '#feca57',
    'grass': '#2ecc71',
    'ice': '#74b9ff',
    'fighting': '#d35400',
    'poison': '#9b59b6',
    'ground': '#e17055',
    'flying': '#7fbbf9',
    'psychic': '#eb2f06',
    'bug': '#badc58',
    'rock': '#95a5a6',
    'ghost': '#a55eea',
    'dragon': '#8854d0',
    'dark': '#2d3436',
    'steel': '#95a5a6',
    'fairy': '#fd79a8'
};

/**
 * [Modified] Get Item Sprite URL (with PS fallback)
 * Primary: PokeAPI (kebab-case: "Choice Specs" -> "choice-specs")
 * Fallback: Pokemon Showdown (clean: "Choice Specs" -> "choicespecs")
 */
function getItemIconUrl(itemKey) {
    if (!itemKey) return null;
  
    // PokeAPI 规则：转小写，空格下划线换成中划线，去除非法字符
    // 例如: "Choice Specs" -> "choice-specs"
    const slugPokeAPI = itemKey.toString().toLowerCase()
        .replace(/[\\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // 使用 PokeAPI 的 GitHub 仓库
    return \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${slugPokeAPI}.png\`;
}

/**
 * Get Pokemon Showdown item icon URL (fallback)
 * PS 规则：去除所有非字母数字字符
 * 例如: "King's Rock" -> "kingsrock"
 */
function getItemIconUrlPS(itemKey) {
    if (!itemKey) return null;
    
    // PS 的规则：去空格、去横杠、去引号，只留字母数字
    const slugPS = itemKey.toString().toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    
    return \`https://play.pokemonshowdown.com/sprites/itemicons/\${slugPS}.png\`;
}

/**
 * Normalize a species name into a sprite slug
 * Handles regional adjectives (Hisuian, Alolan, etc.)
 */
function buildSpriteSlug(speciesRaw) {
    if (!speciesRaw) return '';

    let slug = speciesRaw.trim().toLowerCase()
        .replace(/\\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const prefixRules = [
        { prefixes: ['hisuian-', 'hisuian', 'hisui-', 'hisui'], suffix: '-hisui' },
        { prefixes: ['arcean-', 'arcean', 'arcrean-', 'arcrean'], suffix: '-hisui' },
        { prefixes: ['alolan-', 'alolan', 'alola-', 'alola'], suffix: '-alola' },
        { prefixes: ['galarian-', 'galarian', 'galar-', 'galar'], suffix: '-galar' },
        { prefixes: ['paldean-', 'paldean', 'paldea-', 'paldea'], suffix: '-paldea' }
    ];

    for (const rule of prefixRules) {
        for (const prefix of rule.prefixes) {
            if (slug.startsWith(prefix)) {
                const base = slug.slice(prefix.length).replace(/^-+/, '');
                return \`\${base}\${rule.suffix}\`;
            }
        }
    }

    const suffixRules = ['hisui', 'alola', 'galar', 'paldea'];
    for (const suffix of suffixRules) {
        if (slug.endsWith(suffix) && !slug.endsWith(\`-\${suffix}\`)) {
            const base = slug.slice(0, -suffix.length).replace(/-+$/, '');
            return \`\${base}-\${suffix}\`;
        }
    }

    return slug;
}

/**
 * Get sprite URL from species name
 * Uses PokemonDB naming convention by default
 */
function getSpriteUrl(speciesRaw) {
    const slug = buildSpriteSlug(speciesRaw);
    if (!slug) return '';
    return \`https://img.pokemondb.net/sprites/scarlet-violet/normal/\${slug}.png\`;
}

/**
 * Get theme colors and types from species
 * Looks up POKEDEX global variable
 */
function getThemeColors(speciesRaw) {
    const fallback = { p: '#b2bec3', s: '#dfe6e9', types: ['normal'] };
    
    if (!speciesRaw || typeof POKEDEX === 'undefined') return fallback;
    
    const key = speciesRaw.toLowerCase().replace(/\\s+/g, '').replace(/-/g, '');
    const dexEntry = POKEDEX[key];
    
    if (!dexEntry || !dexEntry.types) return fallback;
    
    const types = dexEntry.types.map(t => t.toLowerCase());
    const typeA = types[0];
    const typeB = types[1] || typeA;
    
    return {
        p: TypeColors[typeA] || fallback.p,
        s: TypeColors[typeB] || fallback.s,
        types: types
    };
}

/**
 * Get type color by type name
 */
function getTypeColor(typeName) {
    return TypeColors[typeName.toLowerCase()] || TypeColors['normal'];
}

    <\/script>
    <script>
/* ============================================================
   TRAINER DATABASE (NPC立绘与配置)
   ============================================================ */

const RelationMeta = {
    '-2': { label: 'HOSTILE',  color: '#2d3436', light: '#636e72', icon: '☠️', desc: 'Enemy' },
    '-1': { label: 'COLD',     color: '#e17055', light: '#fab1a0', icon: '❄️', desc: 'Wary' },
    '0':  { label: 'NEUTRAL',  color: '#b2bec3', light: '#dfe6e9', icon: '⚪', desc: 'Stranger' },
    '1':  { label: 'FRIENDLY', color: '#0984e3', light: '#74b9ff', icon: '🔹', desc: 'Acquaintance' },
    '2':  { label: 'TRUSTED',  color: '#00b894', light: '#55efc4', icon: '🍀', desc: 'Friend' },
    '3':  { label: 'CALIB.3',  color: '#fd79a8', light: '#ffcce7', icon: '💗', desc: 'Close' },
    '4':  { label: 'DEVOTED',  color: '#fdcb6e', light: '#ffeaa7', icon: '💍', desc: 'Max Bond' }
};

window.triggerMockBag = function(el) {
    if (!el) return;
    el.classList.add('is-pressing');
    setTimeout(() => el.classList.remove('is-pressing'), 180);

    const messageTitle = 'ACCESS DENIED';
    const messageBody = '战术背包尚未激活或内容为空。';

    if (typeof showCopyNotification === 'function') {
        const notif = document.createElement('div');
        notif.className = 'copy-notification show';
        notif.innerHTML = \`
            <div class="copy-notif-internal">
                <div class="copy-notif-icon" style="color:#ff7675;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div class="copy-notif-text">
                    <div class="copy-notif-title" style="color:#ff7675;">\${messageTitle}</div>
                    <div class="copy-notif-desc">\${messageBody}</div>
                </div>
            </div>
        \`;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2200);
    } else {
        alert(\`\${messageTitle}: \${messageBody}\`);
    }
};

const getItemBadge = (slug) => \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${slug}.png\`;

const BondManifest = {
    'gloria':  { key: 'enable_dynamax', icon: getItemBadge('power-band'),  label: 'DYNAMAX BOND' },
    'rosa':    { key: 'enable_bond',    icon: getItemBadge('soothe-bell'), label: 'LINK BOND' },
    'dawn':    { key: 'enable_insight', icon: getItemBadge('scope-lens'),  label: 'INSIGHT LENS' },
    'akari':   { key: 'enable_styles',  icon: getItemBadge('choice-scarf'),label: 'HISUI ARTS' },
    'serena':  { key: 'enable_mega',    icon: getItemBadge('mega-ring'),   label: 'MEGA EVO' },
    'selene':  { key: 'enable_z_move',  icon: getItemBadge('z-ring'),      label: 'Z POWER' },
    'juliana': { key: 'enable_tera',    icon: getItemBadge('normal-gem'),  label: 'TERASTAL' },
    'may':     { key: 'enable_proficiency_cap', icon: getItemBadge('exp-share'), label: 'LIMIT BREAK' }
};

const ZoneDB = {
    'N': { name: 'NEON',   label: 'Dist.N', color: '#e056fd', shadow: 'rgba(224, 86, 253, 0.35)' },
    'B': { name: 'BLOOM',  label: 'Dist.B', color: '#00cec9', shadow: 'rgba(0, 206, 201, 0.35)' },
    'S': { name: 'SHADOW', label: 'Dist.S', color: '#636e72', shadow: 'rgba(99, 110, 114, 0.4)' },
    'A': { name: 'APEX',   label: 'Dist.A', color: '#eb4d4b', shadow: 'rgba(235, 77, 75, 0.35)' },
    'Z': { name: 'ZENITH', label: 'Cent.Z', color: '#f9ca24', shadow: 'rgba(249, 202, 36, 0.4)' }
};

const ZoneOrder = ['N', 'B', 'S', 'A', 'Z'];

/* ============================================================
   RENDER SOCIAL LIST (NPC grid)
   ============================================================ */
function renderSocialList() {
    const socialPage = document.getElementById('pg-social');
    if (!socialPage) return;

    const npcs = db?.world_state?.npcs || {};
    const npcKeys = Object.keys(npcs);
    const count = npcKeys.length;
    
    // 按好感度从高到低排序
    npcKeys.sort((a, b) => {
        const loveA = npcs[a]?.love ?? 0;
        const loveB = npcs[b]?.love ?? 0;
        const stageA = npcs[a]?.stage ?? 0;
        const stageB = npcs[b]?.stage ?? 0;
        
        // 先按 stage 排序，再按 love 排序
        if (stageB !== stageA) {
            return stageB - stageA;
        }
        return loveB - loveA;
    });
    
    let gridHtml = \`<div id="social-grid-view">\`;
    npcKeys.forEach(key => {
        gridHtml += createNPCCard(key, npcs[key]);
    });
    gridHtml += \`</div>\`;

    socialPage.innerHTML = \`
        <div class="team-header-dash">
             <div class="th-title">RELATION NETWORK</div>
             <div class="th-status-grp">
                 <div class="th-count">\${count} <small>CONNECTIONS</small></div>
             </div>
        </div>
        \${gridHtml}
    \`;
}

function createNPCCard(key, npcData) {
    const stage = (npcData?.stage ?? 0).toString();
    const loveVal = npcData?.love ?? 0;
    const meta = RelationMeta[stage] || RelationMeta['0'];
    const portraitUrl = getTrainerSprite(key);
    const percent = Math.min(100, Math.max(0, (loveVal / 255) * 100));
    const displayName = key.charAt(0).toUpperCase() + key.slice(1);
    
    // 0 好感度显示为 "?"（未解锁）
    const isLocked = loveVal === 0 && stage === '0';
    const displayLove = isLocked ? '?' : loveVal;
    const displayLabel = isLocked ? 'UNKNOWN' : meta.label;

    const bondInfo = BondManifest[key.toLowerCase()];
    let badgeHtml = '';
    if (bondInfo) {
        const bondState = db?.player?.bonds || {};
        const isUnlocked = bondState[bondInfo.key] === true;
        const badgeState = isUnlocked ? 'unlocked' : 'locked';
        badgeHtml = \`
            <div class="npc-bond-badge \${badgeState}" title="\${bondInfo.label}\${isUnlocked ? ' Active' : ' Locked'}">
                <img class="nb-icon-img"
                     src="\${bondInfo.icon}"
                     alt="\${bondInfo.label}"
                     loading="lazy"
                     onerror="this.style.display='none';">
                <span class="nb-bg"></span>
            </div>
        \`;
    }

    return \`
    <div class="npc-card \${isLocked ? 'locked' : ''}" data-stage="\${stage}" style="--r-color:\${meta.color}" title="\${meta.desc}">
        <div class="npc-portrait">
            <img src="\${portraitUrl}" loading="lazy" alt="\${displayName}"
                 onerror="this.src='https://img.pokemondb.net/sprites/black-white/anim/normal/unown-i.gif'; this.style.opacity='0.25'"
                 style="\${isLocked ? 'filter:grayscale(1) brightness(0.7);' : ''}">
        </div>
        \${badgeHtml}
        <div class="npc-info-shade">
            <div class="n-header">
                <span class="n-name">\${displayName}</span>
                <span class="n-stage-icon">\${isLocked ? '❓' : meta.icon}</span>
            </div>
            <div class="n-bar-box">
                <div class="n-bar-label">
                    <span style="color:\${meta.color}">\${displayLabel}</span>
                    <span>\${displayLove}\${isLocked ? '' : '<small style="opacity:0.5;font-weight:500;"> pts</small>'}</span>
                </div>
                <div class="progress-track" style="background:\${meta.light}">
                    <div class="progress-fill" style="width:\${percent}%"></div>
                </div>
            </div>
        </div>
    </div>
    \`;
}

const SpriteAlias = {
    'hex': 'hexmaniac-gen6',
    'juliana': 'juliana-s',
    'nemona': 'nemona-s'
};

function getTrainerSprite(npcName) {
    if (!npcName) {
        return 'https://img.pokemondb.net/sprites/black-white/anim/normal/unown-q.gif';
    }
    let slug = npcName.toLowerCase().trim();
    if (SpriteAlias[slug]) {
        slug = SpriteAlias[slug];
    }
    return \`https://play.pokemonshowdown.com/sprites/trainers/\${slug}.png\`;
}

/* ============================================================
   ERA DATA BRIDGE - 从酒馆 ERA 系统读取数据
   ============================================================ */

// 数据容器（初始为空，由 ERA 填充）
let db = null;
const DefaultSettings = {
    enableAVS: true,
    enableCommander: true,
    enableEVO: true,
    enableBGM: true,
    enableSFX: true,
    enableClash: true
};

let statusClockTimer = null;

// 获取父窗口的事件系统（iframe 内部需要通过 parent 访问）
function getParentWindow() {
    try {
        return window.parent || window;
    } catch (e) {
        return window;
    }
}

// 加载 ERA 数据到 db（从父窗口注入的 window.eraData 获取）
function loadEraData() {
    console.log('[PKM] 正在加载 ERA 数据...');
    
    // 父窗口会在 iframe 加载前注入 window.eraData
    if (window.eraData && window.eraData.player) {
        db = window.eraData;
        console.log('[PKM] ✓ ERA 数据加载成功', db.player?.name);
        return true;
    } else {
        console.warn('[PKM] ERA 数据为空，使用默认空数据');
        db = {
            player: {
                name: 'Trainer',
                bonds: {},
                unlocks: {},
                party: {
                    slot1: { slot: 1, name: null },
                    slot2: { slot: 2, name: null },
                    slot3: { slot: 3, name: null },
                    slot4: { slot: 4, name: null },
                    slot5: { slot: 5, name: null },
                    slot6: { slot: 6, name: null }
                }
            },
            world_state: {
                location: null,
                npcs: {}
            }
        };
        return false;
    }
}

/* ============================================================
   RENDER CONTROLLER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 先加载 ERA 数据
    loadEraData();
    ensureSettingsDefaults();

    // 初始化悬浮状态栏
    initStickyStatusBar();

    // 然后渲染 UI
    renderDashboard();
    renderPartyList();
    renderSocialList();
    renderSettings();
    renderBoxPage();

    // 监听父窗口的刷新消息
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PKM_REFRESH') {
            console.log('[PKM] 收到刷新消息，更新数据...');
            db = event.data.data;
            ensureSettingsDefaults();
            renderDashboard();
            renderPartyList();
            renderSocialList();
            renderSettings();
            renderBoxPage();
            updateClock();
        }
    });
}

/* ============================================================
   PERSISTENT STATUS BAR (GLOBAL HUD)
   ============================================================ */
function initStickyStatusBar() {
    const frame = document.querySelector('.ver-dawn-frame');
    if (!frame) return;

    const existing = frame.querySelector('#sticky-status-bar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.id = 'sticky-status-bar';
    bar.className = 'p-status-bar';
    bar.innerHTML = \`
        <div class="ps-left">
            <div class="net-group">
                <div class="net-signal">
                    <div class="n-bar"></div>
                    <div class="n-bar"></div>
                    <div class="n-bar"></div>
                    <div class="n-bar"></div>
                </div>
                <span class="net-label">R-NET</span>
            </div>
            <div class="back-trigger" onclick="goBackToHome()">
                <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span class="back-txt">Back</span>
            </div>
        </div>

        <div class="ps-center" id="sys-clock">12:00</div>

        <div class="ps-right">
            <span class="batt-val">94%</span>
            <div class="batt-shell">
                <div class="batt-fill"></div>
            </div>
        </div>
    \`;

    frame.insertAdjacentElement('afterbegin', bar);

    updateClock();
    if (statusClockTimer) clearInterval(statusClockTimer);
    statusClockTimer = setInterval(updateClock, 60 * 1000);
}

function updateClock() {
    const clockEl = document.getElementById('sys-clock');
    if (!clockEl) return;

    const now = new Date();
    const timeStr = now
        .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        .replace(/^0/, '');
    clockEl.textContent = timeStr;
}

function renderPartyList() {
    const mainEl = document.getElementById('inject-viewport');
    if (!mainEl) {
        console.error('[PKM] inject-viewport 元素不存在');
        return;
    }
    
    const partyData = db.player.party;
    console.log('[PKM] 渲染队伍列表，槽位数:', Object.keys(partyData).length);
    
    // 过滤掉 transfer_buffer，只显示 slot1-slot6
    const displaySlotKeys = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'];
    const displaySlots = displaySlotKeys.map(key => partyData[key]).filter(Boolean);
    const activeCount = displaySlots.filter(p => p && p.name && p.name !== null).length;
    const maxSlots = 6;

    let dotsHtml = '';
    for (let i = 0; i < maxSlots; i++) {
        const isActive = i < activeCount ? 'active' : '';
        dotsHtml += \`<div class="th-dot \${isActive}"></div>\`;
    }

    const headerHtml = \`
    <div class="team-header-dash">
        <div class="th-title">DEPLOYED UNIT</div>
        <div class="th-status-grp">
            <div class="th-slots-viz">\${dotsHtml}</div>
            <div class="th-count">0\${activeCount} <small>/ 0\${maxSlots}</small></div>
        </div>
    </div>\`;

    let cardsHTML = '';

    // 只渲染 slot1-slot6，不渲染 transfer_buffer
    displaySlotKeys.forEach(slotKey => {
        const pkmNode = partyData[slotKey];
        if (pkmNode) {
            cardsHTML += createCardHTML(pkmNode, slotKey);
        }
    });

    const partyPage = document.getElementById('pg-party');
    if (partyPage) {
        partyPage.innerHTML = headerHtml + cardsHTML;
    } else {
        mainEl.innerHTML = \`<div id="pg-party" class="page curr">\${headerHtml + cardsHTML}</div>
            <div id="pg-social" class="page"></div>
            <div id="pg-settings" class="page"></div>\`;
    }
}

function ensureSettingsDefaults() {
    if (!db) db = {};
    if (!db.settings) {
        db.settings = { ...DefaultSettings };
        return;
    }
    db.settings = { ...DefaultSettings, ...db.settings };
}

/* ============================================================
   RENDER SETTINGS (Config Page)
   ============================================================ */

const SettingsManifest = [
    { 
        key: 'enableAVS', 
        label: 'AVS SYSTEM', 
        desc: 'Affective Value System (Trust/Passion/Insight)', 
        color: '#ff7675'
    },
    { 
        key: 'enableCommander', 
        label: 'CMD. INTERFACE', 
        desc: 'Enable real-time tactical order injections.', 
        color: '#fdcb6e'
    },
    { 
        key: 'enableEVO', 
        label: 'LIMIT BREAK', 
        desc: 'Allow Mid-Battle Evolution (Bio/Bond triggers)', 
        color: '#00cec9'
    },
    { 
        key: 'enableBGM', 
        label: 'DYN. AUDIO', 
        desc: 'Narrative-driven background music adaptation.', 
        color: '#74b9ff'
    },
    { 
        key: 'enableSFX', 
        label: 'SFX FEEDBACK', 
        desc: 'SillyTavern UI Sound Effects pack.', 
        color: '#a29bfe'
    },
    { 
        key: 'enableClash', 
        label: 'CLASH SYSTEM', 
        desc: 'Enable clash mechanics during battle.', 
        color: '#e17055'
    }
];

function renderSettings() {
    const pageEl = document.getElementById('pg-settings');
    if (!pageEl) return;
    const activeCount = Object.values(db?.settings || {}).filter(Boolean).length;

    const headerHtml = \`
    <div class="team-header-dash">
        <div class="th-title">SYSTEM KERNEL</div>
        <div class="th-status-grp">
            <div class="th-count">\${activeCount} <small>MODULES ACTIVE</small></div>
        </div>
    </div>\`;

    let contentHtml = \`<div class="config-grid">\`;

    SettingsManifest.forEach(item => {
        const isActive = db?.settings?.[item.key] === true;
        contentHtml += \`
            <div class="cfg-card \${isActive ? 'active' : ''}" 
                 style="--cfg-color:\${item.color}" 
                 onclick="toggleGlobalSetting('\${item.key}')">
               
                <div class="cfg-info">
                    <span class="cfg-label">\${item.label}</span>
                    <span class="cfg-desc">\${item.desc}</span>
                </div>
              
                <div class="tgl-track \${isActive ? 'active' : ''}">
                    <div class="tgl-thumb"></div>
                </div>
            </div>
        \`;
    });

    contentHtml += \`</div>\`;

    pageEl.innerHTML = headerHtml + contentHtml;
}

window.toggleGlobalSetting = function (key) {
    if (!db) db = {};
    if (!db.settings) {
        db.settings = { ...DefaultSettings };
    }

    db.settings[key] = !db.settings[key];
    console.log('[PKM CONFIG] Setting Changed:', key, db.settings[key]);
    renderSettings();

    // 调用父窗口注入到 iframe window 的回调函数（类似 toggleLeader）
    if (window.pkmUpdateSettingsCallback) {
        console.log('[PKM CONFIG] 调用 pkmUpdateSettingsCallback');
        window.pkmUpdateSettingsCallback(db.settings);
    } else {
        // 降级：使用 postMessage
        const parentWin = window.parent || window;
        parentWin.postMessage({
            type: 'PKM_UPDATE_SETTINGS',
            data: db.settings
        }, '*');
    }
};

function createCardHTML(pkm, slotIdStr) {
    if (!pkm || !pkm.name || pkm.name === null) {
        const slotNum = slotIdStr.replace("slot", "0");
        return \`
        <div class="dash-card-box empty">
            <div class="dcb-inner">
                <span class="empty-placeholder">SLOT \${slotNum} OPEN</span>
            </div>
        </div>
        \`;
    }

    const isLead = pkm.isLead === true;
    const slotDisplay = ("0" + pkm.slot).slice(-2);
    // 优先使用 species，如果为空则使用 name
    const speciesName = pkm.species || pkm.name;
    
    // [超级回退方案] Chain: [朱紫] --> (404?) --> [剑盾] --> (404?) --> [像素]
    const rawSlug = String(speciesName).trim().toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const spriteSlug = (typeof buildSpriteSlug === 'function' ? buildSpriteSlug(speciesName) : rawSlug) || rawSlug;
    const showdownSlug = spriteSlug.replace(/[^a-z0-9-]/g, '');
    const hasRegionalSuffix = /-(hisui|alola|galar|paldea)$/.test(showdownSlug);
    const slugPixel = hasRegionalSuffix ? showdownSlug : showdownSlug.replace(/-/g, '');

    let url_sv   = \`https://img.pokemondb.net/sprites/scarlet-violet/normal/\${spriteSlug}.png\`;
    let url_swsh = \`https://img.pokemondb.net/sprites/sword-shield/normal/\${spriteSlug}.png\`;
    let url_px   = \`https://play.pokemonshowdown.com/sprites/gen5/\${slugPixel}.png\`;

    let regionalClass = '';
    if (/-hisui$/.test(showdownSlug)) {
        url_sv = \`https://play.pokemonshowdown.com/sprites/gen5/\${showdownSlug}.png\`;
        url_swsh = \`https://play.pokemonshowdown.com/sprites/ani/\${showdownSlug}.gif\`;
        url_px = \`https://play.pokemonshowdown.com/sprites/gen5/\${showdownSlug}.png\`;
        regionalClass = 'regional-sprite';
    } else if (hasRegionalSuffix) {
        regionalClass = 'regional-sprite';
    }
    
    const theme = getThemeColors(speciesName);
    const itemUrl = getItemIconUrl(pkm.item);
    const itemUrlPS = getItemIconUrlPS(pkm.item);
    const avsData = (pkm.friendship && pkm.friendship.avs) || { trust: 0, passion: 0, insight: 0, devotion: 0 };
    const maxCheck = (val) => val >= 255 ? 'maxed' : '';
    
    let displayName = pkm.nickname || pkm.name;
    if (!pkm.nickname && pkm.species) {
        displayName = pkm.species.charAt(0).toUpperCase() + pkm.species.slice(1);
    }
    displayName = displayName.toUpperCase();

    let genderHtml = '';
    const genderKey = (pkm.gender || '').toUpperCase();
    if (genderKey === 'M') {
        genderHtml = \`<span class="gender-mark male">♂</span>\`;
    } else if (genderKey === 'F') {
        genderHtml = \`<span class="gender-mark female">♀</span>\`;
    } else {
        genderHtml = \`<span class="gender-mark neutral">∅</span>\`;
    }

    const shinyBadge = pkm.shiny ? '<span class="shiny-mark">✨</span>' : '';

    const boxClass = isLead ? "dash-card-box is-leader" : "dash-card-box";
    const leaderBadgeHtml = isLead
        ? \`<div class="lead-tag"><span class="lead-text">LEAD</span></div>\`
        : '';
    const actionClass = isLead ? "leader-action active" : "leader-action";
    const actionTitle = isLead ? "Current Point Pokemon" : "Set to Leader";
    const clickHandler = isLead ? '' : \`onclick="toggleLeader(event, '\${slotIdStr}')"\`;
    const leaderBtnHtml = \`
        <div class="\${actionClass}" \${clickHandler} title="\${actionTitle}">
            <svg viewBox="0 0 24 24">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
        </div>
    \`;

    const typeChips = theme.types.map(t =>
        \`<div class="type-mini" style="background:\${getTypeColor(t)}"><span>\${t.toUpperCase()}</span></div>\`
    ).join('');

    const moveOrder = ['move1', 'move2', 'move3', 'move4'];
    const movesHtml = moveOrder.map(key => {
        const moveName = pkm?.moves?.[key];
        if (moveName) {
            return \`<div class="k-move-shell"><span>\${moveName}</span></div>\`;
        }
        return \`<div class="k-move-shell empty"><span>—</span></div>\`;
    }).join('');

    const statMap = { 'hp': 'H', 'atk': 'A', 'def': 'B', 'spa': 'C', 'spd': 'D', 'spe': 'S' };
    let ivsHtml = '';

    if (pkm.stats_meta && pkm.stats_meta.ivs) {
        Object.keys(statMap).forEach(key => {
            const val = pkm.stats_meta.ivs[key] || 0;
            const isMax = val === 31;
            ivsHtml += \`<div class="chip-cell \${isMax ? 'max' : ''}" data-stat="\${statMap[key]}">\${val}</div>\`;
        });
    }

    const itemHtml = pkm.item ? 
        \`<div class="item-box" data-name="\${pkm.item}">
            <img src="\${itemUrl}" 
                 alt="\${pkm.item}"
                 onerror="if(!this.dataset.triedPS){this.dataset.triedPS=true;this.src='\${itemUrlPS}';}else{this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';}" 
            />
          </div>\` : '';
    const avsDashboardHtml = \`
        <div class="avs-dashboard" id="avs-panel-\${slotIdStr}" onclick="event.stopPropagation()">
            <div class="avs-stat-item asi-stat-trust">
                <span class="asi-label">TRUST</span>
                <span class="asi-val \${maxCheck(avsData.trust)}">\${avsData.trust}</span>
            </div>
            <div class="avs-stat-item asi-stat-passion">
                <span class="asi-label">PASSION</span>
                <span class="asi-val \${maxCheck(avsData.passion)}">\${avsData.passion}</span>
            </div>
            <div class="avs-stat-item asi-stat-insight">
                <span class="asi-label">INSIGHT</span>
                <span class="asi-val \${maxCheck(avsData.insight)}">\${avsData.insight}</span>
            </div>
            <div class="avs-stat-item asi-stat-devotion">
                <span class="asi-label">DEVOTION</span>
                <span class="asi-val \${maxCheck(avsData.devotion)}">\${avsData.devotion}</span>
            </div>
        </div>
    \`;

    return \`
    <div class="\${boxClass}" 
         data-slot="\${slotDisplay}" 
         onclick="toggleCard(this)" 
         style="--prim-color: \${theme.p}; --sec-color: \${theme.s}; cursor: pointer;">
        <div class="dcb-inner card-layout">
            <div class="pkm-summary" data-slot="\${slotDisplay}">
                \${avsDashboardHtml}
                <div class="p-visual-grp">
                    <div class="p-avatar">
                        <img src="\${url_sv}" 
                             loading="lazy" 
                             alt="\${pkm.species}"
                             class="\${regionalClass}"
                             onerror="
                                 if (!this.dataset.triedSwsh) {
                                     this.dataset.triedSwsh = true; 
                                     this.src = '\${url_swsh}';
                                 } else {
                                     this.onerror = null; 
                                     this.src = '\${url_px}'; 
                                     this.className = 'pixel-fallback';
                                 }
                             "
                             style="transition: 0.2s;">
                    </div>
                    <div class="p-texts">
                        <div class="p-meta-line">
                            <span>NO.\${slotDisplay}</span>
                            <span>Lv.<b class="p-lv-val">\${pkm.lv}</b></span>
                            \${shinyBadge}
                            \${leaderBadgeHtml}
                        </div>
                        <div class="p-name">\${displayName}\${genderHtml}</div>
                    </div>
                </div>
                <div class="summary-actions">
                    \${leaderBtnHtml}
                    <div class="avs-action" onclick="toggleAVS(event, '\${slotIdStr}')" title="Affinity Gauge">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <div class="expand-action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="pkm-details">
                <div class="details-overflow">
                    <div class="detail-padder tech-mode">
                        <div class="top-rail">
                            <div class="element-grp">
                                \${typeChips}
                            </div>
                            <div class="meta-chips">
                                <div class="m-tag nature"><span>\${pkm.nature}</span></div>
                                <div class="m-tag ability"><span>\${pkm.ability}</span></div>
                            </div>
                            \${itemHtml}
                        </div>
                        <div class="kinetic-moves">
                            \${movesHtml}
                        </div>
                        <div class="bot-stat-strip">
                            <div class="ivs-group">
                                <span class="micro-lbl">IVs</span>
                                <div class="hex-chips">
                                    \${ivsHtml}
                                </div>
                            </div>
                            <div class="evs-group">
                                <span class="micro-lbl">TOTAL EVs</span>
                                <span class="evs-val">\${pkm.stats_meta ? pkm.stats_meta.ev_level : 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    \`;
}

/* ============================================================
   HELPER UTILS
   ============================================================ */
function getSvgIcon(code) {
    const svgs = {
        'mega': '<svg viewBox="0 0 14 17.5" fill="currentColor"><g><path d="M3.88792,10.9 C5.96264,10.9,8.03736,10.9,10.1121,10.9 C11.0183,10.9426,11.0183,9.45744,10.1121,9.5 C8.03736,9.5,5.96264,9.5,3.88792,9.5 C2.98166,9.45744,2.98166,10.9426,3.88792,10.9 z"/><path d="M2.75289,2 C2.75289,2.10488,2.75289,2.20976,2.75289,2.31464 C2.75355,4.80881,4.40963,6.99632,6.81004,7.67374 C8.60567,8.17928,9.84777,9.81993,9.84711,11.6854 C9.84711,11.7903,9.84711,11.8951,9.84711,12 C9.80455,12.9063,11.2897,12.9063,11.2471,12 C11.2471,11.8951,11.2471,11.7903,11.2471,11.6854 C11.2464,9.19119,9.59033,7.00368,7.18992,6.32626 C5.39429,5.82072,4.15223,4.18007,4.15289,2.31464 C4.15289,2.20976,4.15289,2.10488,4.15289,2 C4.19545,1.09374,2.71033,1.09374,2.75289,2 z"/><g><path d="M6.99988,6.26793 C6.93733,6.28879,6.87403,6.30825,6.81004,6.32626 C4.40962,7.00368,2.75355,9.1912,2.75289,11.6854 C2.75289,11.6854,2.75289,12,2.75289,12 C2.71033,12.9063,4.19545,12.9063,4.15289,12 C4.15289,12,4.15289,11.6854,4.15289,11.6854 C4.15223,9.81992,5.3943,8.17928,7.18992,7.67374 C7.73053,7.52117,8.23338,7.29202,8.68807,7.00001 C8.23346,6.70808,7.73068,6.47894,7.19012,6.32632 C7.12599,6.30829,7.06257,6.28881,6.99988,6.26793 z"/><path d="M8.21185,5.62527 C9.21994,4.85339,9.84758,3.64081,9.84711,2.31464 C9.84711,2.31464,9.84711,2,9.84711,2 C9.80455,1.09375,11.2897,1.09374,11.2471,2 C11.2471,2,11.2471,2.31464,11.2471,2.31464 C11.2467,3.88075,10.5936,5.32595,9.51336,6.35232 C9.1132,6.06454,8.67745,5.81966,8.21185,5.62527 z"/></g><g><path d="M6.02737,4.5 C6.02737,4.5,10.1121,4.5,10.1121,4.5 C11.0183,4.54256,11.0183,3.05744,10.1121,3.1 C10.1121,3.1,5.2513,3.1,5.2513,3.1 C5.38672,3.62909,5.65656,4.11049,6.02737,4.5 z"/></g></g></svg>',
        'z': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 2L4 13h6l-2 9 9.5-12H10l3-8z"/></svg>',
        'dmax': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5l6.5 13h-13L12 5.5zM12 8l-2 4h4l-2-4z"/></svg>',
        'tera': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-9.5 5.5v9L12 22l9.5-5.5v-9L12 2zM12 19.5L5.5 15.8v-7.6L12 4.5l6.5 3.7v7.6L12 19.5z"/><path d="M12 7.5L8 10l4 2.5 4-2.5-4-2.5z"/></svg>',
        'bond': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        'style': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 93.75" fill="currentColor"><path transform="scale(.75)" d="m50 5.8594c-11.79 0-22.876 4.5903-31.213 12.928-8.3374 8.3366-12.928 19.422-12.928 31.213s4.5903 22.874 12.928 31.211c2.8053 2.8061 5.9253 5.1857 9.2754 7.1113-2.8564-4.2252-4.5273-9.3145-4.5273-14.787 0-14.593 11.872-26.465 26.465-26.465 11.362 0 20.605-9.2438 20.605-20.605s-9.2438-20.605-20.605-20.605zm21.939 5.8184c2.8572 4.2252 4.5254 9.3146 4.5254 14.787 0 14.593-11.872 26.465-26.465 26.465-11.362 0-20.605 9.2438-20.605 20.605s9.2438 20.605 20.605 20.605c11.79 0 22.876-4.5923 31.213-12.93 8.3374-8.3367 12.928-19.42 12.928-31.211s-4.5903-22.876-12.928-31.213c-2.8053-2.8061-5.9234-5.1837-9.2734-7.1094zm-21.939 3.0625c6.4652 0 11.725 5.2602 11.725 11.725 0 6.4644-5.2595 11.723-11.725 11.723-6.4652 0-11.725-5.2575-11.725-11.723-2e-6 -6.4651 5.2595-11.725 11.725-11.725zm0 5.8594c-3.2341 0-5.8652 2.6311-5.8652 5.8652-2e-6 3.2341 2.6311 5.8633 5.8652 5.8633 3.2341 0 5.8652-2.6292 5.8652-5.8633 0-3.2341-2.6311-5.8652-5.8652-5.8652zm0 41.211c6.4652 0 11.725 5.2594 11.725 11.725s-5.2595 11.723-11.725 11.723c-6.4652 0-11.725-5.2575-11.725-11.723-2e-6 -6.4652 5.2595-11.725 11.725-11.725zm0 5.8594c-3.2341 0-5.8652 2.6311-5.8652 5.8652s2.6311 5.8633 5.8652 5.8633c3.2341-1e-6 5.8652-2.6292 5.8652-5.8633s-2.6311-5.8652-5.8652-5.8652z" stroke-width=".19531"/></svg>',
        'eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
        'cap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>'
    };
    return svgs[code] || '';
}


function switchPage(targetId, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('curr', 'sub-page'));

    const target = document.getElementById(\`pg-\${targetId}\`);
    if (target) {
        target.classList.add('curr');
        if (targetId !== 'dashboard') target.classList.add('sub-page');
    }

    if (targetId === 'box') {
        renderBoxPage();
    } else if (targetId === 'dashboard') {
        renderDashboard();
    } else if (targetId === 'party') {
        renderPartyList();
    } else if (targetId === 'social') {
        renderSocialList();
    } else if (targetId === 'settings') {
        renderSettings();
    }

    const sb = document.getElementById('sticky-status-bar');
    if (sb) {
        if (targetId === 'dashboard') sb.classList.remove('sub-mode');
        else sb.classList.add('sub-mode');
    }
}

// 打开子页面（从 Dashboard 进入）
window.openAppPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('curr', 'sub-page'));

    const target = document.getElementById(\`pg-\${pageId}\`);
    if (target) {
        target.classList.add('curr', 'sub-page');

        if (pageId === 'box') {
            renderBoxPage();
        } else if (pageId === 'party') {
            renderPartyList();
        } else if (pageId === 'social') {
            renderSocialList();
        } else if (pageId === 'settings') {
            renderSettings();
        }
    }

    const sb = document.getElementById('sticky-status-bar');
    if (sb) sb.classList.add('sub-mode');
};

// 顶部返回按钮
window.goBackToHome = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('curr', 'sub-page'));

    const dashPage = document.getElementById('pg-dashboard');
    if (dashPage) {
        dashPage.classList.add('curr');
        renderDashboard();
    }

    const sb = document.getElementById('sticky-status-bar');
    if (sb) sb.classList.remove('sub-mode');
};

function toggleMechBar() {
    const mechBar = document.getElementById('mech-bar');
    if (!mechBar) return;
    
    // 找到同一个容器内的按钮
    const wrapper = mechBar.closest('.mech-wrapper');
    const mechBtn = wrapper ? wrapper.querySelector('.mech-btn') : document.querySelector('.mech-btn');
    
    const isExpanded = mechBar.classList.toggle('expanded');
    if (mechBtn) mechBtn.classList.toggle('open', isExpanded);
}

window.toggleCard = function(cardElement) {
    if (!cardElement) return;
    if (cardElement.classList.contains('empty')) return;
    
    cardElement.classList.toggle('open');
    console.log('Toggle:', cardElement.dataset.slot, cardElement.classList.contains('open'));
};

window.toggleAVS = function(event, slotKey) {
    event.stopPropagation();
    const panel = document.getElementById(\`avs-panel-\${slotKey}\`);
    const btn = event.currentTarget;
    if (!panel || !btn) return;

    const isVisible = panel.classList.toggle('visible');
    btn.classList.toggle('active', isVisible);

    document.querySelectorAll('.avs-dashboard.visible').forEach(el => {
        if (el !== panel) {
            el.classList.remove('visible');
        }
    });
    document.querySelectorAll('.avs-action.active').forEach(el => {
        if (el !== btn) {
            el.classList.remove('active');
        }
    });
};

/* ============================================================
   [ADDON] BOX SYSTEM LOGIC (PC/Storage Manager)
   依赖前端的虚拟分页逻辑，不占用后台 Context
   ============================================================ */

// 状态管理
let boxState = {
    selectedPartIdxs: [],    // 当前选中的队伍槽位数组 (0-5)
    selectedBoxKeys: [],     // 当前选中的盒子Key数组 (字符串，有宝可梦的格子)
    selectedEmptyIdxs: [],   // 当前选中的空白格子索引数组 (用于存入)
    isLocked: false          // 区域锁定状态
};

// 允许连接网络的区域代码
const ALLOWED_ZONES = ['N', 'B', 'Z']; 

function buildGenderMark(gender) {
    const genderKey = (gender || '').toUpperCase();
    if (genderKey === 'M') return '<span class="gender-mark male">♂</span>';
    if (genderKey === 'F') return '<span class="gender-mark female">♀</span>';
    return '<span class="gender-mark neutral">∅</span>';
}

/* --- 1. [核心] 渲染 BOX 页面 --- */
function renderBoxPage() {
    console.log('[BOX] renderBoxPage 被调用');
    const boxPage = document.getElementById('pg-box');
    if (!boxPage) {
        console.error('[BOX] pg-box 元素不存在');
        return;
    }
    console.log('[BOX] db.player.box =', db?.player?.box);

    // A. 区域锁判定 (location 可能是对象或字符串)
    const locData = db?.world_state?.location;
    const currentLoc = (typeof locData === 'string' ? locData : (locData?.quadrant || 'Z')).toUpperCase();
    const zoneName = ZoneDB[currentLoc]?.label || 'Unkown Zone';
    boxState.isLocked = !ALLOWED_ZONES.includes(currentLoc);
    
    // 添加/移除 locked class
    if (boxState.isLocked) {
        boxPage.classList.add('locked');
    } else {
        boxPage.classList.remove('locked');
    }

    // B. 初始化 HTML 框架
    let html = \`
        <div class="box-header-strip storage-green">
            <span class="box-header-title">CURRENT PARTY (HAND)</span>
        </div>
    \`;

    // 队伍区域
    const partyData = db.player.party;
    html += \`<div class="box-party-grid">\`;
    for (let i = 1; i <= 6; i++) {
        const slotKey = \`slot\${i}\`;
        const pkm = partyData[slotKey];
        html += renderBoxPartyCard(pkm, i - 1);
    }
    html += \`</div>\`;

    // 盒子区域头
    html += \`
        <div class="box-header-strip storage-green">
            <span class="box-header-title">CLOUD STORAGE (SERVER)</span>
        </div>
    \`;

    // 盒子容器
    html += \`<div class="box-storage-area"><div class="box-storage-matrix">\`;
  
    // [对象模式] 将 box 对象转为带 Key 的数组
    // 不再初始化 Mock 数据，完全依赖 ERA 系统
    const boxEntries = Object.entries(db.player.box || {});
    // boxEntries 结构: [ ["key1", {data}], ["key2", {data}] ]
  
    // 渲染盒子格子 (至少渲染30个格子补充版面)
    const totalCells = Math.max(30, boxEntries.length + 5);
    for (let i = 0; i < totalCells; i++) {
        if (i < boxEntries.length) {
            const [key, pkmData] = boxEntries[i];
            html += renderStorageCell(pkmData, key, i);
        } else {
            // 空白格子，传入 cellIndex 用于存入操作
            html += renderStorageCell(null, null, i);
        }
    }
    html += \`</div></div>\`;

    // C. 锁区覆盖层
    if (boxState.isLocked) {
        const errorMsgByZone = {
            'S': 'WARNING: 暗影区强干扰覆盖',
            'A': 'SECURITY: 竞技场比赛通讯屏蔽',
            'DEFAULT': 'ERR_CONNECTION_REFUSED'
        };
        const zoneReason = errorMsgByZone[currentLoc] || errorMsgByZone['DEFAULT'];

        html += \`
        <div class="box-offline-overlay">
            <div class="boo-bg-deco">SYSTEM LOCKED</div>
            <div class="boo-content">
                <div class="boo-icon-wrap">
                    <svg class="boo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10" stroke-opacity="0.2"></circle>
                        <path d="M1 1l22 22" class="slash-line"></path>
                        <path d="M4.93 4.93L19.07 19.07" stroke-width="8" stroke="#fff"></path>
                        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" opacity="0.6"></path>
                        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    </svg>
                </div>
                <div class="boo-title">SIGNAL LOST</div>
                <span class="boo-code">/// 0x0000_ACCESS_DENIED ///</span>
                <div class="boo-alert-box">
                    <div class="boo-main-reason">\${zoneReason}</div>
                    <div class="boo-hint">
                        因区域协议限制，只有在 [安全区] 才能使用PC Boxes
                    </div>
                </div>
            </div>
            <div class="boo-terminal">
                <span>> Detecting available networks... [0] found.</span>
                <span>> Protocol handshake canceled by server_guard.</span>
            </div>
        </div>\`;
    }

    boxPage.innerHTML = html;
}

// initMockBox 已删除 - 完全依赖 ERA 系统数据

/* --- 2. 渲染组件 (HTML Generators) --- */

/* ============================================================
   [FIX v2] 智能缓存与稳定加载 Image Handler
   ============================================================ */

if (!window._pkmIconVerifyCache) {
    window._pkmIconVerifyCache = {};
}

function generateSmartIconHex(name, cssClass = "") {
    if (!name) return "";
    const rawSlug = String(name).trim().toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const spriteSlug = (typeof buildSpriteSlug === 'function' ? buildSpriteSlug(name) : rawSlug) || rawSlug;
    const showdownSlug = spriteSlug.replace(/[^a-z0-9-]/g, '');
    const showdownMenuSlug = showdownSlug.replace(/-/g, '');
    const cacheKey = spriteSlug || showdownMenuSlug;
    
    const hasRegionalSuffix = /-(hisui|alola|galar|paldea)$/.test(spriteSlug);
    const regionalIconClass = hasRegionalSuffix ? 'regional-icon' : '';
    const finalClass = [cssClass, regionalIconClass].filter(Boolean).join(' ');

    let src1 = \`https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/\${spriteSlug}.png\`;
    let src2 = \`https://play.pokemonshowdown.com/sprites/gen5/\${showdownSlug}.png\`;
    let src3 = \`https://play.pokemonshowdown.com/sprites/menu/\${showdownMenuSlug}.png\`;
    const src4 = \`https://img.pokemondb.net/sprites/black-white/anim/normal/unown-q.gif\`;

    if (spriteSlug === 'zorua-hisui') {
        src1 = \`https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/zorua-hisui.png\`;
        src2 = \`https://play.pokemonshowdown.com/sprites/gen5/zorua-hisui.png\`;
        src3 = \`https://play.pokemonshowdown.com/sprites/menu/zoruahisui.png\`;
    }

    if (window._pkmIconVerifyCache[cacheKey]) {
        return \`<img src="\${window._pkmIconVerifyCache[cacheKey]}" class="\${finalClass}" loading="lazy">\`;
    }

    return \`<img src="\${src1}" loading="lazy" class="\${finalClass}"
        onload="window._pkmIconVerifyCache['\${cacheKey}'] = this.src"
        onerror="
            if(!this.dataset.step){ 
                this.dataset.step = 1; 
                this.src='\${src2}'; 
            } else if(this.dataset.step == 1){
                this.dataset.step = 2;
                this.src='\${src3}';
            } else {
                this.onerror = null;
                this.style.opacity = 0.5;
                this.src='\${src4}';
            }
        ">\`;
}

function renderBoxPartyCard(pkm, idx) {
    const isSelected = boxState.selectedPartIdxs.includes(idx);
    const isEmpty = (!pkm || !pkm.name);

    if (isEmpty) {
        return \`
        <div class="box-char-card empty \${isSelected ? 'selected' : ''}" 
             onclick="handlePartyClick(\${idx})">
            <div class="bcc-inner">
                <span class="bcc-name">EMPTY SLOT</span>
            </div>
        </div>\`;
    }

    const imgHtml = generateSmartIconHex(pkm.name);

    const theme = getThemeColors(pkm.name); 
    const genderHtml = buildGenderMark(pkm.gender);

    return \`
    <div class="box-char-card \${isSelected ? 'selected' : ''}" onclick="handlePartyClick(\${idx})">
        <div class="bcc-inner">
            <div class="bcc-icon">\${imgHtml}</div>
            <div class="bcc-info">
                <div class="bcc-name">\${pkm.nickname || pkm.name}</div>
                <div class="bcc-lv">Lv.\${pkm.lv} \${genderHtml}</div>
            </div>
            <div class="bcc-type" style="background:\${theme.p}"></div>
        </div>
    </div>\`;
}

function renderStorageCell(pkm, key, cellIndex) {
    const isSelected = key 
        ? boxState.selectedBoxKeys.includes(key) 
        : boxState.selectedEmptyIdxs.includes(cellIndex);

    if (!pkm) {
        return \`<div class="storage-cell empty \${isSelected ? 'selected' : ''}" onclick="handleEmptyBoxClick(\${cellIndex})"></div>\`;
    }

    const imgHtml = generateSmartIconHex(pkm.name, "sc-img");

    return \`
    <div class="storage-cell \${isSelected ? 'selected' : ''}" onclick="handleBoxClick('\${key}')">
        \${imgHtml}
        <span class="sc-lv">L.\${pkm.lv}</span>
        \${pkm.shiny ? '<span class="sc-shiny">★</span>' : ''}
    </div>\`;
}

/* --- 3. 交互逻辑 (Handlers) --- */

window.handlePartyClick = function(idx) {
    if (boxState.isLocked) return;
    // Toggle 逻辑：点击已选中的取消，未选中的添加
    const arrIdx = boxState.selectedPartIdxs.indexOf(idx);
    if (arrIdx !== -1) {
        boxState.selectedPartIdxs.splice(arrIdx, 1);
    } else {
        boxState.selectedPartIdxs.push(idx);
    }
  
    refreshBoxUI();
    updateOpsBar(); 
};

window.handleBoxClick = function(key) {
    if (boxState.isLocked || !key) return;
  
    // 点击有宝可梦的格子时，清除空白格子选中
    boxState.selectedEmptyIdxs = [];
    
    // Toggle 逻辑
    const arrIdx = boxState.selectedBoxKeys.indexOf(key);
    if (arrIdx !== -1) {
        boxState.selectedBoxKeys.splice(arrIdx, 1);
    } else {
        boxState.selectedBoxKeys.push(key);
    }

    refreshBoxUI();
    updateOpsBar();
};

// 点击空白盒子格子（用于存入）
window.handleEmptyBoxClick = function(cellIndex) {
    console.log('[BOX] handleEmptyBoxClick 被调用, cellIndex =', cellIndex);
    console.log('[BOX] isLocked =', boxState.isLocked);
    
    if (boxState.isLocked) return;
    
    // 点击空白格子时，清除有宝可梦格子的选中
    boxState.selectedBoxKeys = [];
    
    // Toggle 逻辑
    const arrIdx = boxState.selectedEmptyIdxs.indexOf(cellIndex);
    if (arrIdx !== -1) {
        boxState.selectedEmptyIdxs.splice(arrIdx, 1);
    } else {
        boxState.selectedEmptyIdxs.push(cellIndex);
    }

    console.log('[BOX] selectedEmptyIdxs 更新为:', boxState.selectedEmptyIdxs);
    
    refreshBoxUI();
    updateOpsBar();
};

function refreshBoxUI() {
    renderBoxPage(); // 重新执行 renderBoxPage 会读取 boxState 里的选中下标
}

window.resetBoxSelection = function() {
    boxState.selectedPartIdxs = [];
    boxState.selectedBoxKeys = [];
    boxState.selectedEmptyIdxs = [];
    // 不刷新整个页面，只更新操作栏和选中状态的视觉效果
    document.querySelectorAll('.box-char-card.selected, .storage-cell.selected').forEach(el => {
        el.classList.remove('selected');
    });
    updateOpsBar();
};

// 更新底部操作栏状态 (支持多选)
function updateOpsBar() {
    const bar = document.getElementById('box-ops-console');
    if (!bar) return;

    const pIdxs = boxState.selectedPartIdxs;
    const bKeys = boxState.selectedBoxKeys;
    const emptyIdxs = boxState.selectedEmptyIdxs;

    // 没人选中 -> 隐藏
    if (pIdxs.length === 0 && bKeys.length === 0 && emptyIdxs.length === 0) {
        bar.classList.remove('active');
        return;
    }

    bar.classList.add('active');

    // 获取选中的队伍名称列表
    const partyNames = pIdxs.map(idx => {
        const pkm = db.player.party[\`slot\${idx+1}\`];
        return pkm?.name || null;
    });
    const filledPartyCount = partyNames.filter(n => n !== null).length;
    const emptyPartyCount = partyNames.filter(n => n === null).length;

    // 获取选中的盒子名称列表
    const boxNames = bKeys.map(key => db.player.box[key]?.name || "Unknown");

    let htmlInner = "";
    const prefixStyle = \`style="color: #636e72; font-weight:900; margin-right:6px; opacity:0.8"\`;
    const countStyle = \`style="color: #0984e3; font-weight:900;"\`;

    // 判断操作类型和合法性
    const hasParty = pIdxs.length > 0;
    const hasBoxPkm = bKeys.length > 0;
    const hasEmptyBox = emptyIdxs.length > 0;

    if (hasParty && hasEmptyBox && filledPartyCount > 0) {
        // [批量存入] 队伍数量必须等于空位数量
        if (filledPartyCount === emptyIdxs.length) {
            const namesStr = partyNames.filter(n => n).join(', ');
            htmlInner = \`<span \${prefixStyle}>CMD: BATCH STORE</span> <span \${countStyle}>[\${filledPartyCount}]</span> <span class="ops-highlight">\${namesStr}</span> <span style="color:#b2bec3; margin:0 5px;">»</span> SERVER\`;
        } else {
            htmlInner = \`<span \${prefixStyle}>ERR:</span> <span style="color:#e74c3c;">队伍选中 \${filledPartyCount} 个，空位选中 \${emptyIdxs.length} 个，数量不匹配</span>\`;
        }
    } else if (hasParty && hasBoxPkm) {
        // [批量交换/取出] 队伍数量必须等于盒子数量
        if (pIdxs.length === bKeys.length) {
            if (filledPartyCount === pIdxs.length) {
                // 全是有宝可梦的槽位 = 批量交换
                const pNamesStr = partyNames.join(', ');
                const bNamesStr = boxNames.join(', ');
                htmlInner = \`<span \${prefixStyle}>CMD: BATCH SWAP</span> <span \${countStyle}>[\${pIdxs.length}]</span> <span class="ops-highlight">\${pNamesStr}</span> <span style="color:#00cec9; margin:0 2px;">⇄</span> <span class="ops-highlight">\${bNamesStr}</span>\`;
            } else if (emptyPartyCount === pIdxs.length) {
                // 全是空槽位 = 批量取出
                const bNamesStr = boxNames.join(', ');
                htmlInner = \`<span \${prefixStyle}>CMD: BATCH RETRIEVE</span> <span \${countStyle}>[\${bKeys.length}]</span> SERVER <span style="color:#b2bec3; margin:0 5px;">»</span> <span class="ops-highlight">\${bNamesStr}</span>\`;
            } else {
                // 混合情况 = 批量操作（部分交换部分取出）
                htmlInner = \`<span \${prefixStyle}>CMD: BATCH TRANSFER</span> <span \${countStyle}>[\${pIdxs.length}]</span> <span class="ops-highlight">混合操作</span>\`;
            }
        } else {
            htmlInner = \`<span \${prefixStyle}>ERR:</span> <span style="color:#e74c3c;">队伍选中 \${pIdxs.length} 个，盒子选中 \${bKeys.length} 个，数量不匹配</span>\`;
        }
    } else if (hasParty) {
        // 等待选择盒子
        const namesStr = partyNames.map((n, i) => n || \`SLOT\${pIdxs[i]+1}(空)\`).join(', ');
        htmlInner = \`<span \${prefixStyle}>STATUS:</span> TARGETING <span \${countStyle}>[\${pIdxs.length}]</span> <span class="ops-highlight">\${namesStr}</span> <span style="color:#b2bec3">...SELECT BOX</span>\`;
    } else if (hasBoxPkm) {
        // 等待选择队伍
        const namesStr = boxNames.join(', ');
        htmlInner = \`<span \${prefixStyle}>STATUS:</span> TARGETING <span \${countStyle}>[\${bKeys.length}]</span> <span class="ops-highlight">\${namesStr}</span> <span style="color:#b2bec3">...SELECT SLOT</span>\`;
    } else if (hasEmptyBox) {
        // 只选了空位，等待选择队伍
        htmlInner = \`<span \${prefixStyle}>STATUS:</span> SELECTED <span \${countStyle}>[\${emptyIdxs.length}]</span> EMPTY CELLS <span style="color:#b2bec3">...SELECT PARTY</span>\`;
    }

    bar.innerHTML = \`
        <div class="ops-text-row">
            <div class="ops-log">
                \${htmlInner}
            </div>
        </div>
        <div class="ops-action-row">
            <button class="btn-ops-cancel" onclick="resetBoxSelection()">RESET</button>
            <button class="btn-ops-confirm" onclick="confirmBoxTransfer()">EXECUTE</button>
        </div>
    \`;
}

/* --- 4. 生成与执行 (Execution) --- */

// 生成空槽位结构的辅助函数
function createEmptySlot(slotNum) {
    return {
        slot: slotNum,
        name: null,
        nickname: null,
        species: null,
        gender: null,
        lv: null,
        quality: null,
        nature: null,
        ability: null,
        shiny: false,
        item: null,
        mechanic: null,
        teraType: null,
        isAce: false,
        isLead: false,
        friendship: {
            avs: { trust: 0, passion: 0, insight: 0, devotion: 0 },
            av_up: { trust: 0, passion: 0, insight: 0, devotion: 0 }
        },
        moves: { move1: null, move2: null, move3: null, move4: null },
        stats_meta: {
            ivs: { hp: null, atk: null, def: null, spa: null, spd: null, spe: null },
            ev_level: 0,
            ev_up: 0
        },
        notes: null
    };
}

window.confirmBoxTransfer = function() {
    const pIdxs = boxState.selectedPartIdxs;
    const bKeys = boxState.selectedBoxKeys;
    const emptyIdxs = boxState.selectedEmptyIdxs;

    const hasParty = pIdxs.length > 0;
    const hasBoxPkm = bKeys.length > 0;
    const hasEmptyBox = emptyIdxs.length > 0;

    if (!hasParty) {
        alert("请先选择队伍槽位。");
        return;
    }

    if (!hasBoxPkm && !hasEmptyBox) {
        alert("请选择盒子中的宝可梦或空白格子。");
        return;
    }

    // 获取队伍数据
    const partyInfos = pIdxs.map(idx => {
        const slotKey = \`slot\${idx+1}\`;
        const obj = db.player.party[slotKey];
        return {
            idx,
            slotKey,
            obj,
            name: obj?.name || null
        };
    });
    const filledPartyInfos = partyInfos.filter(p => p.name !== null);
    const emptyPartyInfos = partyInfos.filter(p => p.name === null);

    const playerName = db.player.name || "训练师";
    const zoneName = ZoneDB[(db.world_state.location || 'Z')]?.label || "未知区域";

    let actionLog = "";

    // ========== [批量存入模式] 队伍 -> 空白盒子 ==========
    if (hasEmptyBox && filledPartyInfos.length > 0) {
        if (filledPartyInfos.length !== emptyIdxs.length) {
            alert(\`数量不匹配：队伍选中 \${filledPartyInfos.length} 个宝可梦，空位选中 \${emptyIdxs.length} 个。\`);
            return;
        }

        // 生成新的 box keys
        const existingKeys = Object.keys(db.player.box || {});
        const existingIds = existingKeys
            .filter(k => k.startsWith('storage_'))
            .map(k => parseInt(k.split('_')[1]) || 0);
        let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        const boxInserts = {};
        const partyEdits = {};
        const uploadList = [];

        filledPartyInfos.forEach((pInfo, i) => {
            const newBoxKey = \`storage_\${String(nextId++).padStart(2, '0')}\`;
            const newBoxObj = normalizeToBoxFormat(JSON.parse(JSON.stringify(pInfo.obj)));
            boxInserts[newBoxKey] = newBoxObj;
            partyEdits[pInfo.slotKey] = createEmptySlot(pInfo.idx + 1);
            uploadList.push(pInfo.name);
        });

        actionLog = \`
[系统指令：粉红网络连接协议 - 批量存入成功]
> 操作：传输通道 [\${zoneName}] 已建立。
> 上行 (Upload): \${uploadList.join(', ')} >>> 云端服务器存储。
> 变量已更新，无需重复发送。
> 已清空 \${filledPartyInfos.length} 个队伍槽位。

<VariableInsert>
\${JSON.stringify({ player: { box: boxInserts } }, null, 2)}
</VariableInsert>

<VariableEdit>
\${JSON.stringify({ player: { party: partyEdits } }, null, 2)}
</VariableEdit>

[演绎要求]
\${uploadList.join('、')} 已被传送至索妮亚研究所的云端存储系统。请简短描写多道传输光束同时闪烁、宝可梦们化为数据流消失的画面，以及 \${playerName} 的反应。
\`.trim();
    }
    // ========== [批量取出模式] 盒子 -> 队伍空槽 ==========
    else if (hasBoxPkm && emptyPartyInfos.length === pIdxs.length) {
        if (pIdxs.length !== bKeys.length) {
            alert(\`数量不匹配：队伍空槽选中 \${pIdxs.length} 个，盒子选中 \${bKeys.length} 个。\`);
            return;
        }

        const partyEdits = {};
        const boxDeletes = {};
        const downloadList = [];

        bKeys.forEach((bKey, i) => {
            const pInfo = emptyPartyInfos[i];
            const boxObj = db.player.box[bKey];
            const bName = boxObj?.name || "Unknown";
            const newPartyObj = normalizeToPartyFormat(JSON.parse(JSON.stringify(boxObj)), pInfo.idx + 1);
            partyEdits[pInfo.slotKey] = newPartyObj;
            boxDeletes[bKey] = true;
            downloadList.push(bName);
        });

        actionLog = \`
[系统指令：粉红网络连接协议 - 批量取出成功]
> 操作：传输通道 [\${zoneName}] 已建立。
> 下行 (Download): \${downloadList.join(', ')} <<< 云端服务器。
> 变量已更新，无需重复发送。
> 已加入 \${bKeys.length} 个队伍槽位。

<VariableEdit>
\${JSON.stringify({ player: { party: partyEdits } }, null, 2)}
</VariableEdit>

<VariableDelete>
\${JSON.stringify({ player: { box: boxDeletes } }, null, 2)}
</VariableDelete>

[演绎要求]
\${downloadList.join('、')} 已从云端传送回来！请简短描写多道传输光束同时闪烁、宝可梦们从数据流中具现化的画面，以及它们对 \${playerName} 的反应。
\`.trim();
    }
    // ========== [批量交换模式] 队伍 <-> 盒子 ==========
    else if (hasBoxPkm && filledPartyInfos.length > 0) {
        if (pIdxs.length !== bKeys.length) {
            alert(\`数量不匹配：队伍选中 \${pIdxs.length} 个，盒子选中 \${bKeys.length} 个。\`);
            return;
        }

        const partyEdits = {};
        const boxEdits = {};
        const uploadList = [];
        const downloadList = [];

        // 按顺序配对：partyInfos[i] <-> bKeys[i]
        partyInfos.forEach((pInfo, i) => {
            const bKey = bKeys[i];
            const boxObj = db.player.box[bKey];
            const bName = boxObj?.name || "Unknown";

            if (pInfo.name) {
                // 有宝可梦 = 交换
                const newPartyObj = normalizeToPartyFormat(JSON.parse(JSON.stringify(boxObj)), pInfo.idx + 1);
                const newBoxObj = normalizeToBoxFormat(JSON.parse(JSON.stringify(pInfo.obj)));
                partyEdits[pInfo.slotKey] = newPartyObj;
                boxEdits[bKey] = newBoxObj;
                uploadList.push(pInfo.name);
                downloadList.push(bName);
            } else {
                // 空槽位 = 取出
                const newPartyObj = normalizeToPartyFormat(JSON.parse(JSON.stringify(boxObj)), pInfo.idx + 1);
                partyEdits[pInfo.slotKey] = newPartyObj;
                boxEdits[bKey] = null; // 标记删除
                downloadList.push(bName);
            }
        });

        // 分离需要删除的盒子
        const boxEditsFinal = {};
        const boxDeletes = {};
        Object.entries(boxEdits).forEach(([k, v]) => {
            if (v === null) boxDeletes[k] = true;
            else boxEditsFinal[k] = v;
        });

        let variableBlocks = \`<VariableEdit>
\${JSON.stringify({ player: { party: partyEdits, box: boxEditsFinal } }, null, 2)}
</VariableEdit>\`;

        if (Object.keys(boxDeletes).length > 0) {
            variableBlocks += \`

<VariableDelete>
\${JSON.stringify({ player: { box: boxDeletes } }, null, 2)}
</VariableDelete>\`;
        }

        const opDesc = uploadList.length > 0 
            ? \`> 上行 (Upload): \${uploadList.join(', ')} >>> 云端服务器。\\n> 下行 (Download): \${downloadList.join(', ')} <<< 云端服务器。\`
            : \`> 下行 (Download): \${downloadList.join(', ')} <<< 云端服务器。\`;

        actionLog = \`
[系统指令：粉红网络连接协议 - 批量传输成功]
> 操作：传输通道 [\${zoneName}] 已建立。
> 变量已更新，无需重复发送。
\${opDesc}

\${variableBlocks}

[演绎要求]
\${uploadList.length > 0 ? \`\${uploadList.join('、')} 与 \${downloadList.join('、')} 完成了交换传输！\` : \`\${downloadList.join('、')} 已从云端传送回来！\`}请简短描写多道光束交错的画面，宝可梦们出现后对 \${playerName} 的反应，以及 \${playerName} 与新伙伴们的互动。
\`.trim();
    }
    else {
        alert("无效的操作组合。");
        return;
    }

    console.log("[BOX] 生成的指令:\\n" + actionLog);
    copyToClipboard(actionLog);
    resetBoxSelection(); 
};

/* --- Helpers --- */

function normalizeToPartyFormat(simpleObj, slotNum) {
    // 把盒子里的简单数据扩充成队伍数据
    // 保留完整数据，包括 friendship/AVS
    return {
        slot: slotNum,
        ...simpleObj
    };
}

function normalizeToBoxFormat(partyObj) {
    // 把队伍数据剥离成精简数据放入盒子
    // 保留完整数据，包括 friendship/AVS、moves、stats_meta 等
    const clone = JSON.parse(JSON.stringify(partyObj));
    // 清理不需要的字段
    delete clone.slot;      // box 中不需要 slot 字段
    delete clone.currHp;    // 临时战斗数据
    delete clone.maxHp;     // 临时战斗数据
    return clone;
}

// 复制到剪贴板函数
function copyToClipboard(text) {
    // 尝试使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("[BOX] ✓ 已复制到剪贴板");
            showCopyNotification("✓ 指令已复制到剪贴板，请粘贴发送给AI");
        }).catch(err => {
            console.error("[BOX] 剪贴板写入失败:", err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// 降级复制方案
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        console.log("[BOX] ✓ 已复制到剪贴板 (fallback)");
        showCopyNotification("✓ 指令已复制到剪贴板，请粘贴发送给AI");
    } catch (err) {
        console.error("[BOX] 复制失败:", err);
        alert("复制失败，请手动复制控制台中的指令");
    }
    document.body.removeChild(textarea);
}

/* --- 新版通知系统 (app.js) --- */
function showCopyNotification(msg) { // msg 参数暂保留以兼容旧调用
    // 1. 移除旧的（依然存在的话）
    const old = document.querySelector('.copy-notification');
    if (old) old.remove();

    // 2. 创建新结构 (对应CSS)
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = \`
        <div class="copy-notif-internal">
            <div class="copy-notif-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="24" height="24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="copy-notif-text">
                <div class="copy-notif-title">SYSTEM READY</div>
                <div class="copy-notif-desc">指令已生成并复制至剪贴板</div>
            </div>
        </div>
    \`;
  
    document.body.appendChild(notification);
  
    // 避免没有 transition，强制 reflow
    void notification.offsetWidth;
  
    // 滑入
    requestAnimationFrame(() => notification.classList.add('show'));
  
    // 3.5秒后滑出销毁
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500); 
    }, 3500);
}

/* ============================================================
   P-SYSTEM DASHBOARD (仪表盘主页)
   9个APP磁贴：Fog, Box, News, Gig, Transit, Map, Mart, Unite, Settings
   ============================================================ */

// --- [新增] 简洁线条图标库 (请添加在 App.js 顶部) ---
const SystemIcons = {
    box: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>\`,
    news: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>\`,
    gig: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>\`,
    transit: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><path d="M9 20l-1.5 2.5"></path><path d="M15 20l1.5 2.5"></path></svg>\`,
    map: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>\`,
    mart: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>\`,
    unite: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>\`,
    settings: \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>\` 
};

function renderDashboard() {
    const dashPage = document.getElementById('pg-dashboard');
    if (!dashPage) return;

    const player = db?.player || {};
    const world = db?.world_state || {};
    const playerName = player.name || 'TRAINER';
    // location 可能是对象 {x, y, quadrant} 或字符串
    const locData = world.location;
    const currLocCode = (typeof locData === 'string' ? locData : (locData?.quadrant || 'Z')).toUpperCase();
    const currZone = ZoneDB[currLocCode] || { name: 'UNKNOWN', label: '---', color: '#b2bec3', shadow: 'rgba(0,0,0,0.1)' };

    // 计算 Box 使用情况
    const boxCount = Object.keys(player.box || {}).length;
    const boxMax = 30;
    const boxPercent = boxMax > 0 ? Math.min(100, Math.max(0, (boxCount / boxMax) * 100)) : 0;

    // 计算队伍数量和生成精灵图标
    const partyData = player.party || {};
    const partySlots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'];
    const activePartyCount = partySlots.filter(k => partyData[k]?.name).length;
    
    // 生成 roster HTML (使用 shotx 精灵图)
    let rosterHTML = '';
    partySlots.forEach(slotKey => {
        const mon = partyData[slotKey];
        if (mon?.name) {
            const shotx = mon.shotx || \`https://img.pokemondb.net/sprites/scarlet-violet/icon/\${mon.name.toLowerCase()}.png\`;
            rosterHTML += \`
                <div class="roster-slot">
                    <img class="pk-icon" src="\${shotx}" alt="\${mon.name}">
                </div>
            \`;
        } else {
            rosterHTML += \`
                <div class="roster-slot">
                    <span class="empty-dot"></span>
                </div>
            \`;
        }
    });
    
    const activeStr = activePartyCount < 10 ? \`0\${activePartyCount}\` : \`\${activePartyCount}\`;
    const SVG_POKEBALL = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><path d="M50,35c7.244,0,13.304,5.161,14.698,12h19.163C82.341,29.628,67.766,16,50,16S17.659,29.628,16.139,47h19.163    C36.696,40.161,42.756,35,50,35z"/><path d="M50,65c-7.244,0-13.304-5.161-14.698-12H16.139C17.659,70.371,32.234,84,50,84s32.341-13.629,33.861-31H64.698    C63.304,59.839,57.244,65,50,65z"/><circle cx="50" cy="50" r="9"/></svg>\`;

    // 生成机制能量条 (完整7个)
    const unlocks = db?.player?.unlocks || {};
    const mechanisms = [
        { key: 'enable_mega', label: 'MEGA EVO', code: 'mega' },
        { key: 'enable_z_move', label: 'Z-POWER', code: 'z' },
        { key: 'enable_dynamax', label: 'DYNAMAX', code: 'dmax' },
        { key: 'enable_tera', label: 'TERASTAL', code: 'tera' },
        { key: 'enable_bond', label: 'SYNC.BOND', code: 'bond' },
        { key: 'enable_styles', label: 'HISUI STYLE', code: 'style' },
        { key: 'enable_insight', label: 'INSIGHT', code: 'eye' },
        { key: 'enable_proficiency_cap', label: 'LIMIT BREAK', code: 'cap' }
    ];
    const mechCellsHTML = mechanisms.map(mech => {
        const isActive = unlocks[mech.key];
        return \`<div class="cell \${isActive ? 'active' : ''}" data-mech="\${mech.code}" data-name="\${mech.label}">\${getSvgIcon(mech.code)}</div>\`;
    }).join('');

    dashPage.innerHTML = \`
        <div class="p-hero-dash">
            <div class="hero-main">
                <div class="hero-welcome">SYSTEM READY.</div>
                <div class="hero-name">\${playerName}</div>
                <div class="hero-meta-row">
                    <div class="hero-zone" style="background:\${currZone.color};box-shadow:2px 2px 0 \${currZone.shadow};"><span>LOC: ZONE-\${currLocCode}</span></div>
                    <div class="hero-bag-btn refined" onclick="triggerMockBag(this)">
                        <div class="hbb-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <span class="hbb-text">ITEMS</span>
                    </div>
                </div>
            </div>
            <div class="mech-wrapper">
                 <button class="mech-btn" type="button" onclick="toggleDashMechBar(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                 </button>
                 <div class="mech-matrix icon-mode">\${mechCellsHTML}</div>
            </div>
        </div>

        <!-- 新的栅格布局结构 (V3修正版) -->
        <div class="mosaic-grid layout-v3">
          
            <!-- PARTY 指挥官核心 (重制大气版) -->
            <div class="tile-party full-width remodel" onclick="openAppPage('party')">
                <div class="tp-bg-decoration">
                    <div class="tp-stripe-bg"></div>
                    <div class="tp-red-glow"></div>
                    <div class="tp-giant-watermark">\${SVG_POKEBALL}</div>
                </div>
                <div class="tp-content-left">
                    <div class="tp-top-row">
                        <div class="tp-label-main">ACTIVE UNIT</div>
                    </div>
                    <div class="tp-big-counter">
                        <span class="curr-val">\${activeStr}</span>
                        <span class="max-val">/ 06</span>
                    </div>
                </div>
                <div class="tp-roster-container">
                    \${rosterHTML}
                </div>
            </div>

            <!-- BOX: 战术青色 (Cyber Teal) -->
            <div class="live-tile box-tactical theme-teal" onclick="handleTileClick('box')">
                 <div class="t-decoration">
                    <div class="t-watermark">\${SystemIcons.box}</div>
                    <div class="t-stripe"></div>
                    <div class="t-glow"></div>
                 </div>
                 <div class="t-content">
                    <div class="t-header">
                        <div class="t-icon-sm">\${SystemIcons.box}</div>
                    </div>
                    <div class="t-main-data">
                        <div class="t-num">\${boxCount}<small>/ 30</small></div>
                        <div class="t-label">STORAGE</div>
                    </div>
                 </div>
            </div>

            <!-- UNIT: 战术紫色 (Deep Violet) -->
            <div class="live-tile box-tactical theme-purple" onclick="handleTileClick('social')">
                 <div class="t-decoration">
                    <div class="t-watermark">\${SystemIcons.unite}</div>
                    <div class="t-stripe"></div>
                    <div class="t-glow"></div>
                 </div>
                 <div class="t-content">
                    <div class="t-header">
                        <div class="t-icon-sm">\${SystemIcons.unite}</div>
                    </div>
                    <div class="t-main-data">
                        <div class="t-num">LINK</div>
                        <div class="t-label">RELATION</div>
                    </div>
                 </div>
            </div>

            <!-- MAP: 战术蓝色 (坐标点修正版) -->
            <div class="live-tile box-tactical theme-blue tactical-map-pro tile-tall-map" onclick="openMapSystem()">
                <div class="t-decoration">
                    <div class="map-bg-grid"></div>
                    <div class="t-watermark logo-mode">\${SystemIcons.map}</div>
                </div>
                <div class="t-content">
                    <div class="t-header" style="border-bottom-style: dashed;">
                        <div class="t-icon-sm">\${SystemIcons.map}</div>
                    </div>
                    <div class="t-map-visual">
                        <div class="radar-ping"></div>
                        <div class="map-radar-ring"></div>
                        <div class="map-axis-x"></div>
                        <div class="map-axis-y"></div>
                        <div class="map-point-dot"></div>
                        <div class="corner-L-bra top-l"></div>
                        <div class="corner-L-bra bot-r"></div>
                    </div>
                    <div class="t-main-data map-hud-layout">
                        <div class="mh-bar"></div>
                        <div class="mh-col">
                            <div class="mh-zone">ZONE-\${currLocCode}</div>
                            <div class="mh-coords" id="dashboard-map-coords">
                                <span class="coord-display">[0, 0]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧堆叠区：战术插片 (Tactical Blades) -->
            <div class="stack-col">
                <div class="live-tile box-tactical theme-amber small-h user-select-none disabled" onclick="handleTileClick('transit')">
                    <div class="t-decoration">
                         <div class="t-watermark">\${SystemIcons.transit}</div>
                         <div class="t-stripe"></div>
                         <div class="t-glow" style="--glow-c:rgba(253, 203, 110, 0.4)"></div>
                    </div>
                    <div class="mini-header-icon">
                        \${SystemIcons.transit}
                    </div>
                    <div class="mini-body">
                        <span class="mini-title-big">TRANSIT</span>
                    </div>
                </div>

                <div class="live-tile box-tactical theme-slate small-h user-select-none disabled" onclick="handleTileClick('work')">
                    <div class="t-decoration">
                         <div class="t-watermark">\${SystemIcons.gig}</div>
                         <div class="t-stripe"></div>
                         <div class="t-glow"></div>
                    </div>
                    <div class="mini-header-icon">
                        \${SystemIcons.gig}
                    </div>
                    <div class="mini-body">
                         <span class="mini-title-big" style="color: #2d3436;">WORKLO</span>
                    </div>
                </div>
            </div>
          
            <!-- 底部：微型战术模块 (Mini Tactical Docks) -->
            <div class="bottom-dock-layer">
                <div class="live-tile box-tactical dock-mode dock-news disabled">
                    <div class="t-decoration">
                        <div class="t-stripe" style="opacity:0.4"></div>
                    </div>
                    <div class="dock-content-row">
                        <div class="dock-icon">\${SystemIcons.news}</div>
                        <span class="dock-title">NEWS</span>
                    </div>
                </div>

                <div class="live-tile box-tactical dock-mode dock-mart disabled">
                    <div class="t-decoration">
                        <div class="t-stripe" style="opacity:0.4"></div>
                        <div class="t-glow" style="--glow-c:rgba(0, 184, 148, 0.4)"></div>
                    </div>
                    <div class="dock-content-row">
                        <div class="dock-icon">\${SystemIcons.mart}</div>
                        <span class="dock-title">MART</span>
                    </div>
                </div>

                <div class="live-tile box-tactical dock-mode dock-config" onclick="handleTileClick('settings')">
                    <div class="t-decoration">
                    </div>
                    <div class="dock-content-row">
                        <div class="dock-icon">\${SystemIcons.settings}</div>
                        <span class="dock-title">SYS.CFG</span>
                    </div>
                </div>
            </div>

        </div>
    \`;
}


// Dashboard 机制能量条折叠（通过按钮找相邻元素）
window.toggleDashMechBar = function(btn) {
    const wrapper = btn.closest('.mech-wrapper');
    if (!wrapper) return;
    
    const mechBar = wrapper.querySelector('.mech-matrix');
    if (!mechBar) return;
    
    const isExpanded = mechBar.classList.toggle('expanded');
    btn.classList.toggle('open', isExpanded);
};

// 磁贴点击处理（用于其他磁贴）
window.handleTileClick = function(tileId) {
    console.log('[Dashboard] Tile clicked:', tileId);
    
    // 根据磁贴ID跳转到对应页面
    const pageMap = {
        'box': 'box',
        'social': 'social',
        'settings': 'settings',
        'party': 'party'
    };
    
    const targetPage = pageMap[tileId];
    if (targetPage) {
        openAppPage(targetPage);
    }
};

/* ============================================================
   MAP 系统接入 - 坐标管理与 VariableEdit
   ============================================================ */

// 当前坐标缓存
let currentMapCoords = { x: 0, y: 0, quadrant: 'Z' };

// 更新 Dashboard 磁贴坐标显示
function updateCoordsDisplay(coords) {
    const el = document.getElementById('dashboard-map-coords');
    if (el && coords) {
        el.innerHTML = \`<span class="coord-display">[\${coords.x}, \${coords.y}]</span>\`;
    }
}

// 打开 MAP 系统
window.openMapSystem = function() {
    console.log('[PKM] 打开地图系统...');
    
    // 获取手机容器
    const container = document.querySelector('.ver-dawn-frame');
    if (!container) {
        console.error('[PKM] 找不到手机容器 .ver-dawn-frame');
        return;
    }
    
    // 创建模态框（相对于手机容器）
    let modal = document.getElementById('map-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'map-modal';
        modal.className = 'map-modal';
        modal.innerHTML = \`
            <div class="map-modal-header">
                <span class="map-modal-title">TACTICAL MAP</span>
                <button class="map-modal-close" onclick="closeMapSystem()">✕</button>
            </div>
            <iframe id="map-iframe" frameborder="0"></iframe>
        \`;
        container.appendChild(modal);
        
        // 加载 MAP iframe
        const iframe = document.getElementById('map-iframe');
        
        // 使用外部文件加载（更稳定）
        console.log('[PKM] 加载 MAP 文件');
        iframe.src = 'map/index.html';
        iframe.onload = function() {
            setupMapCallbacks(iframe);
        };
    }
    
    modal.classList.add('active');
};

// 关闭 MAP 系统
window.closeMapSystem = function() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// 设置 MAP iframe 的回调
function setupMapCallbacks(iframe) {
    try {
        const mapWindow = iframe.contentWindow;
        
        // 设置位置变更回调
        mapWindow.onPlayerLocationChange = function(coords) {
            console.log('[PKM] 收到位置变更:', coords);
            currentMapCoords = coords;
            updateCoordsDisplay(coords);
            
            // 更新 ERA 数据
            if (db && db.world_state) {
                db.world_state.location = {
                    x: coords.x,
                    y: coords.y,
                    quadrant: coords.quadrant
                };
            }
            
            // 发送 VariableEdit 到酒馆
            sendLocationVariableEdit(coords);
            
            // 注入位置上下文到世界书
            injectLocationContext();
        };
        
        // 从 ERA 变量设置初始位置
        const eraLocation = db?.world_state?.location;
        if (eraLocation && typeof eraLocation === 'object' && typeof eraLocation.x === 'number') {
            console.log('[PKM] 从 ERA 变量设置地图初始位置:', eraLocation);
            if (typeof mapWindow.setPlayerPosition === 'function') {
                mapWindow.setPlayerPosition(eraLocation);
            }
        }
        
        // 获取初始坐标
        if (typeof mapWindow.getPlayerDisplayCoords === 'function') {
            const initialCoords = mapWindow.getPlayerDisplayCoords();
            currentMapCoords = initialCoords;
            updateCoordsDisplay(initialCoords);
        }
        
        console.log('[PKM] MAP 回调设置完成');
    } catch (e) {
        console.warn('[PKM] 无法设置 MAP 回调:', e);
    }
}

// 发送位置变更到 ERA 系统
function sendLocationVariableEdit(coords) {
    const payload = {
        world_state: {
            location: {
                x: coords.x,
                y: coords.y,
                quadrant: coords.quadrant
            }
        }
    };
    
    // 通过父窗口回调发送（如果存在）
    if (window.pkmUpdateLocationCallback) {
        window.pkmUpdateLocationCallback(payload);
    }
    
    console.log('[PKM] 位置 VariableEdit 已准备:', JSON.stringify(payload));
}

/* ============================================================
   位置上下文注入系统 - 注入到酒馆世界书 (深度0)
   ============================================================ */

const LOCATION_INJECT_ID = 'pkm_location_context';

/**
 * 生成位置上下文文本
 * 调用 MAP iframe 中的 LocationContextGenerator
 */
function generateLocationContextText() {
    try {
        const iframe = document.getElementById('map-iframe');
        if (!iframe || !iframe.contentWindow) {
            console.warn('[PKM] MAP iframe 不可用，无法生成位置上下文');
            return null;
        }
        
        const mapWindow = iframe.contentWindow;
        
        // 检查 LocationContextGenerator 是否可用
        if (!mapWindow.LocationContextGenerator) {
            console.warn('[PKM] LocationContextGenerator 不可用');
            return null;
        }
        
        // 获取当前玩家坐标（内部坐标）
        if (!mapWindow.playerState) {
            console.warn('[PKM] playerState 不可用');
            return null;
        }
        
        const gx = mapWindow.playerState.gx;
        const gy = mapWindow.playerState.gy;
        
        // 生成完整的位置上下文文本
        const contextText = mapWindow.LocationContextGenerator.generateContextText(gx, gy);
        
        return contextText;
    } catch (e) {
        console.error('[PKM] 生成位置上下文失败:', e);
        return null;
    }
}

/**
 * 注入位置上下文到酒馆世界书
 * 使用 SillyTavern 的 injectPrompts API
 */
function injectLocationContext() {
    const contextText = generateLocationContextText();
    
    if (!contextText) {
        console.log('[PKM] 无位置上下文可注入');
        return;
    }
    
    // 包装为 XML 标签格式
    const promptContent = \`<location_context>
\${contextText}
</location_context>\`;
    
    // 调用酒馆的 injectPrompts API（通过父窗口）
    try {
        const parentWindow = getParentWindow();
        
        // 先清除旧注入
        if (typeof parentWindow.uninjectPrompts === 'function') {
            parentWindow.uninjectPrompts([LOCATION_INJECT_ID]);
        }
        
        // 注入新内容
        if (typeof parentWindow.injectPrompts === 'function') {
            parentWindow.injectPrompts([{
                id: LOCATION_INJECT_ID,
                position: 'after_wi_scan',
                depth: 0,
                role: 'system',
                should_scan: false,
                content: promptContent
            }]);
            
            console.log('[PKM] ✓ 位置上下文已注入到世界书 (深度0)');
        } else {
            // 如果父窗口没有 injectPrompts，尝试通过回调
            if (window.pkmInjectLocationCallback) {
                window.pkmInjectLocationCallback({
                    id: LOCATION_INJECT_ID,
                    position: 'after_wi_scan',
                    depth: 0,
                    role: 'system',
                    should_scan: false,
                    content: promptContent
                });
                console.log('[PKM] ✓ 位置上下文已通过回调注入');
            } else {
                console.warn('[PKM] 无法注入位置上下文：injectPrompts API 不可用');
            }
        }
    } catch (e) {
        console.error('[PKM] 注入位置上下文失败:', e);
    }
}

/**
 * 清除位置上下文注入
 */
function clearLocationContextInjection() {
    try {
        const parentWindow = getParentWindow();
        if (typeof parentWindow.uninjectPrompts === 'function') {
            parentWindow.uninjectPrompts([LOCATION_INJECT_ID]);
            console.log('[PKM] ✓ 位置上下文注入已清除');
        }
    } catch (e) {
        // 忽略清除失败
    }
}

// 暴露给外部调用
window.injectLocationContext = injectLocationContext;
window.clearLocationContextInjection = clearLocationContextInjection;
window.generateLocationContextText = generateLocationContextText;


    <\/script>
    <script>
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
    console.log(\`[PKM UI] Request Set Leader -> \${slotStr}\`);
    
    // 调用父窗口注入到 iframe window 的回调函数
    if (window.pkmSetLeaderCallback) {
        console.log('[PKM UI] 调用 pkmSetLeaderCallback');
        window.pkmSetLeaderCallback(slotStr);
    } else {
        console.warn('[PKM UI] pkmSetLeaderCallback 不可用');
    }
};


// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
    <\/script>
</body>
</html>
`;

        // ========== 从 ERA 获取数据（使用酒馆的 eventEmit/eventOn）==========
        async function getEraVars() {
            return new Promise((resolve) => {
                // 酒馆使用全局函数 eventEmit 和 eventOn
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

        // ========== iframe 内容初始化标记 ==========
        let iframeInitialized = false;

        // ========== 事件绑定 ==========
        ball.on('click', async function() {
            console.log('[PKM] 打开面板');
            overlay.css('display', 'flex');
            
            // 只初始化一次 iframe
            if (!iframeInitialized) {
                // 先获取 ERA 数据
                console.log('[PKM] 正在获取 ERA 数据...');
                const eraData = await getEraVars();
                
                // 构建带数据的 iframe 内容
                const dataScript = eraData 
                    ? `<script>window.eraData = ${JSON.stringify(eraData)};<\/script>`
                    : `<script>window.eraData = null;<\/script>`;
                
                const fullContent = iframeContent.replace(
                    '<script src="https://files.catbox.moe/8oxf4b.js">',
                    dataScript + '\n    <script src="https://files.catbox.moe/8oxf4b.js">'
                );
                
                // 写入 iframe 内容
                const iframeEl = iframe[0];
                const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
                doc.open();
                doc.write(fullContent);
                doc.close();
                
                // 注入回调函数到 iframe 的 window
                if (iframeEl.contentWindow) {
                    iframeEl.contentWindow.pkmSetLeaderCallback = handleLeaderToggle;
                    iframeEl.contentWindow.pkmUpdateSettingsCallback = handleSettingsToggle;
                    console.log('[PKM] ✓ 已注入 pkmSetLeaderCallback 和 pkmUpdateSettingsCallback 到 iframe');
                }
                
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

        ball.on('mouseenter', function() {
            $(this).css('transform', 'scale(1.1)');
        });

        ball.on('mouseleave', function() {
            $(this).css('transform', 'scale(1)');
        });

        // ========== 刷新函数 ==========
        async function refreshDashboard() {
            if (!iframeInitialized) return;
            
            console.log('[PKM] 刷新面板数据...');
            const eraData = await getEraVars();
            
            if (eraData) {
                // 通过 postMessage 发送新数据给 iframe
                const iframeEl = iframe[0];
                if (iframeEl.contentWindow) {
                    iframeEl.contentWindow.postMessage({
                        type: 'PKM_REFRESH',
                        data: eraData
                    }, '*');
                }
            }
        }

        // ========== 事件处理函数（具名函数，便于移除）==========
        function onWriteDone() {
            console.log('[PKM] 检测到 ERA 变量更新，刷新面板');
            refreshDashboard();
            // 检测 transfer_buffer 并处理
            handleTransferBuffer();
        }
        
        function onGenerationEnded() {
            console.log('[PKM] 检测到消息生成完成，刷新面板');
            refreshDashboard();
            // 检测 transfer_buffer 并处理
            handleTransferBuffer();
        }
        
        function onChatChanged() {
            console.log('[PKM] 检测到对话切换，重置面板');
            iframeInitialized = false;
        }

        // ========== Transfer Buffer 处理逻辑 ==========
        let transferBufferLock = false;
        
        async function handleTransferBuffer() {
            // 防抖锁
            if (transferBufferLock) {
                console.log('[PKM] [TRANSFER] 正在处理中，忽略重复请求');
                return;
            }
            
            try {
                const eraVars = await getEraVars();
                const transferBuffer = eraVars?.player?.party?.transfer_buffer;
                
                // 检查 transfer_buffer 是否有内容（name 不为 null）
                if (!transferBuffer || !transferBuffer.name) {
                    return; // 没有需要传输的内容
                }
                
                transferBufferLock = true;
                console.log('[PKM] [TRANSFER] 检测到 transfer_buffer 有内容:', transferBuffer.name);
                
                // 查找第一个空的盒子位置
                const box = eraVars?.player?.box || {};
                const existingKeys = Object.keys(box);
                const existingIds = existingKeys
                    .filter(k => k.startsWith('storage_'))
                    .map(k => parseInt(k.split('_')[1]) || 0);
                const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
                const newBoxKey = `storage_${String(nextId).padStart(2, '0')}`;
                
                // 准备盒子数据（移除 slot 字段）
                const boxData = JSON.parse(JSON.stringify(transferBuffer));
                delete boxData.slot;
                
                // 准备空的 transfer_buffer 结构
                const emptyTransferBuffer = {
                    slot: 7,
                    name: null,
                    nickname: null,
                    species: null,
                    gender: null,
                    lv: null,
                    quality: null,
                    nature: null,
                    ability: null,
                    shiny: false,
                    item: null,
                    mechanic: null,
                    teraType: null,
                    isAce: false,
                    isLead: false,
                    friendship: {
                        avs: { trust: 0, passion: 0, insight: 0, devotion: 0 },
                        av_up: { trust: 0, passion: 0, insight: 0, devotion: 0 }
                    },
                    moves: {
                        move1: null,
                        move2: null,
                        move3: null,
                        move4: null
                    },
                    stats_meta: {
                        ivs: { hp: null, atk: null, def: null, spa: null, spd: null, spe: null },
                        ev_level: 0,
                        ev_up: 0
                    },
                    notes: null
                };
                
                // 构建 VariableInsert（插入盒子）和 VariableEdit（清空 transfer_buffer）
                const variableInsertData = {
                    player: {
                        box: {
                            [newBoxKey]: boxData
                        }
                    }
                };
                
                const variableEditData = {
                    player: {
                        party: {
                            transfer_buffer: emptyTransferBuffer
                        }
                    }
                };
                
                const variableInsertJson = JSON.stringify(variableInsertData, null, 2);
                const variableEditJson = JSON.stringify(variableEditData, null, 2);
                const variableInsertBlock = `<VariableInsert>\n${variableInsertJson}\n</VariableInsert>`;
                const variableEditBlock = `<VariableEdit>\n${variableEditJson}\n</VariableEdit>`;
                
                console.log('[PKM] [TRANSFER] 生成 VariableInsert:', variableInsertBlock);
                
                // 获取最近一楼消息
                const lastMessageId = getLastMessageId();
                const messages = getChatMessages(lastMessageId);
                
                if (!messages || messages.length === 0) {
                    console.warn('[PKM] [TRANSFER] 无法获取最近消息');
                    return;
                }
                
                const msg = messages[0];
                let content = msg.message || '';
                
                // 在末尾追加 VariableInsert 和 VariableEdit
                content = content.trim() + '\n\n' + variableInsertBlock + '\n\n' + variableEditBlock;
                console.log('[PKM] [TRANSFER] 追加传输指令到消息末尾');
                
                // 更新消息
                await setChatMessages([{
                    message_id: lastMessageId,
                    message: content
                }], { refresh: 'affected' });
                
                console.log(`[PKM] [TRANSFER] ✓ 已将 ${transferBuffer.name} 传输到盒子 ${newBoxKey}`);
                
                // 立即触发 ERA 变量更新
                if (typeof eventEmit !== 'undefined') {
                    // 先插入盒子
                    eventEmit('era:updateByObject', variableInsertData);
                    // 再清空 transfer_buffer
                    eventEmit('era:updateByObject', variableEditData);
                    console.log('[PKM] [TRANSFER] ✓ ERA 变量已更新');
                }
                
                // 刷新面板
                setTimeout(() => refreshDashboard(), 100);
                
            } catch (e) {
                console.error('[PKM] [TRANSFER] 处理失败:', e);
            } finally {
                // 1秒后解锁
                setTimeout(() => { transferBufferLock = false; }, 1000);
            }
        }

        // ========== 监听 ERA 变化事件 ==========
        if (typeof eventOn !== 'undefined') {
            eventOn('era:writeDone', onWriteDone);
            eventOn('GENERATION_ENDED', onGenerationEnded);
            eventOn('CHAT_CHANGED', onChatChanged);
        }

        // ========== Leader 切换处理 ==========
        let leaderToggleLock = false;
        
        async function handleLeaderToggle(targetSlot) {
            // 防抖锁：防止重复执行
            if (leaderToggleLock) {
                console.log('[PKM] [LEADER] 正在处理中，忽略重复请求');
                return;
            }
            leaderToggleLock = true;
            
            try {
                console.log(`[PKM] [LEADER] 收到切换请求: ${targetSlot}`);
                
                // 1. 获取当前队伍数据
                const eraVars = await getEraVars();
                const party = eraVars?.player?.party || {};
                
                if (!party || Object.keys(party).length === 0) {
                    console.warn('[PKM] [LEADER] 队伍为空，无法切换');
                    return;
                }
                
                // 2. 构建 VariableEdit JSON：一个 true，其余 false
                const variableEditData = {
                    player: {
                        party: {}
                    }
                };
                
                // 遍历所有槽位，设置 isLead
                for (let i = 1; i <= 6; i++) {
                    const slotKey = `slot${i}`;
                    const pokemon = party[slotKey];
                    
                    // 只有非空槽位才设置 isLead
                    if (pokemon && pokemon.name) {
                        variableEditData.player.party[slotKey] = {
                            isLead: slotKey === targetSlot
                        };
                    }
                }
                
                const variableEditJson = JSON.stringify(variableEditData, null, 2);
                const variableEditBlock = `<VariableEdit>\n${variableEditJson}\n</VariableEdit>`;
                
                console.log('[PKM] [LEADER] 生成 VariableEdit:', variableEditBlock);
                
                // 3. 获取最近一楼消息
                const lastMessageId = getLastMessageId();
                const messages = getChatMessages(lastMessageId);
                
                if (!messages || messages.length === 0) {
                    console.warn('[PKM] [LEADER] 无法获取最近消息');
                    return;
                }
                
                const msg = messages[0];
                let content = msg.message || '';
                
                // 4. 直接在末尾追加新的 VariableEdit（不删除现有标签）
                content = content.trim() + '\n\n' + variableEditBlock;
                console.log('[PKM] [LEADER] 追加新 VariableEdit 到末尾');
                
                // 5. 更新消息
                await setChatMessages([{
                    message_id: lastMessageId,
                    message: content
                }], { refresh: 'affected' });
                
                console.log(`[PKM] [LEADER] ✓ 已注入 Leader 切换到消息 #${lastMessageId}`);
                
                // 6. 立即触发 ERA 变量更新（让前端立即刷新）
                if (typeof eventEmit !== 'undefined') {
                    eventEmit('era:updateByObject', variableEditData);
                    console.log('[PKM] [LEADER] ✓ ERA 变量已更新');
                }
                
                // 7. 刷新面板（延迟执行，避免和锁冲突）
                setTimeout(() => refreshDashboard(), 100);
                
            } catch (e) {
                console.error('[PKM] [LEADER] 切换失败:', e);
            } finally {
                // 1秒后解锁，防止快速连续点击
                setTimeout(() => { leaderToggleLock = false; }, 1000);
            }
        }
        
        // ========== 暴露 Leader 切换函数给 iframe 调用 ==========
        window.pkmSetLeader = handleLeaderToggle;
        console.log('[PKM] ✓ window.pkmSetLeader 已暴露');

        // ========== Settings 切换处理（类似 Leader 逻辑）==========
        let settingsToggleLock = false;
        
        async function handleSettingsToggle(settingsData) {
            if (settingsToggleLock) {
                console.log('[PKM] [SETTINGS] 正在处理中，忽略重复请求');
                return;
            }
            settingsToggleLock = true;
            
            try {
                console.log('[PKM] [SETTINGS] 收到设置更新:', settingsData);
                
                // 1. 构建 VariableEdit JSON
                const variableEditData = {
                    settings: settingsData
                };
                
                const variableEditJson = JSON.stringify(variableEditData, null, 2);
                const variableEditBlock = `<VariableEdit>
${variableEditJson}
</VariableEdit>`;
                
                console.log('[PKM] [SETTINGS] 生成 VariableEdit:', variableEditBlock);
                
                // 2. 获取最近一楼消息
                const lastMessageId = getLastMessageId();
                const messages = getChatMessages(lastMessageId);
                
                if (!messages || messages.length === 0) {
                    console.warn('[PKM] [SETTINGS] 无法获取最近消息');
                    return;
                }
                
                const msg = messages[0];
                let content = msg.message || '';
                
                // 3. 直接在末尾追加新的 VariableEdit
                content = content.trim() + '\n\n' + variableEditBlock;
                console.log('[PKM] [SETTINGS] 追加新 VariableEdit 到末尾');
                
                // 4. 更新消息
                await setChatMessages([{
                    message_id: lastMessageId,
                    message: content
                }], { refresh: 'affected' });
                
                console.log(`[PKM] [SETTINGS] ✓ 已注入 Settings 到消息 #${lastMessageId}`);
                
                // 5. 立即触发 ERA 变量更新
                if (typeof eventEmit !== 'undefined') {
                    eventEmit('era:updateByObject', variableEditData);
                    console.log('[PKM] [SETTINGS] ✓ ERA 变量已更新');
                }
                
            } catch (e) {
                console.error('[PKM] [SETTINGS] 更新失败:', e);
            } finally {
                setTimeout(() => { settingsToggleLock = false; }, 500);
            }
        }
        
        // ========== 暴露 Settings 切换函数 ==========
        window.pkmUpdateSettings = handleSettingsToggle;
        console.log('[PKM] ✓ window.pkmUpdateSettings 已暴露');

        // ========== 卸载清理函数（退出角色卡时调用）==========
        function unloadPkmUI() {
            console.log('[PKM] UI 脚本开始卸载');
            
            // 移除 DOM 元素
            $('#pkm-container').remove();
            $('#pkm-anim-style').remove();
            
            // 清理事件监听
            if (typeof eventRemoveListener !== 'undefined') {
                eventRemoveListener('era:writeDone', onWriteDone);
                eventRemoveListener('GENERATION_ENDED', onGenerationEnded);
                eventRemoveListener('CHAT_CHANGED', onChatChanged);
            }
            
            // 清理全局变量
            delete window.pkmDashboard;
            delete window.pkmSetLeader;
            delete window.pkmUpdateSettings;
            
            // 移除 pagehide 监听器
            window.removeEventListener('pagehide', unloadPkmUI);
            
            console.log('[PKM] UI 脚本卸载完成');
        }
        
        // 监听 pagehide 事件（退出角色卡时触发）
        window.removeEventListener('pagehide', unloadPkmUI);
        window.addEventListener('pagehide', unloadPkmUI);

        // 全局接口
        window.pkmDashboard = {
            show: async () => {
                overlay.css('display', 'flex');
                if (!iframeInitialized) {
                    const eraData = await getEraVars();
                    const dataScript = eraData 
                        ? `<script>window.eraData = ${JSON.stringify(eraData)};<\/script>`
                        : `<script>window.eraData = null;<\/script>`;
                    const fullContent = iframeContent.replace(
                        '<script src="https://files.catbox.moe/8oxf4b.js">',
                        dataScript + '\n    <script src="https://files.catbox.moe/8oxf4b.js">'
                    );
                    const iframeEl = iframe[0];
                    const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
                    doc.open();
                    doc.write(fullContent);
                    doc.close();
                    iframeInitialized = true;
                }
            },
            hide: () => overlay.css('display', 'none'),
            toggle: async () => {
                if (overlay.css('display') === 'none') {
                    await window.pkmDashboard.show();
                } else {
                    window.pkmDashboard.hide();
                }
            },
            refresh: refreshDashboard
        };

        console.log('[PKM] ✓ 加载成功！点击右上角闪电球');
    });

})();
