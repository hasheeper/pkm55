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
        notif.innerHTML = `
            <div class="copy-notif-internal">
                <div class="copy-notif-icon" style="color:#ff7675;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div class="copy-notif-text">
                    <div class="copy-notif-title" style="color:#ff7675;">${messageTitle}</div>
                    <div class="copy-notif-desc">${messageBody}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2200);
    } else {
        alert(`${messageTitle}: ${messageBody}`);
    }
};

const getItemBadge = (slug) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;

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
   TRANSIT SYSTEM (交通系统)
   ============================================================ */
// 交通数据缓存
let transitData = {
    mapData: null,
    mapInfo: null,
    stations: [],    // 环线车站
    seaPorts: [],    // 港口码头
    airfields: [],   // 空运停机坪
    loaded: false
};

// 区域ID到简称的映射
const REGION_ID_MAP = {
    'Region_Zenith': 'Z',
    'Region_Neon': 'N',
    'Region_Bloom': 'B',
    'Region_Shadow': 'S',
    'Region_Apex': 'A'
};

// 交通设施ID规范化映射
const TRANSIT_ID_NORMALIZE = {
    'Summit_Dojo_POINT': 'Summit_Dojo_Point',
    'Northern_Cemetery': 'Northern_Cemetery_Pad',
    'Zenith_HQ': 'Zenith_HQ_Helipad'
};

// 坐标转换函数
function toDisplayCoords(gx, gy) {
    const MAP_CENTER_X = 26;
    const MAP_CENTER_Y = 26;
    let displayX = gx - MAP_CENTER_X;
    if (displayX >= 0) displayX += 1;
    let displayY = MAP_CENTER_Y - gy - 1;
    if (displayY >= 0) displayY += 1;
    return { x: displayX, y: displayY };
}

function toInternalCoords(displayX, displayY) {
    const MAP_CENTER_X = 26;
    const MAP_CENTER_Y = 26;
    let x = displayX;
    if (x > 0) x -= 1;
    let internalX = x + MAP_CENTER_X;
    let y = displayY;
    if (y > 0) y -= 1;
    let internalY = MAP_CENTER_Y - y - 1;
    return { gx: internalX, gy: internalY };
}

// 计算两点间的曼哈顿距离
function calcDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// 根据坐标获取区域（与 tavern-inject.js 保持一致）
function getRegionByCoords(x, y) {
    // Z区（中枢区）：中心 6x6 范围
    if (Math.abs(x) <= 6 && Math.abs(y) <= 6) return 'Z';
    // N区（霓虹区）：东南象限
    if (x > 0 && y < 0) return 'N';
    // B区（海滨区）：西南象限
    if (x < 0 && y < 0) return 'B';
    // S区（暗影区）：东北象限
    if (x > 0 && y > 0) return 'S';
    // A区（极诣区）：西北象限
    if (x < 0 && y > 0) return 'A';
    return 'Z';
}

// 加载交通数据
async function loadTransitData() {
    if (transitData.loaded) return true;
    
    try {
        const baseUrl = window.PKM_URL || './';
        const [mapDataRes, mapInfoRes] = await Promise.all([
            fetch(baseUrl + 'map/data/mapdata.json'),
            fetch(baseUrl + 'map/data/mapinfo.json')
        ]);
        
        if (mapDataRes.ok) {
            transitData.mapData = await mapDataRes.json();
        }
        if (mapInfoRes.ok) {
            transitData.mapInfo = await mapInfoRes.json();
        }
        
        if (transitData.mapData) {
            extractTransitEntities();
        }
        
        transitData.loaded = true;
        console.log('[TRANSIT] 交通数据加载完成');
        return true;
    } catch (e) {
        console.error('[TRANSIT] 加载失败:', e);
        return false;
    }
}

// 从 mapdata.json 提取交通实体和 PC_Terminal
function extractTransitEntities() {
    if (!transitData.mapData?.levels?.[0]) return;
    
    const levelData = transitData.mapData.levels[0];
    const gridSize = 16;
    
    transitData.stations = [];
    transitData.seaPorts = [];
    transitData.airfields = [];
    transitData.pcTerminals = []; // PC_Terminal 信号塔位置
    
    for (const layer of levelData.layerInstances || []) {
        if (layer.__type !== 'Entities') continue;
        
        for (const entity of layer.entityInstances || []) {
            const worldX = entity.__worldX || entity.px[0];
            const worldY = entity.__worldY || entity.px[1];
            const gx = Math.floor(worldX / gridSize);
            const gy = Math.floor(worldY / gridSize);
            const displayCoords = toDisplayCoords(gx, gy);
            
            let fieldValue = null;
            if (entity.fieldInstances?.[0]) {
                fieldValue = entity.fieldInstances[0].__value;
            }
            
            const item = {
                id: fieldValue,
                gx, gy,
                x: displayCoords.x,
                y: displayCoords.y,
                region: getRegionByCoords(displayCoords.x, displayCoords.y)
            };
            
            if (entity.__identifier === 'Transit_Station' && fieldValue) {
                transitData.stations.push(item);
            } else if (entity.__identifier === 'Sea_Route' && fieldValue) {
                transitData.seaPorts.push(item);
            } else if (entity.__identifier === 'Sky_Net' && fieldValue) {
                transitData.airfields.push(item);
            } else if (entity.__identifier === 'PC_Terminal') {
                // PC_Terminal 不需要 fieldValue，只需要位置
                transitData.pcTerminals.push({
                    gx, gy,
                    x: displayCoords.x,
                    y: displayCoords.y,
                    region: getRegionByCoords(displayCoords.x, displayCoords.y)
                });
            }
        }
    }
    
    console.log('[TRANSIT] 提取完成:', {
        stations: transitData.stations.length,
        seaPorts: transitData.seaPorts.length,
        airfields: transitData.airfields.length,
        pcTerminals: transitData.pcTerminals.length
    });
}

// PC_Terminal 信号覆盖半径（格子数）
const PC_SIGNAL_RADIUS = 3;

// 检查玩家是否在信号覆盖范围内
// 规则：Z区全覆盖 OR 在任意 PC_Terminal 的 3 格范围内
function isInSignalCoverage(playerX, playerY) {
    // Z区（中枢区）默认全覆盖
    const playerRegion = getRegionByCoords(playerX, playerY);
    if (playerRegion === 'Z') {
        return { covered: true, reason: 'ZENITH_FULL_COVERAGE' };
    }
    
    // 检查是否在任意 PC_Terminal 的信号范围内
    if (transitData.pcTerminals && transitData.pcTerminals.length > 0) {
        for (const terminal of transitData.pcTerminals) {
            const dist = calcDistance(playerX, playerY, terminal.x, terminal.y);
            if (dist <= PC_SIGNAL_RADIUS) {
                return { 
                    covered: true, 
                    reason: 'PC_TERMINAL_RANGE',
                    terminal: terminal,
                    distance: dist
                };
            }
        }
    }
    
    // 找到最近的 PC_Terminal
    let nearestDist = Infinity;
    let nearestTerminal = null;
    if (transitData.pcTerminals) {
        for (const terminal of transitData.pcTerminals) {
            const dist = calcDistance(playerX, playerY, terminal.x, terminal.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestTerminal = terminal;
            }
        }
    }
    
    return { 
        covered: false, 
        reason: 'OUT_OF_RANGE',
        nearestTerminal: nearestTerminal,
        nearestDistance: nearestDist
    };
}

// 获取交通设施描述
function getTransitDesc(id) {
    const normalizedId = TRANSIT_ID_NORMALIZE[id] || id;
    const infra = transitData.mapInfo?.transit_infrastructure || {};
    return infra[normalizedId]?.desc || '';
}

// 获取交通设施显示名称
function getTransitName(id) {
    const normalizedId = TRANSIT_ID_NORMALIZE[id] || id;
    return normalizedId.replace(/_/g, ' ');
}

/* --- TRANSIT 专用 SVG 图标 --- */
const TransitIcons = {
    loop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/></svg>`,
    air: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L2 9.27l6.91 1 1.74 6.73 3.63-3.64L22 2z"/></svg>`,
    sea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    here: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l0.71 0.71L12 18l6.79 3l0.71-0.71L12 2z"/></svg>`
};

// 渲染 TRANSIT 页面（Remastered UI）
async function renderTransitPage() {
    const transitPage = document.getElementById('pg-transit');
    if (!transitPage) return;
    
    if (!transitData.loaded) {
        transitPage.innerHTML = `<div class="transit-loading"><div class="transit-empty">Initializing Navigation System...</div></div>`;
        await loadTransitData();
    }
    
    const playerX = currentMapCoords?.x || 0;
    const playerY = currentMapCoords?.y || 0;
    const playerRegion = getRegionByCoords(playerX, playerY);
    
    const atStation = transitData.stations.find(s => s.x === playerX && s.y === playerY);
    const atSeaPort = transitData.seaPorts.find(s => s.x === playerX && s.y === playerY);
    const atAirfield = transitData.airfields.find(s => s.x === playerX && s.y === playerY);
    
    const sortByDistance = (list) => {
        return [...list].sort((a, b) => {
            const distA = calcDistance(playerX, playerY, a.x, a.y);
            return distA - calcDistance(playerX, playerY, b.x, b.y);
        });
    };
    
    const sortedStations = sortByDistance(transitData.stations);
    const sortedSeaPorts = sortByDistance(transitData.seaPorts);
    const sortedAirfields = sortByDistance(transitData.airfields);
    
    transitPage.innerHTML = `
        <div class="team-header-dash">
            <div class="th-title">TRANSIT LINK</div>
            <div class="th-status-grp">
                <div class="th-count">${playerRegion} <small>DISTRICT</small></div>
            </div>
        </div>
        
        <div class="transit-tabs">
            <div class="transit-tab active" data-tab="loop" onclick="switchTransitTab('loop')">
                <span>${TransitIcons.loop} LOOP-LINE</span>
            </div>
            <div class="transit-tab" data-tab="air" onclick="switchTransitTab('air')">
                <span>${TransitIcons.air} AIR-NET</span>
            </div>
            <div class="transit-tab" data-tab="sea" onclick="switchTransitTab('sea')">
                <span>${TransitIcons.sea} SEAPORT</span>
            </div>
        </div>
        
        <div class="transit-content">
            <div class="transit-panel" id="transit-loop" style="display:block;">
                ${renderTransitListV2(sortedStations, 'loop', playerRegion, atStation)}
            </div>
            <div class="transit-panel" id="transit-air" style="display:none;">
                ${renderTransitListV2(sortedAirfields, 'air', playerRegion, atAirfield)}
            </div>
            <div class="transit-panel" id="transit-sea" style="display:none;">
                ${renderTransitListV2(sortedSeaPorts, 'sea', playerRegion, atSeaPort)}
            </div>
        </div>
        <div style="height:40px;"></div>
    `;
}

function renderTransitListV2(list, type, playerRegion, atStation) {
    if (!list || list.length === 0) {
        return `<div class="transit-empty">NO CONNECTION SIGNAL FOUND</div>`;
    }
    
    const playerX = currentMapCoords?.x || 0;
    const playerY = currentMapCoords?.y || 0;
    const currentZone = list.filter(s => s.region === playerRegion);
    const otherZone = list.filter(s => s.region !== playerRegion);
    
    let html = '';
    
    if (currentZone.length > 0) {
        const zoneName = ZoneDB[playerRegion]?.name || playerRegion;
        html += `<div class="transit-section">
            <div class="transit-section-title curr">
                <span class="section-marker"></span> ${zoneName} / LOCAL
            </div>`;
        currentZone.forEach(station => {
            const gridDist = calcDistance(playerX, playerY, station.x, station.y);
            const distKm = gridDist * 0.4;
            const isHere = gridDist === 0;
            const canClick = !atStation || isHere;
            html += renderTransitItemV2(station, type, gridDist, distKm, isHere, canClick);
        });
        html += `</div>`;
    }
    
    if (otherZone.length > 0) {
        html += `<div class="transit-section">
            <div class="transit-section-title othe">
                <span class="section-marker"></span> EXTERNAL ZONES
            </div>`;
        otherZone.forEach(station => {
            const gridDist = calcDistance(playerX, playerY, station.x, station.y);
            const distKm = gridDist * 0.4;
            const canClick = !!atStation;
            html += renderTransitItemV2(station, type, gridDist, distKm, false, canClick);
        });
        html += `</div>`;
    }
    
    return html;
}

function renderTransitItemV2(station, type, gridDist, distKm, isHere, canClick) {
    const name = getTransitName(station.id);
    const regionInfo = ZoneDB[station.region] || { name: station.region, color: '#636e72' };
    const statusClass = isHere ? 'here' : (canClick ? 'available' : 'locked');
    const clickAttr = canClick ? `onclick="handleTransitClick('${station.id}', ${station.x}, ${station.y}, '${type}')"` : '';
    const bgIcon = TransitIcons[type] || '';
    let badgeHtml = '';
    
    if (isHere) {
        badgeHtml = `<div class="ti-status-badge ti-here-badge">${TransitIcons.here} <span>HERE</span></div>`;
    } else if (canClick) {
        const displayDist = distKm >= 10 ? distKm.toFixed(0) : distKm.toFixed(1);
        badgeHtml = `<div class="ti-status-badge ti-dist-badge"><span class="ti-dist-val">${displayDist}</span><span class="ti-dist-unit">KM</span></div>`;
    } else {
        badgeHtml = `<div class="ti-status-badge ti-lock-badge">${TransitIcons.lock}</div>`;
    }
    
    let accColor = '#dfe6e9';
    if (type === 'loop') accColor = '#00b894';
    if (type === 'air') accColor = '#0984e3';
    if (type === 'sea') accColor = '#6c5ce7';
    
    return `
    <div class="transit-item ${statusClass}" ${clickAttr} data-type="${type}" style="--acc-color:${accColor}">
        <div class="transit-back-deco">${bgIcon}</div>
        <div class="ti-left">
            <div class="ti-icon">${bgIcon}</div>
            <div class="ti-info">
                <div class="ti-name">${name}</div>
                <div class="ti-meta">
                    <span class="ti-region" style="color:${regionInfo.color}">:: Zone-${station.region}</span>
                    <span style="opacity:0.3">|</span>
                    <span>[${station.x}, ${station.y}]</span>
                </div>
            </div>
        </div>
        <div class="ti-right">
            ${badgeHtml}
        </div>
    </div>`;
}

// 切换 Tab
window.switchTransitTab = function(tab) {
    document.querySelectorAll('.transit-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.transit-panel').forEach(p => p.style.display = 'none');
    
    document.querySelector(`.transit-tab[data-tab="${tab}"]`)?.classList.add('active');
    document.getElementById(`transit-${tab}`).style.display = 'block';
};

// 处理站点点击
window.handleTransitClick = function(stationId, destX, destY, type) {
    const playerX = currentMapCoords?.x || 0;
    const playerY = currentMapCoords?.y || 0;
    
    // 检查是否在站点上
    const atStation = transitData.stations.find(s => s.x === playerX && s.y === playerY);
    const atSeaPort = transitData.seaPorts.find(s => s.x === playerX && s.y === playerY);
    const atAirfield = transitData.airfields.find(s => s.x === playerX && s.y === playerY);
    const isAtAnyStation = atStation || atSeaPort || atAirfield;
    
    const destRegion = getRegionByCoords(destX, destY);
    const playerRegion = getRegionByCoords(playerX, playerY);
    const stationName = getTransitName(stationId);
    
    // 生成 VariableEdit 更新坐标
    const variableEditData = {
        world_state: {
            location: {
                x: destX,
                y: destY,
                region: destRegion
            }
        }
    };
    // 确保 JSON 格式正确（包含最外层的 {}）
    const jsonStr = JSON.stringify(variableEditData, null, 2);
    const variableEditBlock = `<VariableEdit>\n${jsonStr}\n</VariableEdit>`;
    
    // 验证格式
    if (!jsonStr.startsWith('{') || !jsonStr.endsWith('}')) {
        console.error('[TRANSIT] VariableEdit JSON 格式错误:', jsonStr);
    }
    
    let promptText = '';
    
    // 判断是步行到站点还是搭乘交通工具
    if (destRegion === playerRegion) {
        // 同区域：步行前往站点
        promptText = `【前往站点】
从: 当前位置 [${playerX}, ${playerY}]
至: ${stationName} [${destX}, ${destY}]
方式: 步行
区域: ${ZoneDB[destRegion]?.name || destRegion}

玩家步行前往 ${stationName}。

${variableEditBlock}`;
    } else {
        // 跨区域：必须在站点上，搭乘交通工具
        if (!isAtAnyStation) {
            showCopyNotification('ACCESS DENIED', '必须在站点才能前往其他区域', false);
            return;
        }
        
        const typeName = type === 'loop' ? '环线列车' : type === 'air' ? '空运飞行' : '港口航线';
        const fromStation = getTransitName((atStation || atSeaPort || atAirfield).id);
        
        promptText = `【交通移动】
从: ${fromStation} [${playerX}, ${playerY}]
至: ${stationName} [${destX}, ${destY}]
方式: ${typeName}
区域: ${ZoneDB[playerRegion]?.name || playerRegion} → ${ZoneDB[destRegion]?.name || destRegion}

玩家搭乘${typeName}从 ${fromStation} 前往 ${stationName}。

${variableEditBlock}`;
    }

    // 复制到剪贴板（使用兼容 iframe 的方法）
    const actionType = destRegion === playerRegion ? '步行' : (type === 'loop' ? '环线' : type === 'air' ? '空运' : '海运');
    
    // 创建临时 textarea 元素
    const textarea = document.createElement('textarea');
    textarea.value = promptText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification('ROUTE COPIED', `${actionType} → ${stationName}`, true);
        } else {
            showCopyNotification('COPY FAILED', '无法复制到剪贴板', false);
        }
    } catch (err) {
        console.error('[TRANSIT] 复制失败:', err);
        showCopyNotification('COPY FAILED', '无法复制到剪贴板', false);
    } finally {
        document.body.removeChild(textarea);
    }
};

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
    
    let gridHtml = `<div id="social-grid-view">`;
    npcKeys.forEach(key => {
        gridHtml += createNPCCard(key, npcs[key]);
    });
    gridHtml += `</div>`;

    socialPage.innerHTML = `
        <div class="team-header-dash">
             <div class="th-title">RELATION NETWORK</div>
             <div class="th-status-grp">
                 <div class="th-count">${count} <small>CONNECTIONS</small></div>
             </div>
        </div>
        ${gridHtml}
    `;
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
        badgeHtml = `
            <div class="npc-bond-badge ${badgeState}" title="${bondInfo.label}${isUnlocked ? ' Active' : ' Locked'}">
                <img class="nb-icon-img"
                     src="${bondInfo.icon}"
                     alt="${bondInfo.label}"
                     loading="lazy"
                     onerror="this.style.display='none';">
                <span class="nb-bg"></span>
            </div>
        `;
    }

    return `
    <div class="npc-card ${isLocked ? 'locked' : ''}" data-stage="${stage}" style="--r-color:${meta.color}" title="${meta.desc}">
        <div class="npc-portrait">
            <img src="${portraitUrl}" loading="lazy" alt="${displayName}"
                 onerror="this.src='https://img.pokemondb.net/sprites/black-white/anim/normal/unown-i.gif'; this.style.opacity='0.25'"
                 style="${isLocked ? 'filter:grayscale(1) brightness(0.7);' : ''}">
        </div>
        ${badgeHtml}
        <div class="npc-info-shade">
            <div class="n-header">
                <span class="n-name">${displayName}</span>
                <span class="n-stage-icon">${isLocked ? '❓' : meta.icon}</span>
            </div>
            <div class="n-bar-box">
                <div class="n-bar-label">
                    <span style="color:${meta.color}">${displayLabel}</span>
                    <span>${displayLove}${isLocked ? '' : '<small style="opacity:0.5;font-weight:500;"> pts</small>'}</span>
                </div>
                <div class="progress-track" style="background:${meta.light}">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>
            </div>
        </div>
    </div>
    `;
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
    return `https://play.pokemonshowdown.com/sprites/trainers/${slug}.png`;
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

// ========== 监听来自酒馆的 postMessage ==========
window.addEventListener('message', function(event) {
    if (!event.data || !event.data.type) return;
    
    if (event.data.type === 'PKM_ERA_DATA') {
        console.log('[PKM] 收到 ERA 数据 (postMessage)');
        if (event.data.data && event.data.data.player) {
            db = event.data.data;
            window.eraData = db;
            console.log('[PKM] ✓ ERA 数据已更新', db.player?.name);
            
            // 先更新坐标，再渲染
            if (typeof updateCoordsFromEra === 'function') updateCoordsFromEra();
            
            // 刷新界面
            if (typeof renderDashboard === 'function') renderDashboard();
            if (typeof renderPartyList === 'function') renderPartyList();
            
            // 转发 ERA 数据到 map iframe
            forwardEraToMap(event.data);
        }
    } else if (event.data.type === 'PKM_REFRESH') {
        console.log('[PKM] 收到刷新请求 (postMessage)');
        if (event.data.data && event.data.data.player) {
            db = event.data.data;
            window.eraData = db;
            
            // 使用防抖避免频繁刷新导致卡顿
            handleRefreshDebounced(event.data);
        }
    }
});

// 防抖刷新处理
let refreshDebounceTimer = null;
function handleRefreshDebounced(eventData) {
    // 清除之前的定时器
    if (refreshDebounceTimer) {
        clearTimeout(refreshDebounceTimer);
    }
    
    // 延迟 100ms 执行，合并快速连续的刷新请求
    refreshDebounceTimer = setTimeout(() => {
        console.log('[PKM] 执行防抖刷新...');
        
        // 先更新坐标，再渲染
        if (typeof updateCoordsFromEra === 'function') updateCoordsFromEra();
        if (typeof ensureSettingsDefaults === 'function') ensureSettingsDefaults();
        
        // 刷新所有界面
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderPartyList === 'function') renderPartyList();
        if (typeof renderSocialList === 'function') renderSocialList();
        if (typeof renderSettings === 'function') renderSettings();
        if (typeof renderBoxPage === 'function') renderBoxPage();
        if (typeof updateClock === 'function') updateClock();
        
        // 转发 ERA 数据到 map iframe
        forwardEraToMap(eventData);
        
        refreshDebounceTimer = null;
    }, 100);
}

// 转发 ERA 数据到 map iframe
function forwardEraToMap(message) {
    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
        try {
            mapIframe.contentWindow.postMessage(message, '*');
            console.log('[PKM] ✓ 已转发 ERA 数据到 map iframe');
        } catch (e) {
            // map iframe 可能未加载
        }
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
    
    // 先从 ERA 更新坐标（在渲染前）
    updateCoordsFromEra();

    // 初始化悬浮状态栏
    initStickyStatusBar();

    // 然后渲染 UI
    renderDashboard();
    renderPartyList();
    renderSocialList();
    renderSettings();
    renderBoxPage();
    
    // 注意：PKM_REFRESH 消息监听已在全局 message 事件处理器中处理（第 703 行）
    // 不要在这里重复绑定，否则会导致多次渲染和卡顿
}

// 从 ERA 数据更新坐标显示
function updateCoordsFromEra() {
    if (db && db.world_state && db.world_state.location) {
        const loc = db.world_state.location;
        if (typeof loc.x === 'number' && typeof loc.y === 'number') {
            currentMapCoords = {
                x: loc.x,
                y: loc.y
            };
            updateCoordsDisplay(currentMapCoords);
            console.log('[PKM] 从 ERA 更新坐标:', currentMapCoords);
        }
    }
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
    // 计算信号强度
    const playerX = db?.world_state?.location?.x || 0;
    const playerY = db?.world_state?.location?.y || 0;
    const signalStatus = isInSignalCoverage(playerX, playerY);
    let signalBars = 1; // 默认1格
    if (signalStatus.covered) {
        if (signalStatus.reason === 'ZENITH_FULL_COVERAGE') {
            signalBars = 4; // Z区满格
        } else {
            signalBars = 4; // PC终端范围内也满格
        }
    }
    
    const signalBarsHTML = Array.from({length: 4}, (_, i) => 
        `<div class="n-bar ${i < signalBars ? 'active' : ''}"></div>`
    ).join('');
    
    bar.innerHTML = `
        <div class="ps-left">
            <div class="net-group">
                <div class="net-signal">
                    ${signalBarsHTML}
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
    `;

    frame.insertAdjacentElement('afterbegin', bar);

    updateClock();
    if (statusClockTimer) clearInterval(statusClockTimer);
    statusClockTimer = setInterval(updateClock, 60 * 1000);
}

const PERIOD_LABELS_EN = {
    '黎明': 'Dawn',
    '早晨': 'Morning',
    '正午': 'Noon',
    '下午': 'Afternoon',
    '傍晚': 'Evening',
    '夜晚': 'Night',
    '午夜': 'Midnight',
    dawn: 'Dawn',
    morning: 'Morning',
    noon: 'Noon',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    midnight: 'Midnight'
};

function getEnglishPeriodLabel(period) {
    if (!period) return 'Unknown';
    if (PERIOD_LABELS_EN[period]) return PERIOD_LABELS_EN[period];
    const lower = typeof period === 'string' ? period.toLowerCase() : '';
    return PERIOD_LABELS_EN[lower] || period;
}

function updateClock() {
    const clockEl = document.getElementById('sys-clock');
    if (!clockEl) return;

    // 使用 ERA 游戏时间而非现实时间
    const timeData = db?.world_state?.time;
    if (timeData && timeData.period) {
        const dayNum = timeData.derived?.dayOfYear || 1;
        const periodLabel = getEnglishPeriodLabel(timeData.period);
        clockEl.textContent = `DAY${dayNum}-${periodLabel}`;
    } else {
        clockEl.textContent = 'DAY1-Morning';
    }
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
        dotsHtml += `<div class="th-dot ${isActive}"></div>`;
    }

    const headerHtml = `
    <div class="team-header-dash">
        <div class="th-title">DEPLOYED UNIT</div>
        <div class="th-status-grp">
            <div class="th-slots-viz">${dotsHtml}</div>
            <div class="th-count">0${activeCount} <small>/ 0${maxSlots}</small></div>
        </div>
    </div>`;

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
        mainEl.innerHTML = `<div id="pg-party" class="page curr">${headerHtml + cardsHTML}</div>
            <div id="pg-social" class="page"></div>
            <div id="pg-settings" class="page"></div>`;
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

    const headerHtml = `
    <div class="team-header-dash">
        <div class="th-title">SYSTEM KERNEL</div>
        <div class="th-status-grp">
            <div class="th-count">${activeCount} <small>MODULES ACTIVE</small></div>
        </div>
    </div>`;

    let contentHtml = `<div class="config-grid">`;

    SettingsManifest.forEach(item => {
        const isActive = db?.settings?.[item.key] === true;
        contentHtml += `
            <div class="cfg-card ${isActive ? 'active' : ''}" 
                 style="--cfg-color:${item.color}" 
                 onclick="toggleGlobalSetting('${item.key}')">
               
                <div class="cfg-info">
                    <span class="cfg-label">${item.label}</span>
                    <span class="cfg-desc">${item.desc}</span>
                </div>
              
                <div class="tgl-track ${isActive ? 'active' : ''}">
                    <div class="tgl-thumb"></div>
                </div>
            </div>
        `;
    });

    contentHtml += `</div>`;

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
        return `
        <div class="dash-card-box empty">
            <div class="dcb-inner">
                <span class="empty-placeholder">SLOT ${slotNum} OPEN</span>
            </div>
        </div>
        `;
    }

    const isLead = pkm.isLead === true;
    const slotDisplay = ("0" + pkm.slot).slice(-2);
    // 优先使用 species，如果为空则使用 name
    const speciesName = pkm.species || pkm.name;
    
    // [超级回退方案] Chain: [朱紫] --> (404?) --> [剑盾] --> (404?) --> [像素]
    const rawSlug = String(speciesName).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const spriteSlug = (typeof buildSpriteSlug === 'function' ? buildSpriteSlug(speciesName) : rawSlug) || rawSlug;
    const showdownSlug = spriteSlug.replace(/[^a-z0-9-]/g, '');
    const hasRegionalSuffix = /-(hisui|alola|galar|paldea)$/.test(showdownSlug);
    const slugPixel = hasRegionalSuffix ? showdownSlug : showdownSlug.replace(/-/g, '');

    let url_sv   = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${spriteSlug}.png`;
    let url_swsh = `https://img.pokemondb.net/sprites/sword-shield/normal/${spriteSlug}.png`;
    let url_px   = `https://play.pokemonshowdown.com/sprites/gen5/${slugPixel}.png`;

    let regionalClass = '';
    if (/-hisui$/.test(showdownSlug)) {
        url_sv = `https://play.pokemonshowdown.com/sprites/gen5/${showdownSlug}.png`;
        url_swsh = `https://play.pokemonshowdown.com/sprites/ani/${showdownSlug}.gif`;
        url_px = `https://play.pokemonshowdown.com/sprites/gen5/${showdownSlug}.png`;
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
        genderHtml = `<span class="gender-mark male">♂</span>`;
    } else if (genderKey === 'F') {
        genderHtml = `<span class="gender-mark female">♀</span>`;
    } else {
        genderHtml = `<span class="gender-mark neutral">∅</span>`;
    }

    const shinyBadge = pkm.shiny ? '<span class="shiny-mark">✨</span>' : '';

    const boxClass = isLead ? "dash-card-box is-leader" : "dash-card-box";
    const leaderBadgeHtml = isLead
        ? `<div class="lead-tag"><span class="lead-text">LEAD</span></div>`
        : '';
    const actionClass = isLead ? "leader-action active" : "leader-action";
    const actionTitle = isLead ? "Current Point Pokemon" : "Set to Leader";
    const clickHandler = isLead ? '' : `onclick="toggleLeader(event, '${slotIdStr}')"`;
    const leaderBtnHtml = `
        <div class="${actionClass}" ${clickHandler} title="${actionTitle}">
            <svg viewBox="0 0 24 24">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
        </div>
    `;

    const typeChips = theme.types.map(t =>
        `<div class="type-mini" style="background:${getTypeColor(t)}"><span>${t.toUpperCase()}</span></div>`
    ).join('');

    const moveOrder = ['move1', 'move2', 'move3', 'move4'];
    const movesHtml = moveOrder.map(key => {
        const moveName = pkm?.moves?.[key];
        if (moveName) {
            return `<div class="k-move-shell"><span>${moveName}</span></div>`;
        }
        return `<div class="k-move-shell empty"><span>—</span></div>`;
    }).join('');

    const statMap = { 'hp': 'H', 'atk': 'A', 'def': 'B', 'spa': 'C', 'spd': 'D', 'spe': 'S' };
    let ivsHtml = '';

    if (pkm.stats_meta && pkm.stats_meta.ivs) {
        Object.keys(statMap).forEach(key => {
            const val = pkm.stats_meta.ivs[key] || 0;
            const isMax = val === 31;
            ivsHtml += `<div class="chip-cell ${isMax ? 'max' : ''}" data-stat="${statMap[key]}">${val}</div>`;
        });
    }

    const itemHtml = pkm.item ? 
        `<div class="item-box" data-name="${pkm.item}">
            <img src="${itemUrl}" 
                 alt="${pkm.item}"
                 onerror="if(!this.dataset.triedPS){this.dataset.triedPS=true;this.src='${itemUrlPS}';}else{this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';}" 
            />
          </div>` : '';
    const avsDashboardHtml = `
        <div class="avs-dashboard" id="avs-panel-${slotIdStr}" onclick="event.stopPropagation()">
            <div class="avs-stat-item asi-stat-trust">
                <span class="asi-label">TRUST</span>
                <span class="asi-val ${maxCheck(avsData.trust)}">${avsData.trust}</span>
            </div>
            <div class="avs-stat-item asi-stat-passion">
                <span class="asi-label">PASSION</span>
                <span class="asi-val ${maxCheck(avsData.passion)}">${avsData.passion}</span>
            </div>
            <div class="avs-stat-item asi-stat-insight">
                <span class="asi-label">INSIGHT</span>
                <span class="asi-val ${maxCheck(avsData.insight)}">${avsData.insight}</span>
            </div>
            <div class="avs-stat-item asi-stat-devotion">
                <span class="asi-label">DEVOTION</span>
                <span class="asi-val ${maxCheck(avsData.devotion)}">${avsData.devotion}</span>
            </div>
        </div>
    `;

    return `
    <div class="${boxClass}" 
         data-slot="${slotDisplay}" 
         onclick="toggleCard(this)" 
         style="--prim-color: ${theme.p}; --sec-color: ${theme.s}; cursor: pointer;">
        <div class="dcb-inner card-layout">
            <div class="pkm-summary" data-slot="${slotDisplay}">
                ${avsDashboardHtml}
                <div class="p-visual-grp">
                    <div class="p-avatar">
                        <img src="${url_sv}" 
                             loading="lazy" 
                             alt="${pkm.species}"
                             class="${regionalClass}"
                             onerror="
                                 if (!this.dataset.triedSwsh) {
                                     this.dataset.triedSwsh = true; 
                                     this.src = '${url_swsh}';
                                 } else {
                                     this.onerror = null; 
                                     this.src = '${url_px}'; 
                                     this.className = 'pixel-fallback';
                                 }
                             "
                             style="transition: 0.2s;">
                    </div>
                    <div class="p-texts">
                        <div class="p-meta-line">
                            <span>NO.${slotDisplay}</span>
                            <span>Lv.<b class="p-lv-val">${pkm.lv}</b></span>
                            ${shinyBadge}
                            ${leaderBadgeHtml}
                        </div>
                        <div class="p-name">${displayName}${genderHtml}</div>
                    </div>
                </div>
                <div class="summary-actions">
                    ${leaderBtnHtml}
                    <div class="avs-action" onclick="toggleAVS(event, '${slotIdStr}')" title="Affinity Gauge">
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
                                ${typeChips}
                            </div>
                            <div class="meta-chips">
                                <div class="m-tag nature"><span>${pkm.nature}</span></div>
                                <div class="m-tag ability"><span>${pkm.ability}</span></div>
                            </div>
                            ${itemHtml}
                        </div>
                        <div class="kinetic-moves">
                            ${movesHtml}
                        </div>
                        <div class="bot-stat-strip">
                            <div class="ivs-group">
                                <span class="micro-lbl">IVs</span>
                                <div class="hex-chips">
                                    ${ivsHtml}
                                </div>
                            </div>
                            <div class="evs-group">
                                <span class="micro-lbl">TOTAL EVs</span>
                                <span class="evs-val">${pkm.stats_meta ? pkm.stats_meta.ev_level : 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
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

    const target = document.getElementById(`pg-${targetId}`);
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

    const target = document.getElementById(`pg-${pageId}`);
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
    const panel = document.getElementById(`avs-panel-${slotKey}`);
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
    isLocked: false,         // 信号锁定状态
    signalStatus: null       // 信号覆盖状态详情
};

function buildGenderMark(gender) {
    const genderKey = (gender || '').toUpperCase();
    if (genderKey === 'M') return '<span class="gender-mark male">♂</span>';
    if (genderKey === 'F') return '<span class="gender-mark female">♀</span>';
    return '<span class="gender-mark neutral">∅</span>';
}

/* --- 1. [核心] 渲染 BOX 页面 --- */
async function renderBoxPage() {
    console.log('[BOX] renderBoxPage 被调用');
    const boxPage = document.getElementById('pg-box');
    if (!boxPage) {
        console.error('[BOX] pg-box 元素不存在');
        return;
    }
    console.log('[BOX] db.player.box =', db?.player?.box);
    
    // 确保交通数据已加载（包含 PC_Terminal 位置）
    if (!transitData.loaded) {
        await loadTransitData();
    }

    // A. 信号覆盖判定（基于 PC_Terminal 信号塔）
    // 规则：Z区全覆盖 OR 在任意 PC_Terminal 的 3 格范围内
    const locData = db?.world_state?.location;
    const playerX = locData?.x ?? 0;
    const playerY = locData?.y ?? 0;
    const currentRegion = getRegionByCoords(playerX, playerY);
    const zoneName = ZoneDB[currentRegion]?.label || 'Unknown Zone';
    
    // 检查信号覆盖
    boxState.signalStatus = isInSignalCoverage(playerX, playerY);
    boxState.isLocked = !boxState.signalStatus.covered;
    
    console.log('[BOX] 信号状态:', boxState.signalStatus);
    
    // 添加/移除 locked class
    if (boxState.isLocked) {
        boxPage.classList.add('locked');
    } else {
        boxPage.classList.remove('locked');
    }

    // B. 初始化 HTML 框架
    let html = `
        <div class="box-header-strip storage-green">
            <span class="box-header-title">CURRENT PARTY (HAND)</span>
        </div>
    `;

    // 队伍区域
    const partyData = db.player.party;
    html += `<div class="box-party-grid">`;
    for (let i = 1; i <= 6; i++) {
        const slotKey = `slot${i}`;
        const pkm = partyData[slotKey];
        html += renderBoxPartyCard(pkm, i - 1);
    }
    html += `</div>`;

    // 盒子区域头
    html += `
        <div class="box-header-strip storage-green">
            <span class="box-header-title">CLOUD STORAGE (SERVER)</span>
        </div>
    `;

    // 盒子容器
    html += `<div class="box-storage-area"><div class="box-storage-matrix">`;
  
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
    html += `</div></div>`;

    // C. 信号丢失覆盖层
    if (boxState.isLocked) {
        const status = boxState.signalStatus;
        const nearestDist = status.nearestDistance !== Infinity 
            ? (status.nearestDistance * 0.4).toFixed(1) 
            : '???';
        const nearestCoords = status.nearestTerminal 
            ? `[${status.nearestTerminal.x}, ${status.nearestTerminal.y}]` 
            : '[N/A]';

        html += `
        <div class="box-offline-overlay">
            <div class="boo-bg-deco">SIGNAL LOST</div>
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
                <span class="boo-code">/// 0x0000_OUT_OF_RANGE ///</span>
                <div class="boo-alert-box">
                    <div class="boo-main-reason">Box-Link 信号塔超出覆盖范围</div>
                    <div class="boo-hint">
                        当前位置 [${playerX}, ${playerY}] 不在任何 PC_Terminal 信号范围内<br>
                        最近信号塔: ${nearestCoords} (${nearestDist} km)<br>
                        信号覆盖半径: ${PC_SIGNAL_RADIUS * 0.4} km
                    </div>
                </div>
            </div>
            <div class="boo-terminal">
                <span>> Scanning for Box-Link terminals... [${transitData.pcTerminals?.length || 0}] found.</span>
                <span>> Nearest signal: ${nearestDist} km away. Required: ≤${PC_SIGNAL_RADIUS * 0.4} km.</span>
                <span>> Connection failed: ERR_SIGNAL_WEAK</span>
            </div>
        </div>`;
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
    const rawSlug = String(name).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const spriteSlug = (typeof buildSpriteSlug === 'function' ? buildSpriteSlug(name) : rawSlug) || rawSlug;
    const showdownSlug = spriteSlug.replace(/[^a-z0-9-]/g, '');
    const showdownMenuSlug = showdownSlug.replace(/-/g, '');
    const cacheKey = spriteSlug || showdownMenuSlug;
    
    const hasRegionalSuffix = /-(hisui|alola|galar|paldea)$/.test(spriteSlug);
    const regionalIconClass = hasRegionalSuffix ? 'regional-icon' : '';
    const finalClass = [cssClass, regionalIconClass].filter(Boolean).join(' ');

    let src1 = `https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/${spriteSlug}.png`;
    let src2 = `https://play.pokemonshowdown.com/sprites/gen5/${showdownSlug}.png`;
    let src3 = `https://play.pokemonshowdown.com/sprites/menu/${showdownMenuSlug}.png`;
    const src4 = `https://img.pokemondb.net/sprites/black-white/anim/normal/unown-q.gif`;

    if (spriteSlug === 'zorua-hisui') {
        src1 = `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/zorua-hisui.png`;
        src2 = `https://play.pokemonshowdown.com/sprites/gen5/zorua-hisui.png`;
        src3 = `https://play.pokemonshowdown.com/sprites/menu/zoruahisui.png`;
    }

    if (window._pkmIconVerifyCache[cacheKey]) {
        return `<img src="${window._pkmIconVerifyCache[cacheKey]}" class="${finalClass}" loading="lazy">`;
    }

    return `<img src="${src1}" loading="lazy" class="${finalClass}"
        onload="window._pkmIconVerifyCache['${cacheKey}'] = this.src"
        onerror="
            if(!this.dataset.step){ 
                this.dataset.step = 1; 
                this.src='${src2}'; 
            } else if(this.dataset.step == 1){
                this.dataset.step = 2;
                this.src='${src3}';
            } else {
                this.onerror = null;
                this.style.opacity = 0.5;
                this.src='${src4}';
            }
        ">`;
}

function renderBoxPartyCard(pkm, idx) {
    const isSelected = boxState.selectedPartIdxs.includes(idx);
    const isEmpty = (!pkm || !pkm.name);

    if (isEmpty) {
        return `
        <div class="box-char-card empty ${isSelected ? 'selected' : ''}" 
             onclick="handlePartyClick(${idx})">
            <div class="bcc-inner">
                <span class="bcc-name">EMPTY SLOT</span>
            </div>
        </div>`;
    }

    const imgHtml = generateSmartIconHex(pkm.name);

    const theme = getThemeColors(pkm.name); 
    const genderHtml = buildGenderMark(pkm.gender);

    return `
    <div class="box-char-card ${isSelected ? 'selected' : ''}" onclick="handlePartyClick(${idx})">
        <div class="bcc-inner">
            <div class="bcc-icon">${imgHtml}</div>
            <div class="bcc-info">
                <div class="bcc-name">${pkm.nickname || pkm.name}</div>
                <div class="bcc-lv">Lv.${pkm.lv} ${genderHtml}</div>
            </div>
            <div class="bcc-type" style="background:${theme.p}"></div>
        </div>
    </div>`;
}

function renderStorageCell(pkm, key, cellIndex) {
    const isSelected = key 
        ? boxState.selectedBoxKeys.includes(key) 
        : boxState.selectedEmptyIdxs.includes(cellIndex);

    if (!pkm) {
        return `<div class="storage-cell empty ${isSelected ? 'selected' : ''}" onclick="handleEmptyBoxClick(${cellIndex})"></div>`;
    }

    const imgHtml = generateSmartIconHex(pkm.name, "sc-img");

    return `
    <div class="storage-cell ${isSelected ? 'selected' : ''}" onclick="handleBoxClick('${key}')">
        ${imgHtml}
        <span class="sc-lv">L.${pkm.lv}</span>
        ${pkm.shiny ? '<span class="sc-shiny">★</span>' : ''}
    </div>`;
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
        const pkm = db.player.party[`slot${idx+1}`];
        return pkm?.name || null;
    });
    const filledPartyCount = partyNames.filter(n => n !== null).length;
    const emptyPartyCount = partyNames.filter(n => n === null).length;

    // 获取选中的盒子名称列表
    const boxNames = bKeys.map(key => db.player.box[key]?.name || "Unknown");

    let htmlInner = "";
    const prefixStyle = `style="color: #636e72; font-weight:900; margin-right:6px; opacity:0.8"`;
    const countStyle = `style="color: #0984e3; font-weight:900;"`;

    // 判断操作类型和合法性
    const hasParty = pIdxs.length > 0;
    const hasBoxPkm = bKeys.length > 0;
    const hasEmptyBox = emptyIdxs.length > 0;

    if (hasParty && hasEmptyBox && filledPartyCount > 0) {
        // [批量存入] 队伍数量必须等于空位数量
        if (filledPartyCount === emptyIdxs.length) {
            const namesStr = partyNames.filter(n => n).join(', ');
            htmlInner = `<span ${prefixStyle}>CMD: BATCH STORE</span> <span ${countStyle}>[${filledPartyCount}]</span> <span class="ops-highlight">${namesStr}</span> <span style="color:#b2bec3; margin:0 5px;">»</span> SERVER`;
        } else {
            htmlInner = `<span ${prefixStyle}>ERR:</span> <span style="color:#e74c3c;">队伍选中 ${filledPartyCount} 个，空位选中 ${emptyIdxs.length} 个，数量不匹配</span>`;
        }
    } else if (hasParty && hasBoxPkm) {
        // [批量交换/取出] 队伍数量必须等于盒子数量
        if (pIdxs.length === bKeys.length) {
            if (filledPartyCount === pIdxs.length) {
                // 全是有宝可梦的槽位 = 批量交换
                const pNamesStr = partyNames.join(', ');
                const bNamesStr = boxNames.join(', ');
                htmlInner = `<span ${prefixStyle}>CMD: BATCH SWAP</span> <span ${countStyle}>[${pIdxs.length}]</span> <span class="ops-highlight">${pNamesStr}</span> <span style="color:#00cec9; margin:0 2px;">⇄</span> <span class="ops-highlight">${bNamesStr}</span>`;
            } else if (emptyPartyCount === pIdxs.length) {
                // 全是空槽位 = 批量取出
                const bNamesStr = boxNames.join(', ');
                htmlInner = `<span ${prefixStyle}>CMD: BATCH RETRIEVE</span> <span ${countStyle}>[${bKeys.length}]</span> SERVER <span style="color:#b2bec3; margin:0 5px;">»</span> <span class="ops-highlight">${bNamesStr}</span>`;
            } else {
                // 混合情况 = 批量操作（部分交换部分取出）
                htmlInner = `<span ${prefixStyle}>CMD: BATCH TRANSFER</span> <span ${countStyle}>[${pIdxs.length}]</span> <span class="ops-highlight">混合操作</span>`;
            }
        } else {
            htmlInner = `<span ${prefixStyle}>ERR:</span> <span style="color:#e74c3c;">队伍选中 ${pIdxs.length} 个，盒子选中 ${bKeys.length} 个，数量不匹配</span>`;
        }
    } else if (hasParty) {
        // 等待选择盒子
        const namesStr = partyNames.map((n, i) => n || `SLOT${pIdxs[i]+1}(空)`).join(', ');
        htmlInner = `<span ${prefixStyle}>STATUS:</span> TARGETING <span ${countStyle}>[${pIdxs.length}]</span> <span class="ops-highlight">${namesStr}</span> <span style="color:#b2bec3">...SELECT BOX</span>`;
    } else if (hasBoxPkm) {
        // 等待选择队伍
        const namesStr = boxNames.join(', ');
        htmlInner = `<span ${prefixStyle}>STATUS:</span> TARGETING <span ${countStyle}>[${bKeys.length}]</span> <span class="ops-highlight">${namesStr}</span> <span style="color:#b2bec3">...SELECT SLOT</span>`;
    } else if (hasEmptyBox) {
        // 只选了空位，等待选择队伍
        htmlInner = `<span ${prefixStyle}>STATUS:</span> SELECTED <span ${countStyle}>[${emptyIdxs.length}]</span> EMPTY CELLS <span style="color:#b2bec3">...SELECT PARTY</span>`;
    }

    bar.innerHTML = `
        <div class="ops-text-row">
            <div class="ops-log">
                ${htmlInner}
            </div>
        </div>
        <div class="ops-action-row">
            <button class="btn-ops-cancel" onclick="resetBoxSelection()">RESET</button>
            <button class="btn-ops-confirm" onclick="confirmBoxTransfer()">EXECUTE</button>
        </div>
    `;
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
        const slotKey = `slot${idx+1}`;
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
            alert(`数量不匹配：队伍选中 ${filledPartyInfos.length} 个宝可梦，空位选中 ${emptyIdxs.length} 个。`);
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
            const newBoxKey = `storage_${String(nextId++).padStart(2, '0')}`;
            const newBoxObj = normalizeToBoxFormat(JSON.parse(JSON.stringify(pInfo.obj)));
            boxInserts[newBoxKey] = newBoxObj;
            partyEdits[pInfo.slotKey] = createEmptySlot(pInfo.idx + 1);
            uploadList.push(pInfo.name);
        });

        actionLog = `
[系统指令：粉红网络连接协议 - 批量存入成功]
> 操作：传输通道 [${zoneName}] 已建立。
> 上行 (Upload): ${uploadList.join(', ')} >>> 云端服务器存储。
> 变量已更新，无需重复发送。
> 已清空 ${filledPartyInfos.length} 个队伍槽位。

<VariableInsert>
${JSON.stringify({ player: { box: boxInserts } }, null, 2)}
</VariableInsert>

<VariableEdit>
${JSON.stringify({ player: { party: partyEdits } }, null, 2)}
</VariableEdit>

[演绎要求]
${uploadList.join('、')} 已被传送至索妮亚研究所的云端存储系统。请简短描写多道传输光束同时闪烁、宝可梦们化为数据流消失的画面，以及 ${playerName} 的反应。
`.trim();
    }
    // ========== [批量取出模式] 盒子 -> 队伍空槽 ==========
    else if (hasBoxPkm && emptyPartyInfos.length === pIdxs.length) {
        if (pIdxs.length !== bKeys.length) {
            alert(`数量不匹配：队伍空槽选中 ${pIdxs.length} 个，盒子选中 ${bKeys.length} 个。`);
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

        actionLog = `
[系统指令：粉红网络连接协议 - 批量取出成功]
> 操作：传输通道 [${zoneName}] 已建立。
> 下行 (Download): ${downloadList.join(', ')} <<< 云端服务器。
> 变量已更新，无需重复发送。
> 已加入 ${bKeys.length} 个队伍槽位。

<VariableEdit>
${JSON.stringify({ player: { party: partyEdits } }, null, 2)}
</VariableEdit>

<VariableDelete>
${JSON.stringify({ player: { box: boxDeletes } }, null, 2)}
</VariableDelete>

[演绎要求]
${downloadList.join('、')} 已从云端传送回来！请简短描写多道传输光束同时闪烁、宝可梦们从数据流中具现化的画面，以及它们对 ${playerName} 的反应。
`.trim();
    }
    // ========== [批量交换模式] 队伍 <-> 盒子 ==========
    else if (hasBoxPkm && filledPartyInfos.length > 0) {
        if (pIdxs.length !== bKeys.length) {
            alert(`数量不匹配：队伍选中 ${pIdxs.length} 个，盒子选中 ${bKeys.length} 个。`);
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

        let variableBlocks = `<VariableEdit>
${JSON.stringify({ player: { party: partyEdits, box: boxEditsFinal } }, null, 2)}
</VariableEdit>`;

        if (Object.keys(boxDeletes).length > 0) {
            variableBlocks += `

<VariableDelete>
${JSON.stringify({ player: { box: boxDeletes } }, null, 2)}
</VariableDelete>`;
        }

        const opDesc = uploadList.length > 0 
            ? `> 上行 (Upload): ${uploadList.join(', ')} >>> 云端服务器。\n> 下行 (Download): ${downloadList.join(', ')} <<< 云端服务器。`
            : `> 下行 (Download): ${downloadList.join(', ')} <<< 云端服务器。`;

        actionLog = `
[系统指令：粉红网络连接协议 - 批量传输成功]
> 操作：传输通道 [${zoneName}] 已建立。
> 变量已更新，无需重复发送。
${opDesc}

${variableBlocks}

[演绎要求]
${uploadList.length > 0 ? `${uploadList.join('、')} 与 ${downloadList.join('、')} 完成了交换传输！` : `${downloadList.join('、')} 已从云端传送回来！`}请简短描写多道光束交错的画面，宝可梦们出现后对 ${playerName} 的反应，以及 ${playerName} 与新伙伴们的互动。
`.trim();
    }
    else {
        alert("无效的操作组合。");
        return;
    }

    console.log("[BOX] 生成的指令:\n" + actionLog);
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
    notification.innerHTML = `
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
    `;
  
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
    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    news: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>`,
    gig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    transit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><path d="M9 20l-1.5 2.5"></path><path d="M15 20l1.5 2.5"></path></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    mart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    unite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>` 
};

function renderDashboard() {
    const dashPage = document.getElementById('pg-dashboard');
    if (!dashPage) return;

    const player = db?.player || {};
    const world = db?.world_state || {};
    const playerName = player.name || 'TRAINER';
    // location 可能是对象 {x, y} 或字符串
    const locData = world.location;
    const currLocCode = (typeof locData === 'string' 
        ? locData 
        : (locData?.x !== undefined && locData?.y !== undefined 
            ? getQuadrantFromCoords(locData.x, locData.y) 
            : 'Z')
    ).toUpperCase();
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
            const shotx = mon.shotx || `https://img.pokemondb.net/sprites/scarlet-violet/icon/${mon.name.toLowerCase()}.png`;
            rosterHTML += `
                <div class="roster-slot">
                    <img class="pk-icon" src="${shotx}" alt="${mon.name}">
                </div>
            `;
        } else {
            rosterHTML += `
                <div class="roster-slot">
                    <span class="empty-dot"></span>
                </div>
            `;
        }
    });
    
    const activeStr = activePartyCount < 10 ? `0${activePartyCount}` : `${activePartyCount}`;
    const SVG_POKEBALL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><path d="M50,35c7.244,0,13.304,5.161,14.698,12h19.163C82.341,29.628,67.766,16,50,16S17.659,29.628,16.139,47h19.163    C36.696,40.161,42.756,35,50,35z"/><path d="M50,65c-7.244,0-13.304-5.161-14.698-12H16.139C17.659,70.371,32.234,84,50,84s32.341-13.629,33.861-31H64.698    C63.304,59.839,57.244,65,50,65z"/><circle cx="50" cy="50" r="9"/></svg>`;

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
        return `<div class="cell ${isActive ? 'active' : ''}" data-mech="${mech.code}" data-name="${mech.label}">${getSvgIcon(mech.code)}</div>`;
    }).join('');

    dashPage.innerHTML = `
        <div class="p-hero-dash">
            <div class="hero-main">
                <div class="hero-welcome">SYSTEM READY.</div>
                <div class="hero-name">${playerName}</div>
                <div class="hero-meta-row">
                    <div class="hero-zone" style="background:${currZone.color};box-shadow:2px 2px 0 ${currZone.shadow};"><span>LOC: ZONE-${currLocCode}</span></div>
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
                 <div class="mech-matrix icon-mode">${mechCellsHTML}</div>
            </div>
        </div>

        <!-- 新的栅格布局结构 (V3修正版) -->
        <div class="mosaic-grid layout-v3">
          
            <!-- PARTY 指挥官核心 (重制大气版) -->
            <div class="tile-party full-width remodel" onclick="openAppPage('party')">
                <div class="tp-bg-decoration">
                    <div class="tp-stripe-bg"></div>
                    <div class="tp-red-glow"></div>
                    <div class="tp-giant-watermark">${SVG_POKEBALL}</div>
                </div>
                <div class="tp-content-left">
                    <div class="tp-top-row">
                        <div class="tp-label-main">ACTIVE UNIT</div>
                    </div>
                    <div class="tp-big-counter">
                        <span class="curr-val">${activeStr}</span>
                        <span class="max-val">/ 06</span>
                    </div>
                </div>
                <div class="tp-roster-container">
                    ${rosterHTML}
                </div>
            </div>

            <!-- BOX: 战术青色 (Cyber Teal) -->
            <div class="live-tile box-tactical theme-teal" onclick="handleTileClick('box')">
                 <div class="t-decoration">
                    <div class="t-watermark">${SystemIcons.box}</div>
                    <div class="t-stripe"></div>
                    <div class="t-glow"></div>
                 </div>
                 <div class="t-content">
                    <div class="t-header">
                        <div class="t-icon-sm">${SystemIcons.box}</div>
                    </div>
                    <div class="t-main-data">
                        <div class="t-num">${boxCount}<small>/ 30</small></div>
                        <div class="t-label">STORAGE</div>
                    </div>
                 </div>
            </div>

            <!-- UNIT: 战术紫色 (Deep Violet) -->
            <div class="live-tile box-tactical theme-purple" onclick="handleTileClick('social')">
                 <div class="t-decoration">
                    <div class="t-watermark">${SystemIcons.unite}</div>
                    <div class="t-stripe"></div>
                    <div class="t-glow"></div>
                 </div>
                 <div class="t-content">
                    <div class="t-header">
                        <div class="t-icon-sm">${SystemIcons.unite}</div>
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
                    <div class="t-watermark logo-mode">${SystemIcons.map}</div>
                </div>
                <div class="t-content">
                    <div class="t-header" style="border-bottom-style: dashed;">
                        <div class="t-icon-sm">${SystemIcons.map}</div>
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
                            <div class="mh-zone">ZONE-${currLocCode}</div>
                            <div class="mh-coords" id="dashboard-map-coords">
                                <span class="coord-display">[${currentMapCoords.x}, ${currentMapCoords.y}]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧堆叠区：战术插片 (Tactical Blades) -->
            <div class="stack-col">
                <div class="live-tile box-tactical theme-amber small-h user-select-none" onclick="handleTileClick('transit')">
                    <div class="t-decoration">
                         <div class="t-watermark">${SystemIcons.transit}</div>
                         <div class="t-stripe"></div>
                         <div class="t-glow" style="--glow-c:rgba(253, 203, 110, 0.4)"></div>
                    </div>
                    <div class="mini-header-icon">
                        ${SystemIcons.transit}
                    </div>
                    <div class="mini-body">
                        <span class="mini-title-big">TRANSIT</span>
                    </div>
                </div>

                <div class="live-tile box-tactical theme-slate small-h user-select-none disabled">
                    <div class="t-decoration">
                         <div class="t-watermark">${SystemIcons.gig}</div>
                         <div class="t-stripe"></div>
                         <div class="t-glow"></div>
                    </div>
                    <div class="mini-header-icon">
                        ${SystemIcons.gig}
                    </div>
                    <div class="mini-body">
                         <span class="mini-title-big" style="color: #95a5a6;">WORK</span>
                         <span class="locked-badge">LOCKED</span>
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
                        <div class="dock-icon">${SystemIcons.news}</div>
                        <span class="dock-title">NEWS</span>
                        <span class="locked-badge-small">LOCKED</span>
                    </div>
                </div>

                <div class="live-tile box-tactical dock-mode dock-mart disabled">
                    <div class="t-decoration">
                        <div class="t-stripe" style="opacity:0.4"></div>
                        <div class="t-glow" style="--glow-c:rgba(0, 184, 148, 0.4)"></div>
                    </div>
                    <div class="dock-content-row">
                        <div class="dock-icon">${SystemIcons.mart}</div>
                        <span class="dock-title">MART</span>
                        <span class="locked-badge-small">LOCKED</span>
                    </div>
                </div>

                <div class="live-tile box-tactical dock-mode dock-config" onclick="handleTileClick('settings')">
                    <div class="t-decoration">
                    </div>
                    <div class="dock-content-row">
                        <div class="dock-icon">${SystemIcons.settings}</div>
                        <span class="dock-title">SYS.CFG</span>
                    </div>
                </div>
            </div>

        </div>
    `;
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
        'party': 'party',
        'transit': 'transit'
    };
    
    const targetPage = pageMap[tileId];
    if (targetPage) {
        openAppPage(targetPage);
        // 如果是 transit 页面，需要渲染
        if (targetPage === 'transit') {
            renderTransitPage();
        }
    }
};

/* ============================================================
   MAP 系统接入 - 坐标管理与 VariableEdit
   ============================================================ */

// 当前坐标缓存
let currentMapCoords = { x: 0, y: 0 };

// 根据坐标自动判断象限
function getQuadrantFromCoords(x, y) {
    // Z区（中枢区）：中心 6x6 范围
    if (Math.abs(x) <= 6 && Math.abs(y) <= 6) return "Z";
    // N区（霓虹区）：东南象限
    if (x > 0 && y < 0) return "N";
    // B区（海滨区）：西南象限
    if (x < 0 && y < 0) return "B";
    // S区（暗影区）：东北象限
    if (x > 0 && y > 0) return "S";
    // A区（极诣区）：西北象限
    if (x < 0 && y > 0) return "A";
    return "Z";
}

// 更新 Dashboard 磁贴坐标显示
function updateCoordsDisplay(coords) {
    const el = document.getElementById('dashboard-map-coords');
    if (el && coords) {
        el.innerHTML = `<span class="coord-display">[${coords.x}, ${coords.y}]</span>`;
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
        modal.innerHTML = `
            <div class="map-modal-header">
                <span class="map-modal-title">TACTICAL MAP</span>
                <div class="map-modal-actions">
                    <button class="map-modal-fullscreen" onclick="toggleMapFullscreen()" title="全屏">⛶</button>
                    <button class="map-modal-close" onclick="closeMapSystem()">✕</button>
                </div>
            </div>
            <iframe id="map-iframe" frameborder="0"></iframe>
        `;
        container.appendChild(modal);
        
        // 加载 MAP iframe
        const iframe = document.getElementById('map-iframe');
        
        // 使用外部文件加载（更稳定）
        console.log('[PKM] 加载 MAP 文件');
        iframe.src = 'map/index.html';
        iframe.onload = function() {
            setupMapCallbacks(iframe);
            
            // 加载完成后立即发送当前 ERA 数据
            if (db && db.player) {
                iframe.contentWindow.postMessage({
                    type: 'PKM_ERA_DATA',
                    data: db
                }, '*');
                console.log('[PKM] ✓ 已发送 ERA 数据到新加载的 map iframe');
            }
        };
    }
    
    modal.classList.add('active');
};

// 关闭 MAP 系统
window.closeMapSystem = function() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('fullscreen');
        document.body.classList.remove('map-fullscreen-active');
    }
};

// 切换 MAP 全屏模式
window.toggleMapFullscreen = function() {
    const modal = document.getElementById('map-modal');
    if (!modal) return;
    
    const isFullscreen = modal.classList.toggle('fullscreen');
    document.body.classList.toggle('map-fullscreen-active', isFullscreen);
    
    // 更新按钮图标
    const btn = modal.querySelector('.map-modal-fullscreen');
    if (btn) {
        btn.textContent = isFullscreen ? '⛶' : '⛶';
        btn.title = isFullscreen ? '退出全屏' : '全屏';
    }
    
    // 通知父级 iframe 容器调整大小（用于 tavern-inject.js）
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ 
            type: 'PKM_MAP_FULLSCREEN', 
            fullscreen: isFullscreen 
        }, '*');
    }
    
    // 通知 map iframe 调整大小
    const iframe = document.getElementById('map-iframe');
    if (iframe && iframe.contentWindow) {
        setTimeout(() => {
            iframe.contentWindow.postMessage({ type: 'MAP_RESIZE' }, '*');
        }, 100);
    }
    
    console.log('[PKM] MAP 全屏模式:', isFullscreen ? '开启' : '关闭');
};

// 设置 MAP iframe 的回调
function setupMapCallbacks(iframe) {
    try {
        const mapWindow = iframe.contentWindow;
        
        // 设置位置变更回调
        mapWindow.onPlayerLocationChange = function(coords) {
            console.log('[PKM] 收到位置变更:', coords);
            currentMapCoords = { x: coords.x, y: coords.y };
            updateCoordsDisplay(currentMapCoords);
            
            // 更新 ERA 数据
            if (db && db.world_state) {
                db.world_state.location = {
                    x: coords.x,
                    y: coords.y
                };
            }
            
            // 发送 VariableEdit 到酒馆
            sendLocationVariableEdit(coords);
            
            // 注入位置上下文到世界书
            injectLocationContext();
        };
        
        // 设置地图加载完成回调
        mapWindow.onMapReady = function() {
            console.log('[PKM] 地图加载完成，设置初始位置');
            
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
            
            // 初始注入位置上下文
            console.log('[PKM] 触发初始位置上下文注入');
            injectLocationContext();
        };
        
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
                y: coords.y
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
    const promptContent = `<location_context>
${contextText}
</location_context>`;
    
    // 通过 postMessage 发送注入请求给酒馆脚本（跨域兼容）
    try {
        const parentWindow = getParentWindow();
        
        // 优先使用 postMessage（GitHub Pages 模式）
        if (parentWindow !== window) {
            parentWindow.postMessage({
                type: 'PKM_INJECT_LOCATION',
                id: LOCATION_INJECT_ID,
                position: 'after_wi_scan',
                depth: 0,
                content: promptContent
            }, '*');
            console.log('[PKM] ✓ 位置上下文注入请求已发送 (postMessage)');
        } else {
            // 本地开发模式：直接调用 API
            if (typeof injectPrompts === 'function') {
                if (typeof uninjectPrompts === 'function') {
                    uninjectPrompts([LOCATION_INJECT_ID]);
                }
                injectPrompts([{
                    id: LOCATION_INJECT_ID,
                    position: 'after_wi_scan',
                    depth: 0,
                    content: promptContent
                }]);
                console.log('[PKM] ✓ 位置上下文已注入到世界书 (本地模式)');
            } else {
                console.warn('[PKM] 无法注入位置上下文：injectPrompts API 不可用');
            }
        }
    } catch (e) {
        console.error('[PKM] 位置上下文注入失败:', e);
    }
}

/**
 * 清除位置上下文注入
 */
function clearLocationContextInjection() {
    try {
        const parentWindow = getParentWindow();
        
        // 优先使用 postMessage（GitHub Pages 模式）
        if (parentWindow !== window) {
            parentWindow.postMessage({
                type: 'PKM_CLEAR_INJECTION',
                id: LOCATION_INJECT_ID
            }, '*');
            console.log('[PKM] ✓ 清除注入请求已发送 (postMessage)');
        } else {
            // 本地开发模式
            if (typeof uninjectPrompts === 'function') {
                uninjectPrompts([LOCATION_INJECT_ID]);
                console.log('[PKM] ✓ 位置上下文注入已清除 (本地模式)');
            }
        }
    } catch (e) {
        // 忽略清除失败
    }
}

// 暴露给外部调用
window.injectLocationContext = injectLocationContext;
window.clearLocationContextInjection = clearLocationContextInjection;
window.generateLocationContextText = generateLocationContextText;

