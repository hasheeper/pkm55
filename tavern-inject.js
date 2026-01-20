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
        
        // iframe（预加载用的隐藏 iframe）
        const hiddenIframe = $('<iframe>')
            .attr('id', 'pkm-iframe-hidden')
            .css({
                'position': 'fixed',
                'top': '-9999px',
                'left': '-9999px',
                'width': '485px',
                'height': '850px',
                'border': 'none',
                'visibility': 'hidden',
                'pointer-events': 'none'
            });
        
        // 显示用的 iframe（在 overlay 内）
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
        $('body').append(container).append(overlay).append(hiddenIframe);
        
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
            
            // 显示坐标转内部格子坐标（与 game.js 的 toInternalCoords 一致）
            toInternalCoords(displayX, displayY) {
                // 地图中心点（内部坐标）- 与 map/game.js 保持一致
                const MAP_CENTER_X = 26;
                const MAP_CENTER_Y = 26;
                
                // X轴：跳过0的逆运算
                let x = displayX;
                if (x > 0) x -= 1;
                let internalX = x + MAP_CENTER_X;
                
                // Y轴反向：跳过0的逆运算
                let y = displayY;
                if (y > 0) y -= 1;
                let internalY = MAP_CENTER_Y - y - 1;
                
                return { gx: internalX, gy: internalY };
            },
            
            // 从 mapdata.json 获取指定格子的实体信息
            getEntitiesAtGrid(gx, gy) {
                const entities = {
                    biomeZone: null,
                    regionZone: null,
                    placeAnchor: null,
                    npcActor: null,
                    pokemonCenter: null,
                    warp: null,
                    service: null,
                    bedRest: null,
                    pcTerminal: null,
                    policeBox: null,
                    transitStation: null,
                    lavaLine: null,
                    seaRoute: null,
                    skyNet: null
                };
                
                if (!this.mapData || !this.mapData.levels || !this.mapData.levels[0]) return entities;
                
                const levelData = this.mapData.levels[0];
                const worldX = gx * 16;
                const worldY = gy * 16;
                
                // 遍历所有实体层
                for (const layer of levelData.layerInstances || []) {
                    if (layer.__type !== 'Entities' || !layer.entityInstances) continue;
                    
                    for (const ent of layer.entityInstances) {
                        const ex = ent.px[0];
                        const ey = ent.px[1];
                        const ew = ent.width;
                        const eh = ent.height;
                        
                        // 检查实体是否覆盖当前格子
                        if (worldX >= ex && worldX < ex + ew && worldY >= ey && worldY < ey + eh) {
                            const id = ent.__identifier;
                            const layerId = layer.__identifier;
                            
                            // 获取实体的字段值
                            let fieldValue = null;
                            if (ent.fieldInstances && ent.fieldInstances.length > 0) {
                                fieldValue = ent.fieldInstances[0].__value;
                            }
                            
                            // 根据层名或实体类型匹配
                            if (layerId === 'Biome_Zone' || id === 'Biome' || id.startsWith('Biome')) {
                                entities.biomeZone = fieldValue || id;
                            } else if (layerId === 'Region_Zone' || id.startsWith('Region_')) {
                                entities.regionZone = fieldValue || id;
                            } else if (layerId === 'Place_Anchor' || id === 'Place_Anchor') {
                                entities.placeAnchor = fieldValue;
                            } else if (layerId === 'NPC_Actor' || id === 'NPC_Actor') {
                                entities.npcActor = fieldValue;
                            } else if (id === 'Pokemon_Centers') {
                                entities.pokemonCenter = fieldValue;
                            } else if (id === 'Warp') {
                                entities.warp = fieldValue;
                            } else if (id === 'Shop_Kiosk') {
                                entities.service = fieldValue;
                            } else if (id === 'Bed_Rest') {
                                entities.bedRest = fieldValue;
                            } else if (id === 'PC_Terminal') {
                                entities.pcTerminal = 'PC_Terminal';
                            } else if (id === 'Police_Box') {
                                entities.policeBox = fieldValue;
                            } else if (id === 'Transit_Station') {
                                entities.transitStation = fieldValue;
                            } else if (id === 'Lava_Line') {
                                entities.lavaLine = fieldValue;
                            } else if (id === 'Sea_Route') {
                                entities.seaRoute = fieldValue;
                            } else if (id === 'Sky_Net') {
                                entities.skyNet = fieldValue;
                            }
                        }
                    }
                }
                
                return entities;
            },
            
            // 生成完整的位置上下文文本
            generateContextText(x, y) {
                const lines = [];
                
                // 获取大区
                const regionId = this.getRegionByCoords(x, y);
                const regionInfo = this.REGIONS[regionId];
                const regionShort = regionInfo?.short || '?';
                
                // 转换为内部坐标并获取实体和格子信息
                const internal = this.toInternalCoords(x, y);
                const entities = this.getEntitiesAtGrid(internal.gx, internal.gy);
                const gridInfo = this.getGridInfo(internal.gx, internal.gy);
                
                lines.push('【当前位置】');
                lines.push(`坐标: [${x}, ${y}] ${regionShort}`);
                lines.push(`地表: ${gridInfo.surface || '未知'}`);
                lines.push(`可通行: ${gridInfo.traversable ? '是' : '否'}`);
                lines.push(`威胁度: ${gridInfo.threat} (${this.getThreatLabel(gridInfo.threat)})`);
                
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
                
                // ========== 区域描述优先级：水系 > 人文区 > 非水系生态区 ==========
                const waterBiomes = [
                    'Zero_Halo_Moat', 'Mirror_Lotis_Lake', 'Emerald_Vein_River', 'Crystal_Lagoon',
                    'Twin_Destiny_Basin', 'Chrome_Canal', 'Ferro_Straits', 'Mercury_Stream',
                    'Frigid_Floe', 'Mist_Veil_Sound', 'Prism_Bay', 'Cerulean_Reef',
                    'Basalt_Shoals', 'Equatorial_Dark_Zone', 'Titan_Trough', 'Chrome_Abyss', 'Boreal_Trench'
                ];
                
                const hasRegionZone = entities.regionZone;
                const hasBiomeZone = entities.biomeZone;
                const isWaterBiome = hasBiomeZone && waterBiomes.includes(entities.biomeZone);
                
                // 1. 优先显示水系生态区
                if (isWaterBiome) {
                    lines.push(`所属水域: ${entities.biomeZone}`);
                    const biomeDesc = this.biomeFlavor[entities.biomeZone];
                    if (biomeDesc) {
                        if (biomeDesc.visual_texture) lines.push(`【视觉纹理】${biomeDesc.visual_texture}`);
                        if (biomeDesc.sensory_feed) lines.push(`【感官体验】${biomeDesc.sensory_feed}`);
                    }
                }
                // 2. 其次显示人文区（如果不是水系）
                else if (hasRegionZone) {
                    lines.push(`所属设施区: ${entities.regionZone}`);
                    const rzDesc = this.regionZones[entities.regionZone];
                    if (rzDesc) {
                        if (rzDesc.exterior_view) lines.push(`【外观描述】${rzDesc.exterior_view}`);
                        if (rzDesc.internal_reality) lines.push(`【内部环境】${rzDesc.internal_reality}`);
                    }
                }
                // 3. 最后显示非水系生态区
                else if (hasBiomeZone) {
                    lines.push(`所属生态区: ${entities.biomeZone}`);
                    const biomeDesc = this.biomeFlavor[entities.biomeZone];
                    if (biomeDesc) {
                        if (biomeDesc.visual_texture) lines.push(`【视觉纹理】${biomeDesc.visual_texture}`);
                        if (biomeDesc.sensory_feed) lines.push(`【感官体验】${biomeDesc.sensory_feed}`);
                    }
                }
                // 4. 如果都没有，查找最近的区域
                else {
                    const nearestRZ = this.findNearestRegionZone(x, y);
                    const nearestBZ = this.findNearestBiomeZone(x, y);
                    
                    // 优先显示距离更近的
                    if (nearestRZ && (!nearestBZ || nearestRZ.distance <= nearestBZ.distance)) {
                        lines.push(`附近设施区: ${nearestRZ.name} (~${nearestRZ.distance}格)`);
                        if (nearestRZ.data.exterior_view) lines.push(`【外观描述】${nearestRZ.data.exterior_view}`);
                        if (nearestRZ.data.internal_reality) lines.push(`【内部环境】${nearestRZ.data.internal_reality}`);
                    } else if (nearestBZ) {
                        lines.push(`附近生态区: ${nearestBZ.name} (~${nearestBZ.distance}格)`);
                        if (nearestBZ.data.visual_texture) lines.push(`【视觉纹理】${nearestBZ.data.visual_texture}`);
                        if (nearestBZ.data.sensory_feed) lines.push(`【感官体验】${nearestBZ.data.sensory_feed}`);
                    }
                }
                
                // ========== 点坐标设施 ==========
                if (entities.pokemonCenter) {
                    const pcDesc = this.service[entities.pokemonCenter];
                    lines.push(`【宝可梦中心】${pcDesc?.name || entities.pokemonCenter}`);
                    if (pcDesc?.desc) lines.push(`  ${pcDesc.desc}`);
                }
                if (entities.service) {
                    const svcDesc = this.service[entities.service];
                    lines.push(`【服务设施】${svcDesc?.name || entities.service}`);
                    if (svcDesc?.desc) lines.push(`  ${svcDesc.desc}`);
                }
                if (entities.placeAnchor) {
                    const anchorDesc = this.placeAnchor[entities.placeAnchor];
                    lines.push(`【场所类型】${entities.placeAnchor}`);
                    if (anchorDesc?.desc) lines.push(`  ${anchorDesc.desc}`);
                }
                if (entities.warp) {
                    const warpDesc = this.systemWarps[entities.warp];
                    lines.push(`【传送点】${entities.warp}`);
                    if (warpDesc?.desc) lines.push(`  ${warpDesc.desc}`);
                }
                if (entities.npcActor) {
                    const npcDesc = this.npcContext[entities.npcActor];
                    lines.push(`【NPC场景】${entities.npcActor}`);
                    if (npcDesc?.desc) lines.push(`  ${npcDesc.desc}`);
                }
                if (entities.bedRest) {
                    const bedDesc = this.service[entities.bedRest];
                    lines.push(`【休息点】${bedDesc?.name || entities.bedRest}`);
                    if (bedDesc?.desc) lines.push(`  ${bedDesc.desc}`);
                }
                if (entities.pcTerminal) {
                    const pcTermDesc = this.service['PC_Terminal'];
                    lines.push(`【PC终端】${pcTermDesc?.name || 'Box-Link Terminal'}`);
                    if (pcTermDesc?.desc) lines.push(`  ${pcTermDesc.desc}`);
                }
                if (entities.policeBox) {
                    const policeDesc = this.service[entities.policeBox];
                    lines.push(`【警察站】${policeDesc?.name || entities.policeBox}`);
                    if (policeDesc?.desc) lines.push(`  ${policeDesc.desc}`);
                }
                if (entities.transitStation) {
                    const transitDesc = this.transitInfra[entities.transitStation];
                    lines.push(`【交通站】${transitDesc?.name || entities.transitStation}`);
                    if (transitDesc?.desc) lines.push(`  ${transitDesc.desc}`);
                }
                if (entities.lavaLine) {
                    const lavaDesc = this.transitInfra[entities.lavaLine];
                    lines.push(`【缆车站】${lavaDesc?.name || entities.lavaLine}`);
                    if (lavaDesc?.desc) lines.push(`  ${lavaDesc.desc}`);
                }
                if (entities.seaRoute) {
                    const seaDesc = this.transitInfra[entities.seaRoute];
                    lines.push(`【港口码头】${seaDesc?.name || entities.seaRoute}`);
                    if (seaDesc?.desc) lines.push(`  ${seaDesc.desc}`);
                }
                if (entities.skyNet) {
                    const skyDesc = this.transitInfra[entities.skyNet];
                    lines.push(`【空运停机坪】${skyDesc?.name || entities.skyNet}`);
                    if (skyDesc?.desc) lines.push(`  ${skyDesc.desc}`);
                }
                
                // ========== 周围环境（半径2格）==========
                lines.push('');
                lines.push('【周围环境】(半径2格)');
                
                const surrounding = this.getSurroundingInfo(internal.gx, internal.gy, 2);
                
                // 按地表类型分组
                const surfaceGrouped = {};
                // 按设施区分组
                const regionZoneGrouped = {};
                // 收集特殊设施
                const facilities = [];
                
                for (const s of surrounding) {
                    if (s.surface === null) continue;
                    
                    // 地表分组
                    const surfKey = `${s.surface}${s.traversable ? '' : '(不可通行)'}`;
                    if (!surfaceGrouped[surfKey]) surfaceGrouped[surfKey] = [];
                    surfaceGrouped[surfKey].push(s.direction);
                    
                    // 设施区分组（只显示与当前不同的）
                    if (s.regionZone && s.regionZone !== entities.regionZone) {
                        if (!regionZoneGrouped[s.regionZone]) regionZoneGrouped[s.regionZone] = [];
                        regionZoneGrouped[s.regionZone].push(s.direction);
                    }
                    
                    // 收集特殊设施
                    if (s.pokemonCenter) facilities.push({ dir: s.direction, type: 'PC', name: s.pokemonCenter });
                    if (s.service) facilities.push({ dir: s.direction, type: '商店', name: s.service });
                    if (s.placeAnchor) facilities.push({ dir: s.direction, type: '场所', name: s.placeAnchor });
                    if (s.warp) facilities.push({ dir: s.direction, type: '传送', name: s.warp });
                    if (s.npcActor) facilities.push({ dir: s.direction, type: 'NPC', name: s.npcActor });
                    if (s.bedRest) facilities.push({ dir: s.direction, type: '休息', name: s.bedRest });
                    if (s.pcTerminal) facilities.push({ dir: s.direction, type: 'PC终端', name: 'PC_Terminal' });
                    if (s.policeBox) facilities.push({ dir: s.direction, type: '警察', name: s.policeBox });
                    if (s.transitStation) facilities.push({ dir: s.direction, type: '交通', name: s.transitStation });
                    if (s.lavaLine) facilities.push({ dir: s.direction, type: '缆车', name: s.lavaLine });
                }
                
                // 显示地表
                if (Object.keys(surfaceGrouped).length === 0) {
                    lines.push('  (位于地图边缘，周围信息有限)');
                } else {
                    for (const [terrain, dirs] of Object.entries(surfaceGrouped)) {
                        lines.push(`  ${dirs.join('、')}: ${terrain}`);
                    }
                }
                
                // 显示周围不同的设施区
                if (Object.keys(regionZoneGrouped).length > 0) {
                    lines.push('  [周围设施区]');
                    for (const [zone, dirs] of Object.entries(regionZoneGrouped)) {
                        lines.push(`    ${dirs.join('、')}: ${zone}`);
                    }
                }
                
                // 显示周围特殊设施
                if (facilities.length > 0) {
                    lines.push('  [周围设施]');
                    // 合并相同类型和名称的设施
                    const facilityGrouped = {};
                    for (const f of facilities) {
                        const key = `${f.type}:${f.name}`;
                        if (!facilityGrouped[key]) facilityGrouped[key] = { type: f.type, name: f.name, dirs: [] };
                        facilityGrouped[key].dirs.push(f.dir);
                    }
                    for (const f of Object.values(facilityGrouped)) {
                        lines.push(`    ${f.dirs.join('、')}: [${f.type}] ${f.name}`);
                    }
                }
                
                // ========== 本区块地标（Biome_Zone）==========
                const biomeZoneName = entities.biomeZone;
                if (biomeZoneName) {
                    lines.push('');
                    lines.push(`【本区块地标】(${biomeZoneName})`);
                    
                    const biomeLandmarks = this.getBiomeZoneLandmarks(biomeZoneName, x, y);
                    if (biomeLandmarks.length > 0) {
                        for (const lm of biomeLandmarks.slice(0, 5)) {
                            lines.push(`  • ${lm.name} [${lm.center[0]}, ${lm.center[1]}] (~${lm.distance}格)`);
                        }
                    } else {
                        lines.push('  (无已知地标)');
                    }
                }
                
                // 本大区地标
                lines.push('');
                lines.push(`【本大区地标】(${regionInfo?.name || regionId})`);
                
                const landmarks = this.getRegionLandmarks(regionId, x, y);
                if (landmarks.length > 0) {
                    for (const lm of landmarks.slice(0, 6)) {
                        lines.push(`  • ${lm.name} [${lm.center[0]}, ${lm.center[1]}] (~${lm.distance}格)`);
                    }
                }
                
                // 全图区域概览
                lines.push('');
                lines.push('【全图区域】');
                
                for (const [id, data] of Object.entries(this.REGIONS)) {
                    const isCurrent = id === regionId;
                    const marker = isCurrent ? '★' : '○';
                    lines.push(`  ${marker} ${data.name} [${data.center[0]}, ${data.center[1]}]`);
                }
                
                // ========== 交通系统 ==========
                const transitStations = this.getAllTransitStations();
                const seaPorts = this.getAllSeaPorts();
                const airfields = this.getAllAirfields();
                
                if (transitStations.length > 0 || seaPorts.length > 0 || airfields.length > 0) {
                    lines.push('');
                    lines.push('【交通系统】');
                    
                    // 环线车站
                    if (transitStations.length > 0) {
                        lines.push('  ■ 环线车站:');
                        const currentRegionStations = [];
                        const otherRegionStations = [];
                        
                        for (const station of transitStations) {
                            const stationRegion = this.getRegionByCoords(station.displayX, station.displayY);
                            if (stationRegion === regionId) {
                                currentRegionStations.push(station);
                            } else {
                                otherRegionStations.push(station);
                            }
                        }
                        
                        if (currentRegionStations.length > 0) {
                            lines.push(`    ★ ${regionInfo?.name || regionId}:`);
                            for (const st of currentRegionStations) {
                                const desc = this.transitInfra[st.id];
                                const name = desc?.name || st.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${st.displayX}, ${st.displayY}]`);
                            }
                        }
                        
                        if (otherRegionStations.length > 0) {
                            lines.push(`    ○ 其他大区:`);
                            for (const st of otherRegionStations) {
                                const stationRegion = this.getRegionByCoords(st.displayX, st.displayY);
                                const regionData = this.REGIONS[stationRegion];
                                const regionName = regionData?.short || stationRegion;
                                const desc = this.transitInfra[st.id];
                                const name = desc?.name || st.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${st.displayX}, ${st.displayY}] (${regionName})`);
                            }
                        }
                    }
                    
                    // 港口码头
                    if (seaPorts.length > 0) {
                        lines.push('  ■ 港口码头:');
                        const currentRegionPorts = [];
                        const otherRegionPorts = [];
                        
                        for (const port of seaPorts) {
                            const portRegion = this.getRegionByCoords(port.displayX, port.displayY);
                            if (portRegion === regionId) {
                                currentRegionPorts.push(port);
                            } else {
                                otherRegionPorts.push(port);
                            }
                        }
                        
                        if (currentRegionPorts.length > 0) {
                            lines.push(`    ★ ${regionInfo?.name || regionId}:`);
                            for (const pt of currentRegionPorts) {
                                const desc = this.transitInfra[pt.id];
                                const name = desc?.name || pt.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${pt.displayX}, ${pt.displayY}]`);
                            }
                        }
                        
                        if (otherRegionPorts.length > 0) {
                            lines.push(`    ○ 其他大区:`);
                            for (const pt of otherRegionPorts) {
                                const portRegion = this.getRegionByCoords(pt.displayX, pt.displayY);
                                const regionData = this.REGIONS[portRegion];
                                const regionName = regionData?.short || portRegion;
                                const desc = this.transitInfra[pt.id];
                                const name = desc?.name || pt.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${pt.displayX}, ${pt.displayY}] (${regionName})`);
                            }
                        }
                    }
                    
                    // 空运停机坪
                    if (airfields.length > 0) {
                        lines.push('  ■ 空运停机坪:');
                        const currentRegionAir = [];
                        const otherRegionAir = [];
                        
                        for (const air of airfields) {
                            const airRegion = this.getRegionByCoords(air.displayX, air.displayY);
                            if (airRegion === regionId) {
                                currentRegionAir.push(air);
                            } else {
                                otherRegionAir.push(air);
                            }
                        }
                        
                        if (currentRegionAir.length > 0) {
                            lines.push(`    ★ ${regionInfo?.name || regionId}:`);
                            for (const af of currentRegionAir) {
                                const desc = this.transitInfra[af.id];
                                const name = desc?.name || af.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${af.displayX}, ${af.displayY}]`);
                            }
                        }
                        
                        if (otherRegionAir.length > 0) {
                            lines.push(`    ○ 其他大区:`);
                            for (const af of otherRegionAir) {
                                const airRegion = this.getRegionByCoords(af.displayX, af.displayY);
                                const regionData = this.REGIONS[airRegion];
                                const regionName = regionData?.short || airRegion;
                                const desc = this.transitInfra[af.id];
                                const name = desc?.name || af.id.replace(/_/g, ' ');
                                lines.push(`      • ${name} [${af.displayX}, ${af.displayY}] (${regionName})`);
                            }
                        }
                    }
                }
                
                
                return lines.join('\n');
            },
            
            // 生成附近宝可梦列表
            generateNearbyPokemon(biomeZone) {
                if (!this.spawnTablesData) return [];
                
                // 区域名称映射
                const BIOME_ZONE_MAPPING = {
                    "Arcadia_Lawns": "Aether_Admin_Zone",
                    "Zenith_HQ": "Aether_Admin_Zone",
                    "Pearl_Resort": "Sapphire_Strand",
                    "Jade_Canopy": "Jade_Canopy",
                    "Radiant_Plains": "Radiant_Plains",
                    "Cinder_Moor": "Cinder_Moor",
                    "Silent_Tundra": "Silent_Tundra",
                    "Crimson_Badlands": "Crimson_Badlands"
                };
                
                const resolvedZone = BIOME_ZONE_MAPPING[biomeZone] || biomeZone;
                const zoneTable = this.spawnTablesData[resolvedZone] || this.spawnTablesData['Aether_Admin_Zone'];
                
                if (!zoneTable) return [];
                
                const results = [];
                const surfacePool = zoneTable['Standard_Grass'] || zoneTable['Pavement'] || Object.values(zoneTable)[0];
                
                if (!surfacePool) return [];
                
                // 从 common 池中随机选择 3-4 个
                const commonPool = surfacePool.common || [];
                for (let i = 0; i < Math.min(4, commonPool.length); i++) {
                    const entry = commonPool[Math.floor(Math.random() * commonPool.length)];
                    const pokemonId = typeof entry === 'string' ? entry : entry.id;
                    const minLevel = typeof entry === 'object' ? (entry.min || 5) : 5;
                    results.push({
                        id: pokemonId,
                        level: minLevel + Math.floor(Math.random() * 10),
                        rarity: 'common'
                    });
                }
                
                // 从 uncommon 池中随机选择 1 个
                const uncommonPool = surfacePool.uncommon || [];
                if (uncommonPool.length > 0) {
                    const entry = uncommonPool[Math.floor(Math.random() * uncommonPool.length)];
                    const pokemonId = typeof entry === 'string' ? entry : entry.id;
                    const minLevel = typeof entry === 'object' ? (entry.min || 10) : 10;
                    results.push({
                        id: pokemonId,
                        level: minLevel + Math.floor(Math.random() * 8),
                        rarity: 'uncommon'
                    });
                }
                
                return results;
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
            },
            
            // 获取当前 Biome_Zone 内的地标列表
            getBiomeZoneLandmarks(currentBiomeZone, x, y) {
                const landmarks = [];
                
                // 从 regionZones 中查找属于当前生态区的地标
                for (const [zoneName, zoneData] of Object.entries(this.regionZones)) {
                    if (zoneData.center_point) {
                        const dist = Math.abs(zoneData.center_point[0] - x) + Math.abs(zoneData.center_point[1] - y);
                        landmarks.push({
                            name: zoneName,
                            center: zoneData.center_point,
                            distance: dist,
                            hasDescription: !!(zoneData.exterior_view || zoneData.internal_reality)
                        });
                    }
                }
                
                // 按距离排序
                landmarks.sort((a, b) => a.distance - b.distance);
                return landmarks;
            },
            
            // 地表类型配置
            TERRAIN_CONFIG: {
                1: { type: 'Pavement' },
                2: { type: 'Standard_Grass' },
                3: { type: 'Tall_Grass' },
                4: { type: 'Water_Shallow' },
                5: { type: 'Water_Deep' },
                6: { type: 'Sand' },
                7: { type: 'Rock' },
                8: { type: 'Snow' },
                9: { type: 'Ice' },
                10: { type: 'Lava' },
                11: { type: 'Mud' },
                12: { type: 'Wet_Soil' },
                13: { type: 'Ash' },
                14: { type: 'Metal' },
                15: { type: 'Wood' },
                16: { type: 'Carpet' }
            },
            
            // 从 mapdata.json 获取 IntGrid 值
            getIntVal(gx, gy, layerName) {
                if (!this.mapData || !this.mapData.levels || !this.mapData.levels[0]) return 0;
                
                const levelData = this.mapData.levels[0];
                const gridSize = 16;
                
                for (const layer of levelData.layerInstances || []) {
                    if (layer.__identifier === layerName && layer.__type === 'IntGrid') {
                        const cWid = layer.__cWid;
                        const idx = gy * cWid + gx;
                        if (layer.intGridCsv && idx >= 0 && idx < layer.intGridCsv.length) {
                            return layer.intGridCsv[idx];
                        }
                    }
                }
                return 0;
            },
            
            // 获取格子的基本信息
            getGridInfo(gx, gy) {
                const info = {
                    gx, gy,
                    surface: null,
                    traversable: true,
                    threat: 0,
                    biomeZone: null,
                    region: null
                };
                
                // 获取地表类型
                const surfaceVal = this.getIntVal(gx, gy, 'Surface');
                if (surfaceVal > 0 && this.TERRAIN_CONFIG[surfaceVal]) {
                    info.surface = this.TERRAIN_CONFIG[surfaceVal].type;
                }
                
                // 获取可通行性
                const travVal = this.getIntVal(gx, gy, 'Traversability');
                info.traversable = travVal !== 1;
                
                // 获取威胁度
                info.threat = this.getIntVal(gx, gy, 'Threat');
                
                // 获取Region
                const regionVal = this.getIntVal(gx, gy, 'Regions');
                const regionMap = {
                    2: 'Region_Zenith',
                    3: 'Region_Neon',
                    4: 'Region_Bloom',
                    5: 'Region_Shadow',
                    6: 'Region_Apex'
                };
                if (regionMap[regionVal]) {
                    info.region = regionMap[regionVal];
                }
                
                return info;
            },
            
            // 获取所有交通站点
            getAllTransitStations() {
                if (!this.mapData || !this.mapData.levels || !this.mapData.levels[0]) return [];
                
                const stations = [];
                const levelData = this.mapData.levels[0];
                const gridSize = 16;
                
                for (const layer of levelData.layerInstances || []) {
                    if (layer.__identifier === 'Entities' && layer.__type === 'Entities') {
                        for (const entity of layer.entityInstances || []) {
                            if (entity.__identifier === 'Transit_Station') {
                                const worldX = entity.__worldX || entity.px[0];
                                const worldY = entity.__worldY || entity.px[1];
                                const gx = Math.floor(worldX / gridSize);
                                const gy = Math.floor(worldY / gridSize);
                                
                                // 转换为显示坐标
                                const displayCoords = this.toDisplayCoords(gx, gy);
                                
                                // 获取站点ID
                                let stationId = null;
                                for (const field of entity.fieldInstances || []) {
                                    if (field.__identifier === 'Transit_Station') {
                                        stationId = field.__value;
                                        break;
                                    }
                                }
                                
                                if (stationId) {
                                    stations.push({
                                        id: stationId,
                                        gx, gy,
                                        displayX: displayCoords.x,
                                        displayY: displayCoords.y
                                    });
                                }
                            }
                        }
                    }
                }
                
                return stations;
            },
            
            // 获取所有港口码头
            getAllSeaPorts() {
                if (!this.mapData || !this.mapData.levels || !this.mapData.levels[0]) return [];
                
                const ports = [];
                const levelData = this.mapData.levels[0];
                const gridSize = 16;
                
                for (const layer of levelData.layerInstances || []) {
                    if (layer.__identifier === 'Entities' && layer.__type === 'Entities') {
                        for (const entity of layer.entityInstances || []) {
                            if (entity.__identifier === 'Sea_Route') {
                                const worldX = entity.__worldX || entity.px[0];
                                const worldY = entity.__worldY || entity.px[1];
                                const gx = Math.floor(worldX / gridSize);
                                const gy = Math.floor(worldY / gridSize);
                                
                                const displayCoords = this.toDisplayCoords(gx, gy);
                                
                                let portId = null;
                                for (const field of entity.fieldInstances || []) {
                                    if (field.__identifier === 'Sea_Route') {
                                        portId = field.__value;
                                        break;
                                    }
                                }
                                
                                if (portId) {
                                    ports.push({
                                        id: portId,
                                        gx, gy,
                                        displayX: displayCoords.x,
                                        displayY: displayCoords.y
                                    });
                                }
                            }
                        }
                    }
                }
                
                return ports;
            },
            
            // 获取所有空运停机坪
            getAllAirfields() {
                if (!this.mapData || !this.mapData.levels || !this.mapData.levels[0]) return [];
                
                const airfields = [];
                const levelData = this.mapData.levels[0];
                const gridSize = 16;
                
                for (const layer of levelData.layerInstances || []) {
                    if (layer.__identifier === 'Entities' && layer.__type === 'Entities') {
                        for (const entity of layer.entityInstances || []) {
                            if (entity.__identifier === 'Sky_Net') {
                                const worldX = entity.__worldX || entity.px[0];
                                const worldY = entity.__worldY || entity.px[1];
                                const gx = Math.floor(worldX / gridSize);
                                const gy = Math.floor(worldY / gridSize);
                                
                                const displayCoords = this.toDisplayCoords(gx, gy);
                                
                                let airId = null;
                                for (const field of entity.fieldInstances || []) {
                                    if (field.__identifier === 'Sky_Net') {
                                        airId = field.__value;
                                        break;
                                    }
                                }
                                
                                if (airId) {
                                    airfields.push({
                                        id: airId,
                                        gx, gy,
                                        displayX: displayCoords.x,
                                        displayY: displayCoords.y
                                    });
                                }
                            }
                        }
                    }
                }
                
                return airfields;
            },
            
            // 获取周围格子的简要信息
            getSurroundingInfo(gx, gy, radius = 2) {
                const surrounding = [];
                
                const offsets = radius === 1 ? [
                    { dx: 0, dy: -1, dir: '北' },
                    { dx: 0, dy: 1, dir: '南' },
                    { dx: -1, dy: 0, dir: '西' },
                    { dx: 1, dy: 0, dir: '东' }
                ] : [
                    { dx: 0, dy: -1, dir: '北' },
                    { dx: 0, dy: 1, dir: '南' },
                    { dx: -1, dy: 0, dir: '西' },
                    { dx: 1, dy: 0, dir: '东' },
                    { dx: -1, dy: -1, dir: '西北' },
                    { dx: 1, dy: -1, dir: '东北' },
                    { dx: -1, dy: 1, dir: '西南' },
                    { dx: 1, dy: 1, dir: '东南' },
                    { dx: 0, dy: -2, dir: '北2' },
                    { dx: 0, dy: 2, dir: '南2' },
                    { dx: -2, dy: 0, dir: '西2' },
                    { dx: 2, dy: 0, dir: '东2' }
                ];
                
                for (const { dx, dy, dir } of offsets) {
                    const ngx = gx + dx;
                    const ngy = gy + dy;
                    const info = this.getGridInfo(ngx, ngy);
                    const entities = this.getEntitiesAtGrid(ngx, ngy);
                    
                    if (info) {
                        surrounding.push({
                            direction: dir,
                            offset: [dx, dy],
                            surface: info.surface,
                            traversable: info.traversable,
                            threat: info.threat,
                            biomeZone: info.biomeZone || entities.biomeZone,
                            regionZone: entities.regionZone,
                            placeAnchor: entities.placeAnchor,
                            service: entities.service,
                            pokemonCenter: entities.pokemonCenter,
                            npcActor: entities.npcActor,
                            warp: entities.warp,
                            bedRest: entities.bedRest,
                            pcTerminal: entities.pcTerminal,
                            policeBox: entities.policeBox,
                            transitStation: entities.transitStation,
                            lavaLine: entities.lavaLine
                        });
                    }
                }
                
                return surrounding;
            }
        };
        
        // ========== 宝可梦区域刷新系统（ERA 注入版）==========
        const PokemonSpawnSystem = {
            // 威胁度定义
            THREAT_PEACE: 6,
            
            // 区域名称映射（与 pokemonEngine.js 一致）
            BIOME_ZONE_MAPPING: {
                "Arcadia_Lawns": "Aether_Admin_Zone",
                "Zenith_HQ": "Aether_Admin_Zone",
                "Lusamine_Gardens": "Aether_Admin_Zone",
                "Academic_Plaza": "Aether_Admin_Zone",
                "Royal_Academy": "Aether_Admin_Zone",
                "Zero_Halo_Moat": "Zero_Halo_Moat",
                "Pearl_Resort": "Sapphire_Strand",
                "Sapphire_Marina": "Sapphire_Strand",
                "Sunflora_Farmsteads": "Aroma_Meadow",
                "Marina_Port_Town": "Breeze_Woodlands",
                "Jade_Canopy": "Jade_Canopy",
                "Deep_Root_Hollow": "Deep_Root_Hollow",
                "Breeze_Woodlands": "Breeze_Woodlands",
                "Hermit_Sands": "Hermit_Sands",
                "Golden_Horizon": "Golden_Horizon",
                "Electro_Avenue": "Radiant_Plains",
                "Cyber_Shopping_District": "Radiant_Plains",
                "Frost_Smoke_City": "Silent_Tundra",
                "Grim_Borough": "Cinder_Moor",
                "Crimson_Forge_City": "Crimson_Badlands",
                "Titan_Mining_site": "Crimson_Badlands",
                "Savanna_Outlands": "Savanna_Outlands",
                "Aroma_Meadow": "Aroma_Meadow",
                "Radiant_Plains": "Radiant_Plains"
            },
            
            // 检查是否为和平区域
            isPeaceZone(threat) {
                return threat === this.THREAT_PEACE || threat === 0;
            },
            
            // 根据威胁度决定稀有度池
            getRarityPool(threat) {
                if (this.isPeaceZone(threat)) return null;
                
                const roll = Math.random() * 100;
                
                if (threat === 1) {
                    if (roll < 90) return 'common';
                    if (roll < 99) return 'uncommon';
                    return 'rare';
                } else if (threat === 2) {
                    if (roll < 75) return 'common';
                    if (roll < 93) return 'uncommon';
                    if (roll < 99) return 'rare';
                    return 'boss';
                } else if (threat === 3) {
                    if (roll < 55) return 'common';
                    if (roll < 83) return 'uncommon';
                    if (roll < 96) return 'rare';
                    return 'boss';
                } else if (threat === 4) {
                    if (roll < 35) return 'common';
                    if (roll < 67) return 'uncommon';
                    if (roll < 90) return 'rare';
                    return 'boss';
                } else {
                    if (roll < 20) return 'common';
                    if (roll < 50) return 'uncommon';
                    if (roll < 80) return 'rare';
                    return 'boss';
                }
            },
            
            // 根据威胁度计算等级范围
            getLevelRange(threat) {
                const ranges = {
                    1: { min: 3, max: 10 },
                    2: { min: 8, max: 18 },
                    3: { min: 15, max: 28 },
                    4: { min: 25, max: 42 },
                    5: { min: 38, max: 60 }
                };
                return ranges[threat] || ranges[1];
            },
            
            // 解析区域名称
            resolveZoneName(biomeZone, surfaceType) {
                if (!biomeZone || biomeZone === '' || biomeZone === 'Unknown') {
                    const waterSurfaces = ['Fresh_Water', 'Shallow_Sea', 'Deep_Sea', 'Glacial_Water', 'Sewage'];
                    if (waterSurfaces.includes(surfaceType)) {
                        if (surfaceType === 'Deep_Sea') return 'Equatorial_Dark_Zone';
                        if (surfaceType === 'Shallow_Sea') return 'Crystal_Lagoon';
                        if (surfaceType === 'Fresh_Water') return 'Zero_Halo_Moat';
                        return 'Crystal_Lagoon';
                    }
                    return 'Aether_Admin_Zone';
                }
                
                if (this.BIOME_ZONE_MAPPING[biomeZone]) {
                    return this.BIOME_ZONE_MAPPING[biomeZone];
                }
                
                return biomeZone;
            },
            
            // 从池中随机选择一个宝可梦
            pickFromPool(pool, levelRange) {
                if (!pool || pool.length === 0) return null;
                
                const idx = Math.floor(Math.random() * pool.length);
                const entry = pool[idx];
                
                let pokemonId, minLevel;
                if (typeof entry === 'string') {
                    pokemonId = entry;
                    minLevel = levelRange.min;
                } else {
                    pokemonId = entry.id;
                    minLevel = entry.min || levelRange.min;
                }
                
                const effectiveMin = Math.max(minLevel, levelRange.min);
                const effectiveMax = Math.max(levelRange.max, effectiveMin);
                const level = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
                
                return { id: pokemonId, level };
            },
            
            // 生成单个格子的宝可梦列表
            spawnForGrid(gx, gy, spawnTablesData) {
                const gridInfo = LocationContextBackend.getGridInfo(gx, gy);
                const entities = LocationContextBackend.getEntitiesAtGrid(gx, gy);
                
                const threat = gridInfo.threat;
                const surfaceType = gridInfo.surface || 'Pavement';
                const biomeZone = entities.biomeZone || 'Unknown';
                
                // 和平区域无宝可梦
                if (this.isPeaceZone(threat)) {
                    return [];
                }
                
                const resolvedZone = this.resolveZoneName(biomeZone, surfaceType);
                
                let zoneTable = spawnTablesData[resolvedZone];
                if (!zoneTable) {
                    zoneTable = spawnTablesData['Aether_Admin_Zone'];
                }
                if (!zoneTable) return [];
                
                let surfacePool = zoneTable[surfaceType];
                if (!surfacePool) {
                    surfacePool = zoneTable['Standard_Grass'] || zoneTable['Pavement'] || Object.values(zoneTable)[0];
                }
                if (!surfacePool) return [];
                
                const count = 4 + Math.floor(Math.random() * 2);
                const results = [];
                const levelRange = this.getLevelRange(threat);
                
                for (let i = 0; i < count; i++) {
                    const rarity = this.getRarityPool(threat);
                    if (!rarity) continue;
                    
                    let pool = surfacePool[rarity];
                    if (!pool || pool.length === 0) {
                        pool = surfacePool['common'];
                    }
                    if (!pool || pool.length === 0) continue;
                    
                    const pokemon = this.pickFromPool(pool, levelRange);
                    if (pokemon) {
                        results.push({
                            ...pokemon,
                            rarity,
                            biome: biomeZone,
                            surface: surfaceType,
                            threat
                        });
                    }
                }
                
                results.sort((a, b) => a.level - b.level);
                return results;
            },
            
            // 生成位置键
            getLocationKey(gx, gy) {
                return `${gx}_${gy}`;
            },
            
            // 为玩家周围区域生成宝可梦（半径2格）
            async generateForNearbyGrids(x, y, eraVars) {
                await LocationContextBackend.loadData();
                
                const spawnTablesData = LocationContextBackend.spawnTablesData;
                if (!spawnTablesData) {
                    console.warn('[PKM] SPAWN_TABLES_DATA 未加载');
                    return null;
                }
                
                const internal = LocationContextBackend.toInternalCoords(x, y);
                const centerGx = internal.gx;
                const centerGy = internal.gy;
                
                // 获取当前 ERA 中已存在的宝可梦区域
                const existingSpawns = eraVars?.world_state?.pokemon_spawns || {};
                
                // 半径2格的所有格子（与地标范围一致）
                const offsets = [
                    { dx: 0, dy: 0 },   // 当前格子
                    { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                    { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
                    { dx: 0, dy: -2 }, { dx: 0, dy: 2 }, { dx: -2, dy: 0 }, { dx: 2, dy: 0 }
                ];
                
                const newSpawns = {};
                
                for (const { dx, dy } of offsets) {
                    const gx = centerGx + dx;
                    const gy = centerGy + dy;
                    const key = this.getLocationKey(gx, gy);
                    
                    // 只增不改：如果已存在则跳过
                    if (existingSpawns[key]) {
                        continue;
                    }
                    
                    // 生成该格子的宝可梦
                    const pokemonList = this.spawnForGrid(gx, gy, spawnTablesData);
                    if (pokemonList.length > 0) {
                        // 转换为对象结构（ERA 不支持数组）
                        const pokemonObj = {};
                        pokemonList.forEach((poke, idx) => {
                            pokemonObj[`p${idx + 1}`] = poke;
                        });
                        newSpawns[key] = pokemonObj;
                    }
                }
                
                return Object.keys(newSpawns).length > 0 ? newSpawns : null;
            },
            
            // 获取当前格子的宝可梦（用于位置上下文显示）
            getCurrentGridPokemon(x, y, eraVars) {
                const internal = LocationContextBackend.toInternalCoords(x, y);
                const key = this.getLocationKey(internal.gx, internal.gy);
                
                const spawns = eraVars?.world_state?.pokemon_spawns || {};
                const gridData = spawns[key];
                if (!gridData) return [];
                
                // 从对象结构转回数组（p1, p2, p3...）
                const result = [];
                const keys = Object.keys(gridData).sort((a, b) => {
                    const numA = parseInt(a.replace('p', ''));
                    const numB = parseInt(b.replace('p', ''));
                    return numA - numB;
                });
                for (const k of keys) {
                    if (gridData[k]) result.push(gridData[k]);
                }
                return result;
            }
        };
        
        // ========== ERA 变量操作函数（参考 pkm-tavern-plugin.js）==========
        
        // 插入 ERA 变量（只增不改）
        function insertEraVars(data) {
            if (typeof eventEmit === 'function') {
                eventEmit('era:insertByObject', data);
            }
        }
        
        // 更新 ERA 变量
        function updateEraVars(data) {
            if (typeof eventEmit === 'function') {
                eventEmit('era:updateByObject', data);
            }
        }
        
        // 插入宝可梦区域数据
        async function eraInsertPokemonSpawns(newSpawns) {
            if (!newSpawns || Object.keys(newSpawns).length === 0) return;
            
            const insertData = {
                world_state: {
                    pokemon_spawns: newSpawns
                }
            };
            
            // 使用 era:insertByObject 插入（只增不改）
            insertEraVars(insertData);
            console.log('[PKM] ✓ 宝可梦区域已注入 ERA:', Object.keys(newSpawns));
        }
        
        // 清除宝可梦区域数据（每日刷新）
        async function eraDeletePokemonSpawns() {
            // 使用 updateEraVars 将 pokemon_spawns 设为空对象
            updateEraVars({
                'world_state.pokemon_spawns': {}
            });
            console.log('[PKM] ✓ 宝可梦区域已清除（每日刷新）');
        }
        
        // 记录上次的游戏日期，用于检测日期变化
        let lastGameDay = null;
        
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
                
                // ========== 检测日期变化，清除宝可梦刷新 ==========
                // 时间路径: world_state.time.day（参考 pkm-tavern-plugin.js）
                const currentDay = eraVars?.world_state?.time?.day;
                if (lastGameDay !== null && currentDay !== null && currentDay > lastGameDay) {
                    console.log('[PKM] 检测到日期变化，清除宝可梦刷新');
                    await eraDeletePokemonSpawns();
                }
                lastGameDay = currentDay;
                
                // ========== 为玩家周围区域生成宝可梦（只增不改）==========
                const newSpawns = await PokemonSpawnSystem.generateForNearbyGrids(
                    location.x, 
                    location.y, 
                    eraVars
                );
                if (newSpawns) {
                    await eraInsertPokemonSpawns(newSpawns);
                }
                
                // ========== 获取当前格子的宝可梦（从 ERA 读取）==========
                const currentPokemon = PokemonSpawnSystem.getCurrentGridPokemon(
                    location.x, 
                    location.y, 
                    eraVars
                );
                
                // 生成完整的位置上下文文本
                let contextText = LocationContextBackend.generateContextText(
                    location.x, 
                    location.y
                );
                
                // 添加当前格子的宝可梦信息
                if (currentPokemon && currentPokemon.length > 0) {
                    const pokemonLines = [
                        '',
                        '【附近宝可梦】'
                    ];
                    for (const poke of currentPokemon) {
                        const levelStr = poke.level ? `Lv.${poke.level}` : '';
                        const rarityStr = poke.rarity ? `(${poke.rarity})` : '';
                        pokemonLines.push(`  ${poke.id} ${levelStr} ${rarityStr}`);
                    }
                    // 在【周围环境】之前插入
                    const insertPoint = contextText.indexOf('【周围环境】');
                    if (insertPoint > 0) {
                        const beforeEnv = contextText.substring(0, insertPoint - 1);
                        const afterEnv = contextText.substring(insertPoint - 1);
                        contextText = beforeEnv + pokemonLines.join('\n') + '\n' + afterEnv;
                    } else {
                        contextText += '\n' + pokemonLines.join('\n');
                    }
                }
                
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
        
        // ========== iframe 初始化（预加载用隐藏 iframe）==========
        let hiddenIframeLoaded = false;
        let visibleIframeLoaded = false;
        
        // 预加载隐藏的 iframe（用于后台数据同步）
        hiddenIframe.attr('src', PKM_URL);
        hiddenIframe.on('load', async function() {
            hiddenIframeLoaded = true;
            console.log('[PKM] 隐藏 iframe 已加载（用于数据同步）');
            
            // 加载完成后立即发送 ERA 数据
            const eraData = await getEraVars();
            if (eraData && hiddenIframe[0].contentWindow) {
                hiddenIframe[0].contentWindow.postMessage({
                    type: 'PKM_ERA_DATA',
                    data: eraData
                }, '*');
                console.log('[PKM] ✓ ERA 数据已发送到隐藏 iframe');
            }
        });
        
        // ========== 事件绑定 ==========
        ball.on('click', async function() {
            console.log('[PKM] 打开面板');
            overlay.css('display', 'flex');
            
            // 首次打开时加载显示用的 iframe
            if (!visibleIframeLoaded) {
                iframe.attr('src', PKM_URL);
                iframe.on('load', async function() {
                    visibleIframeLoaded = true;
                    console.log('[PKM] 显示 iframe 已加载');
                    
                    const eraData = await getEraVars();
                    if (eraData && iframe[0].contentWindow) {
                        iframe[0].contentWindow.postMessage({
                            type: 'PKM_ERA_DATA',
                            data: eraData
                        }, '*');
                    }
                });
            } else {
                // 已加载，刷新数据
                refreshDashboard();
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
            console.log('[PKM] 刷新面板数据...');
            const eraData = await getEraVars();
            if (!eraData) return;
            
            const message = { type: 'PKM_REFRESH', data: eraData };
            
            // 发送到隐藏的 iframe（后台数据同步）
            if (hiddenIframeLoaded && hiddenIframe[0] && hiddenIframe[0].contentWindow) {
                try {
                    hiddenIframe[0].contentWindow.postMessage(message, '*');
                    console.log('[PKM] ✓ 已发送刷新数据到隐藏 iframe');
                } catch (e) {}
            }
            
            // 发送到显示的 iframe（如果已加载）
            if (visibleIframeLoaded && iframe[0] && iframe[0].contentWindow) {
                try {
                    iframe[0].contentWindow.postMessage(message, '*');
                    console.log('[PKM] ✓ 已发送刷新数据到显示 iframe');
                } catch (e) {}
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
        
        // ========== 卸载清理函数（退出角色卡时调用）==========
        function unloadPkmUI() {
            console.log('[PKM] UI 脚本开始卸载');
            
            // 移除 DOM 元素
            $('#pkm-container').remove();
            $('#pkm-anim-style').remove();
            $('[id^="pkm-"]').remove();
            
            // 清理事件监听
            if (typeof eventRemoveListener !== 'undefined') {
                try {
                    eventRemoveListener('era:writeDone');
                    eventRemoveListener('generation_ended');
                    eventRemoveListener('chat_changed');
                } catch (e) {
                    // 忽略清除失败
                }
            }
            
            // 清理全局变量
            delete window.pkmDashboard;
            
            // 移除 pagehide 监听器
            window.removeEventListener('pagehide', unloadPkmUI);
            
            console.log('[PKM] UI 脚本卸载完成');
        }
        
        // 监听 pagehide 事件（退出角色卡时触发）
        window.removeEventListener('pagehide', unloadPkmUI);
        window.addEventListener('pagehide', unloadPkmUI);
        
        // ========== 监听 iframe 的 postMessage 请求 ==========
        console.log('[PKM] ✓ 注册 postMessage 监听器');
        window.addEventListener('message', function(event) {
            // 调试：打印所有 PKM 相关消息
            if (event.data && event.data.type) {
                const type = event.data.type;
                if (type.startsWith('PKM_')) {
                    console.log('[PKM] 收到 postMessage:', type, JSON.stringify(event.data).slice(0, 200));
                }
            }
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
            
            // 处理 Leader 切换请求
            if (event.data.type === 'PKM_SET_LEADER') {
                const { targetSlot } = event.data.data || {};
                console.log('[PKM] 收到 Leader 切换请求:', targetSlot);
                handleLeaderToggle(targetSlot);
            }
            
            // 处理 Settings 更新请求
            if (event.data.type === 'PKM_UPDATE_SETTINGS') {
                const settingsData = event.data.data;
                console.log('[PKM] 收到 Settings 更新请求:', settingsData);
                handleSettingsToggle(settingsData);
            }
        });
        
        // ========== Leader 切换处理 ==========
        let leaderToggleLock = false;
        
        async function handleLeaderToggle(targetSlot) {
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
        
        // ========== Settings 切换处理 ==========
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
                const variableEditBlock = `<VariableEdit>\n${variableEditJson}\n</VariableEdit>`;
                
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
        
        // ========== 暴露全局函数到酒馆主窗口 ==========
        // 方案1: 使用酒馆助手的 initializeGlobal API
        if (typeof initializeGlobal === 'function') {
            initializeGlobal('pkmSetLeader', handleLeaderToggle);
            initializeGlobal('pkmUpdateSettings', handleSettingsToggle);
            console.log('[PKM] ✓ 已通过 initializeGlobal 暴露函数');
        }
        
        // 方案2: 直接在酒馆主窗口设置全局函数（同源情况下有效）
        try {
            const topWin = window.top || window.parent;
            if (topWin && topWin !== window) {
                topWin.pkmSetLeader = handleLeaderToggle;
                topWin.pkmUpdateSettings = handleSettingsToggle;
                console.log('[PKM] ✓ 已在酒馆主窗口设置 pkmSetLeader 和 pkmUpdateSettings');
                
                // 在酒馆主窗口注册 postMessage 监听器
                topWin.addEventListener('message', function(event) {
                    if (!event.data || !event.data.type) return;
                    
                    if (event.data.type === 'PKM_SET_LEADER') {
                        const { targetSlot } = event.data.data || {};
                        console.log('[PKM] 收到 Leader 切换请求 (top listener):', targetSlot);
                        handleLeaderToggle(targetSlot);
                    }
                    
                    if (event.data.type === 'PKM_UPDATE_SETTINGS') {
                        const settingsData = event.data.data;
                        console.log('[PKM] 收到 Settings 更新请求 (top listener):', settingsData);
                        handleSettingsToggle(settingsData);
                    }
                });
                console.log('[PKM] ✓ 已在酒馆主窗口注册 postMessage 监听器');
            }
        } catch (e) {
            console.warn('[PKM] 无法访问酒馆主窗口:', e.message);
        }
        
        // 方案3: 本地 window 也设置（作为降级）
        window.pkmSetLeader = handleLeaderToggle;
        window.pkmUpdateSettings = handleSettingsToggle;
        
        console.log('[PKM] ✓ 悬浮球已加载，点击打开 PKM 面板');
    });
})();
