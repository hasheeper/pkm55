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
        
        // ========== 位置上下文生成器（后端版本，完整逻辑）==========
        const LocationContextBackend = {
            // 数据缓存
            mapInfoData: null,
            mapData: null,
            spawnTablesData: null,
            dataLoaded: false,
            
            // 五大区域定义
            REGIONS: {
                'Region_Zenith': { name: 'Z区 ZENITH (中枢区)', center: [1, 1], short: 'Z' },
                'Region_Neon': { name: 'N区 NEON (霓虹区)', center: [12, -12], short: 'N' },
                'Region_Bloom': { name: 'B区 BLOOM (盛放区)', center: [-13, -13], short: 'B' },
                'Region_Shadow': { name: 'S区 SHADOW (暗影区)', center: [12, 12], short: 'S' },
                'Region_Apex': { name: 'A区 APEX (极诣区)', center: [-13, 13], short: 'A' }
            },
            
            // 从mapinfo.json加载的地标数据
            regionZones: {},
            biomeFlavor: {},
            regionDescriptions: {},
            service: {},
            placeAnchor: {},
            systemWarps: {},
            transitInfra: {},
            npcContext: {},
            
            // 加载所有数据文件
            async loadData() {
                if (this.dataLoaded) return true;
                
                try {
                    console.log('[PKM] 加载地图数据文件...');
                    
                    // 并行加载所有数据
                    const [mapInfoRes, mapDataRes] = await Promise.all([
                        fetch(PKM_URL + 'map/data/mapinfo.json'),
                        fetch(PKM_URL + 'map/data/mapdata.json')
                    ]);
                    
                    if (mapInfoRes.ok) {
                        this.mapInfoData = await mapInfoRes.json();
                        this.initFromMapInfo(this.mapInfoData);
                        console.log('[PKM] ✓ mapinfo.json 已加载');
                    }
                    
                    if (mapDataRes.ok) {
                        this.mapData = await mapDataRes.json();
                        console.log('[PKM] ✓ mapdata.json 已加载');
                    }
                    
                    // 加载 pkmdata.js（通过动态 script）
                    await this.loadPkmData();
                    
                    this.dataLoaded = true;
                    console.log('[PKM] ✓ 所有地图数据加载完成');
                    return true;
                } catch (e) {
                    console.error('[PKM] 加载地图数据失败:', e);
                    return false;
                }
            },
            
            // 加载 pkmdata.js
            async loadPkmData() {
                return new Promise((resolve) => {
                    if (window.SPAWN_TABLES_DATA) {
                        this.spawnTablesData = window.SPAWN_TABLES_DATA;
                        resolve();
                        return;
                    }
                    
                    const script = document.createElement('script');
                    script.src = PKM_URL + 'map/data/pkmdata.js';
                    script.onload = () => {
                        this.spawnTablesData = window.SPAWN_TABLES_DATA;
                        console.log('[PKM] ✓ pkmdata.js 已加载');
                        resolve();
                    };
                    script.onerror = () => {
                        console.warn('[PKM] pkmdata.js 加载失败');
                        resolve();
                    };
                    document.head.appendChild(script);
                });
            },
            
            // 初始化 mapinfo 数据
            initFromMapInfo(mapInfoData) {
                if (!mapInfoData) return;
                
                this.regionZones = mapInfoData.region_zones || {};
                this.biomeFlavor = mapInfoData.biome_flavor || {};
                const serviceData = mapInfoData.service || {};
                this.service = serviceData;
                this.placeAnchor = serviceData.place_anchor || mapInfoData.place_anchor || {};
                this.systemWarps = mapInfoData.system_warps || {};
                this.transitInfra = mapInfoData.transit_infrastructure || {};
                this.npcContext = mapInfoData.npc_actor_context || {};
                
                if (mapInfoData.narrative_layer && mapInfoData.narrative_layer.world_atmosphere) {
                    this.regionDescriptions = mapInfoData.narrative_layer.world_atmosphere.regions || {};
                }
            },
            
            // 根据显示坐标判断所属大区
            getRegionByCoords(x, y) {
                // 基于象限和距离判断
                if (Math.abs(x) <= 6 && Math.abs(y) <= 6) return 'Region_Zenith';
                if (x > 0 && y < 0) return 'Region_Neon';
                if (x < 0 && y < 0) return 'Region_Bloom';
                if (x > 0 && y > 0) return 'Region_Shadow';
                if (x < 0 && y > 0) return 'Region_Apex';
                return 'Region_Zenith';
            },
            
            // 根据坐标查找最近的 Region_Zone
            findNearestRegionZone(x, y) {
                let nearest = null;
                let minDist = Infinity;
                
                for (const [zoneName, zoneData] of Object.entries(this.regionZones)) {
                    if (zoneData.center_point) {
                        const dist = Math.abs(zoneData.center_point[0] - x) + Math.abs(zoneData.center_point[1] - y);
                        if (dist < minDist && dist <= 8) {
                            minDist = dist;
                            nearest = { name: zoneName, data: zoneData, distance: dist };
                        }
                    }
                }
                return nearest;
            },
            
            // 根据坐标查找最近的 Biome_Zone
            findNearestBiomeZone(x, y) {
                let nearest = null;
                let minDist = Infinity;
                
                for (const [biomeName, biomeData] of Object.entries(this.biomeFlavor)) {
                    if (biomeData.center_point) {
                        const dist = Math.abs(biomeData.center_point[0] - x) + Math.abs(biomeData.center_point[1] - y);
                        if (dist < minDist && dist <= 10) {
                            minDist = dist;
                            nearest = { name: biomeName, data: biomeData, distance: dist };
                        }
                    }
                }
                return nearest;
            },
            
            // 威胁度标签
            getThreatLabel(threat) {
                const labels = { 0: '未知', 1: '安全', 2: '低危', 3: '中危', 4: '高危', 5: '极危', 6: '和平' };
                return labels[threat] || '未知';
            },
            
            // 生成完整的位置上下文文本
            generateContextText(x, y, quadrant) {
                const lines = [];
                
                // 获取大区
                const regionId = this.getRegionByCoords(x, y);
                const regionInfo = this.REGIONS[regionId];
                const regionShort = regionInfo?.short || '?';
                
                lines.push('═══════════════════════════════════════');
                lines.push('【当前位置】');
                lines.push(`坐标: [${x}, ${y}] ${regionShort}`);
                
                // 大区信息
                if (regionInfo) {
                    lines.push(`所属大区: ${regionInfo.name}`);
                    
                    const regionDesc = this.regionDescriptions[regionId];
                    if (regionDesc) {
                        if (regionDesc.prompt_snippet) {
                            lines.push(`【大区氛围】${regionDesc.prompt_snippet}`);
                        }
                        if (regionDesc.geography_desc) {
                            lines.push(`【地理概述】${regionDesc.geography_desc}`);
                        }
                    }
                }
                
                // 查找最近的 Region_Zone
                const nearestRZ = this.findNearestRegionZone(x, y);
                if (nearestRZ) {
                    lines.push(`所属设施区: ${nearestRZ.name} (~${nearestRZ.distance}格)`);
                    if (nearestRZ.data.exterior_view) {
                        lines.push(`【外观描述】${nearestRZ.data.exterior_view}`);
                    }
                    if (nearestRZ.data.internal_reality) {
                        lines.push(`【内部环境】${nearestRZ.data.internal_reality}`);
                    }
                }
                
                // 查找最近的 Biome_Zone
                const nearestBZ = this.findNearestBiomeZone(x, y);
                if (nearestBZ) {
                    lines.push(`所属生态区: ${nearestBZ.name} (~${nearestBZ.distance}格)`);
                    if (nearestBZ.data.visual_texture) {
                        lines.push(`【视觉纹理】${nearestBZ.data.visual_texture}`);
                    }
                    if (nearestBZ.data.sensory_feed) {
                        lines.push(`【感官体验】${nearestBZ.data.sensory_feed}`);
                    }
                }
                
                // 本大区地标
                lines.push('');
                lines.push('───────────────────────────────────────');
                lines.push(`【本大区地标】(${regionInfo?.name || regionId})`);
                
                const landmarks = this.getRegionLandmarks(regionId, x, y);
                if (landmarks.length > 0) {
                    for (const lm of landmarks.slice(0, 6)) {
                        lines.push(`  • ${lm.name} [${lm.center[0]}, ${lm.center[1]}] (~${lm.distance}格)`);
                    }
                }
                
                // 全图区域概览
                lines.push('');
                lines.push('───────────────────────────────────────');
                lines.push('【全图区域】');
                
                for (const [id, data] of Object.entries(this.REGIONS)) {
                    const isCurrent = id === regionId;
                    const marker = isCurrent ? '★' : '○';
                    lines.push(`  ${marker} ${data.name} [${data.center[0]}, ${data.center[1]}]`);
                }
                
                lines.push('═══════════════════════════════════════');
                
                return lines.join('\n');
            },
            
            // 获取大区内的地标
            getRegionLandmarks(regionId, x, y) {
                const landmarks = [];
                const regionPrefixes = {
                    'Region_Zenith': ['Aether', 'Royal', 'Living', 'Lusamine', 'Eco', 'Academic', 'Zero_Halo', 'Arcadia'],
                    'Region_Neon': ['Iono', 'Toxic', 'Cyber', 'Port', 'Glitch', 'Skyline', 'Synth', 'Golden', 'Radiant', 'Chrome'],
                    'Region_Bloom': ['Pearl', 'Sunflora', 'Marina', 'Sapphire', 'Hermit', 'Aroma', 'Jade', 'Deep_Root', 'Silt', 'Breeze', 'Prism', 'Crystal', 'Mirror'],
                    'Region_Shadow': ['Grim', 'Venom', 'Frost', 'Requiem', 'Canal', 'Kamunagi', 'Cinder', 'Silent', 'Spirit', 'Twilight', 'Crimson_Peat', 'Ginkgo', 'Mercury'],
                    'Region_Apex': ['Crimson_Forge', 'Titan', 'Dune', 'Ruins', 'Savanna', 'Scorched', 'Obsidian', 'Inferno', 'Crimson_Badlands', 'Frostbite', 'Desolate']
                };
                
                const prefixes = regionPrefixes[regionId] || [];
                
                for (const [zoneName, zoneData] of Object.entries(this.regionZones)) {
                    if (prefixes.some(p => zoneName.includes(p)) && zoneData.center_point) {
                        const dist = Math.abs(zoneData.center_point[0] - x) + Math.abs(zoneData.center_point[1] - y);
                        landmarks.push({ name: zoneName, center: zoneData.center_point, distance: dist, type: 'zone' });
                    }
                }
                
                for (const [biomeName, biomeData] of Object.entries(this.biomeFlavor)) {
                    if (prefixes.some(p => biomeName.includes(p)) && biomeData.center_point) {
                        const dist = Math.abs(biomeData.center_point[0] - x) + Math.abs(biomeData.center_point[1] - y);
                        landmarks.push({ name: biomeName, center: biomeData.center_point, distance: dist, type: 'biome' });
                    }
                }
                
                landmarks.sort((a, b) => a.distance - b.distance);
                return landmarks;
            }
        };
        
        // ========== 位置上下文注入函数 ==========
        async function injectLocationContext() {
            try {
                // 确保数据已加载
                await LocationContextBackend.loadData();
                
                const eraVars = await getEraVars();
                if (!eraVars) {
                    console.log('[PKM] 无 ERA 数据，跳过位置注入');
                    return;
                }
                
                // 获取位置信息
                const location = eraVars?.world_state?.location;
                if (!location || typeof location.x !== 'number') {
                    console.log('[PKM] 无位置数据，跳过位置注入');
                    return;
                }
                
                // 生成完整的位置上下文文本
                const contextText = LocationContextBackend.generateContextText(
                    location.x, 
                    location.y, 
                    location.quadrant || 'NE'
                );
                
                const promptContent = `<location_context>
${contextText}
</location_context>`;
                
                // 先清除旧注入
                if (typeof uninjectPrompts === 'function') {
                    try { uninjectPrompts([LOCATION_INJECT_ID]); } catch (e) {}
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
                    console.log('[PKM] ✓ 位置上下文已注入:', location);
                } else {
                    console.warn('[PKM] injectPrompts API 不可用');
                }
            } catch (e) {
                console.error('[PKM] 位置上下文注入失败:', e);
            }
        }
        
        // ========== 初始化时注入位置上下文 ==========
        console.log('[PKM] 初始化位置上下文注入...');
        injectLocationContext();
        
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
                injectLocationContext(); // 刷新位置上下文注入
            });
            
            eventOn('generation_ended', () => {
                console.log('[PKM] 检测到消息生成完成，刷新面板和位置注入');
                refreshDashboard();
                injectLocationContext(); // 刷新位置上下文注入
            });
            
            eventOn('chat_changed', () => {
                console.log('[PKM] 检测到对话切换，重置面板');
                iframeInitialized = false;
                injectLocationContext(); // 切换对话时也刷新位置注入
            });
        }
        
        // ========== 监听 iframe 的 postMessage 请求 ==========
        window.addEventListener('message', function(event) {
            if (!event.data || !event.data.type) return;
            
            // 处理位置上下文注入请求
            if (event.data.type === 'PKM_INJECT_LOCATION') {
                const { id, content, position, depth } = event.data;
                console.log('[PKM] 收到位置上下文注入请求:', id);
                
                try {
                    // 先清除旧注入
                    if (typeof uninjectPrompts === 'function') {
                        try {
                            uninjectPrompts([id]);
                        } catch (e) {
                            // 忽略清除失败
                        }
                    }
                    
                    // 注入新内容（参考 pkm-tavern-plugin.js 的格式）
                    if (typeof injectPrompts === 'function') {
                        injectPrompts([{
                            id: id,
                            position: position || 'after_wi_scan',
                            depth: depth || 0,
                            role: 'system',
                            should_scan: false,
                            content: content
                        }]);
                        console.log('[PKM] ✓ 位置上下文已注入到世界书');
                    } else {
                        console.warn('[PKM] injectPrompts API 不可用');
                    }
                } catch (e) {
                    console.error('[PKM] 位置上下文注入失败:', e);
                }
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
