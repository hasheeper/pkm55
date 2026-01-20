/**
 * 🛰️ Project Rhodia - Tactical Hive System (Clean UI / SVG Mode)
 * ----------------------------------------------------------------
 * Visual: Modern White Card + SVG-like Graphics
 * Interactions: Drag to pan, Hover to scan
 */
/* --- 🏛️ SVG Icon Assets (ViewBox: 0 0 256 256) --- */
const SURF_Icons = {
    // 城市/铺路
    CITY: new Path2D("M240,208h-8V88a8,8,0,0,0-8-8H160a8,8,0,0,0-8,8v40H104V40a8,8,0,0,0-8-8H32a8,8,0,0,0-8,8V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM168,96h48V208H168Zm-16,48v64H104V144ZM40,48H88V208H40ZM72,72V88a8,8,0,0,1-16,0V72a8,8,0,0,1,16,0Zm0,48v16a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm0,48v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm48,16V168a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Zm64,0V168a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Zm0-48V120a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Z"),
    
    // 水/波浪
    WAVE: new Path2D("M222.16,177.25a8,8,0,0,1-1,11.25c-17.36,14.39-32.86,19.5-47,19.5-18.58,0-34.82-8.82-49.93-17-25.35-13.76-47.24-25.64-79.07.74a8,8,0,1,1-10.22-12.31c40.17-33.28,70.32-16.92,96.93-2.48,25.35,13.75,47.24,25.63,79.07-.74A8,8,0,0,1,222.16,177.25Zm-11.27-57c-31.83,26.38-53.72,14.5-79.07.74-26.61-14.43-56.76-30.79-96.93,2.49a8,8,0,0,0,10.22,12.31c31.83-26.38,53.72-14.5,79.07-.74,15.11,8.19,31.35,17,49.93,17,14.14,0,29.64-5.11,47-19.5a8,8,0,1,0-10.22-12.31ZM45.11,79.8c31.83-26.37,53.72-14.49,79.07-.74,15.11,8.2,31.35,17,49.93,17,14.14,0,29.64-5.12,47-19.5a8,8,0,1,0-10.22-12.31c-31.83,26.38-53.72,14.5-79.07.74C105.21,50.58,75.06,34.22,34.89,67.5A8,8,0,1,0,45.11,79.8Z"),

    // 植物类 (目前你的提供数据中从这里开始全都一样，但以此做好了分类接口)
    PLANT: new Path2D("M247.63,47.89a8,8,0,0,0-7.52-7.52c-51.76-3-93.32,12.74-111.18,42.22-11.8,19.49-11.78,43.16-.16,65.74a71.34,71.34,0,0,0-14.17,27L98.33,159c7.82-16.33,7.52-33.35-1-47.49-13.2-21.79-43.67-33.47-81.5-31.25a8,8,0,0,0-7.52,7.52c-2.23,37.83,9.46,68.3,31.25,81.5A45.82,45.82,0,0,0,63.44,176,54.58,54.58,0,0,0,87,170.33l25,25V224a8,8,0,0,0,16,0V194.51a55.61,55.61,0,0,1,12.27-35,73.91,73.91,0,0,0,33.31,8.4,60.9,60.9,0,0,0,31.83-8.86C234.89,141.21,250.67,99.65,247.63,47.89ZM47.81,155.6C32.47,146.31,23.79,124.32,24,96c28.32-.24,50.31,8.47,59.6,23.81,4.85,8,5.64,17.33,2.46,26.94L61.65,122.34a8,8,0,0,0-11.31,11.31l24.41,24.41C65.14,161.24,55.82,160.45,47.81,155.6Zm149.31-10.22c-13.4,8.11-29.15,8.73-45.15,2l53.69-53.7a8,8,0,0,0-11.31-11.31L140.65,136c-6.76-16-6.15-31.76,2-45.15,13.94-23,47-35.82,89.33-34.83C232.94,98.34,220.14,131.44,197.12,145.38Z"),
    
    TREE: new Path2D("M198.1,62.59a76,76,0,0,0-140.2,0A71.71,71.71,0,0,0,16,127.8C15.9,166,48,199,86.14,200A72.09,72.09,0,0,0,120,192.47V232a8,8,0,0,0,16,0V192.47A72.17,72.17,0,0,0,168,200l1.82,0C208,199,240.11,166,240,127.8A71.71,71.71,0,0,0,198.1,62.59ZM169.45,184a56.08,56.08,0,0,1-33.45-10v-41l43.58-21.78a8,8,0,1,0-7.16-14.32L136,115.06V88a8,8,0,0,0-16,0v51.06L83.58,120.84a8,8,0,1,0-7.16,14.32L120,156.94v17a56,56,0,0,1-33.45,10C56.9,183.23,31.92,157.52,32,127.84A55.77,55.77,0,0,1,67.11,76a8,8,0,0,0,4.53-4.67,60,60,0,0,1,112.72,0A8,8,0,0,0,188.89,76,55.79,55.79,0,0,1,224,127.84C224.08,157.52,199.1,183.23,169.45,184Z"),
    FLOWER: new Path2D("M208,48a87.48,87.48,0,0,0-35.36,7.43c-15.1-25.37-39.92-38-41.06-38.59a8,8,0,0,0-7.16,0c-1.14.58-26,13.22-41.06,38.59A87.48,87.48,0,0,0,48,48a8,8,0,0,0-8,8V96a88.11,88.11,0,0,0,80,87.63v35.43L83.58,200.84a8,8,0,1,0-7.16,14.32l48,24a8,8,0,0,0,7.16,0l48-24a8,8,0,0,0-7.16-14.32L136,219.06V183.63A88.11,88.11,0,0,0,216,96V56A8,8,0,0,0,208,48ZM120,167.56A72.1,72.1,0,0,1,56,96V64.44A72.1,72.1,0,0,1,120,136Zm8-68.2A88.4,88.4,0,0,0,97.36,63.19c9.57-15.79,24-25.9,30.64-30,6.65,4.08,21.08,14.19,30.64,30A88.46,88.46,0,0,0,128,99.36ZM200,96a72.1,72.1,0,0,1-64,71.56V136a72.1,72.1,0,0,1,64-71.56Z"),
    SAND:   new Path2D("M238.25,229A8,8,0,0,1,227,230.25c-.37-.3-38.82-30.25-99-30.25S29.36,230,29,230.26a8,8,0,0,1-10-12.51c1.63-1.3,38.52-30.26,98.29-33.45A119.94,119.94,0,0,1,114,146.37c1.74-21.71,10.92-50.63,43-72.48A64.65,64.65,0,0,0,140.26,72c-19,.62-30.94,11.71-36.5,33.92A8,8,0,0,1,96,112a7.64,7.64,0,0,1-1.94-.24,8,8,0,0,1-5.82-9.7c9.25-36.95,33.11-45.42,51.5-46a81.48,81.48,0,0,1,21.68,2.45c-3.83-6.33-9.43-12.93-17.21-16.25-10-4.24-22.17-2.39-36.31,5.51a8,8,0,0,1-7.8-14c18.74-10.45,35.72-12.54,50.48-6.2,12.49,5.36,20.73,15.78,25.87,25,6.18-9.64,13.88-16.17,22.39-18.94,11.86-3.87,24.64-.72,38,9.37a8,8,0,0,1-9.64,12.76c-8.91-6.73-16.77-9.06-23.35-6.93-7.29,2.35-12.87,10-16.37,16.61A70.46,70.46,0,0,1,208,73.07c14.61,8.35,32,26.05,32,62.94a8,8,0,0,1-16,0c0-23.46-8.07-40-24-49a50.49,50.49,0,0,0-5.75-2.8,55.64,55.64,0,0,1,5.06,33.06,59.41,59.41,0,0,1-8.86,23.41,8,8,0,0,1-13.09-9.2c.74-1.09,16.33-24.38-3.26-49.37-27,15.21-41.89,37.25-44.16,65.59a104.27,104.27,0,0,0,3.83,36.44c62.65,1.81,101.52,32.33,103.2,33.66A8,8,0,0,1,238.25,229ZM24,140a28,28,0,1,1,28,28A28,28,0,0,1,24,140Zm16,0a12,12,0,1,0,12-12A12,12,0,0,0,40,140Z"),
    CACTUS: new Path2D("M216,208H168V184h4a68.07,68.07,0,0,0,68-68,28,28,0,0,0-56,0,12,12,0,0,1-12,12h-4V56a40,40,0,0,0-80,0V88H84A12,12,0,0,1,72,76a28,28,0,0,0-56,0,68.07,68.07,0,0,0,68,68h4v64H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM96,128H84A52.06,52.06,0,0,1,32,76a12,12,0,0,1,24,0,28,28,0,0,0,28,28H96a8,8,0,0,0,8-8V56a24,24,0,0,1,48,0v80a8,8,0,0,0,8,8h12a28,28,0,0,0,28-28,12,12,0,0,1,24,0,52.06,52.06,0,0,1-52,52H160a8,8,0,0,0-8,8v32H104V136A8,8,0,0,0,96,128Z"),
    SLUM:  new Path2D("M18.294,29.822h5.767v5.764H18.294Zm34.585,17.294h5.767v5.763H52.879Zm0,40.355H81.703v5.766H52.879Zm-34.585-23.059h5.767v5.764H18.294Zm11.53,0h5.764v5.764H29.824ZM96.121,52.883H70.176V41.352h2.882a2.882,2.882,0,1,0,0-5.764H47.115V24.058H50a2.885,2.885,0,1,0,0-5.764H29.824V6.764H12.529v11.527l-8.646,0.003A2.883,2.883,0,0,0,1,21.176a2.883,2.883,0,0,0,2.883,2.882h2.88v28.825h-2.88A2.883,2.883,0,0,0,1,55.768a2.879,2.879,0,0,0,2.883,2.879h2.88v34.59h5.765v-34.59h28.823v34.59h5.764V81.707l23.061,0,0,0v0h5.764v-5.764h-5.764l0-17.293h17.297v34.59h5.764v-34.59h2.885a2.879,2.879,0,0,0,2.879-2.879A2.883,2.883,0,0,0,96.121,52.883Zm-77.827-40.355h5.767v5.767H18.294Zm11.53,23.06H26.939a2.882,2.882,0,0,0,0,5.764h2.885V52.883H12.529V24.058h28.823v11.53H35.588v0h-5.764Zm17.291,40.351,0-23.057h0l0,0H35.588V41.352h28.824v34.587h0H47.115Zm28.827-17.057H75.942V64.412h5.764Z"),
    WASTE: new Path2D("M20,28H17V23.49l8.45-6.57,3.79-1A1,1,0,0,0,28.76,14L26,14.72V12a1,1,0,0,0-2,0v3.51L17,21V13.51l6.43-4.59,3.81-1A1,1,0,1,0,26.76,6L24,6.72V3a1,1,0,0,0-2,0V7.49l-5,3.57V10a1,1,0,0,0-.4-.8L12.17,5.88l1.64-2.3a1,1,0,1,0-1.62-1.16L10.57,4.68,8.6,3.2A1,1,0,1,0,7.4,4.8L15,10.5V19L8,13.51V9A1,1,0,0,0,6,9v4H3a1,1,0,0,0,0,2H6.66L15,21.49V28H3a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2Z M29,28H24a1,1,0,0,0,0,2h5a1,1,0,0,0,0-2Z"),
    MAGMA: new Path2D("M92,89v3c-43.233,0-41.652,0-84,0v-3h.029c0-.771.27-1.53.83-2.102C20.1,75.447,25.663,63.245,31.553,50.328l.718-1.575C32.759,47.686,33.825,47,35,47h11.996L40.618,63.647c-1.088,3,1.025,5.163,3.382,4.995l4.9-.35-3.322,11.138c-.534,1.784,1.999,2.797,2.845,1.138l7.363-14.455c.916-1.817-.319-3.939-2.305-4.08-.7-.05-3.475-.248-4.068-.29L56.147,47H65c1.175,0,2.241.686,2.729,1.753l.718,1.575c5.89,12.917,11.454,25.119,22.695,36.57.56.572.829,1.331.83,2.102Zm-45-78c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3S47,12.657,47,11ZM20,14c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3S20,15.657,20,14ZM8,26c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3S8,27.657,8,26Zm39-3v-3c0-1.657,1.343-3,3-3s3,1.343,3,3v3c0,1.657-1.343,3-3,3S47,24.657,47,23ZM20,26c0-1.657,1.343-3,3-3,5.738,0,13.485,2.42,17.81,13.947.582,1.551-.205,3.28-1.756,3.863-1.58.587-3.287-.225-3.863-1.756C29.618,32.195,25.745,29,20,29,18.343,29,17,27.657,17,26Zm12.149-9.935c.519-1.573,2.208-2.436,3.785-1.916C39.935,16.445,47,23.782,47,35c0,1.657-1.343,3-3,3s-3-1.343-3-3c0-8.215-4.989-13.528-9.935-15.149C29.491,19.335,28.634,17.64,29.149,16.065ZM74,14c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3S74,15.657,74,14Zm12,12c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3S86,27.657,86,26Zm-6-3c1.657,0,3,1.343,3,3s-1.343,3-3,3c-5.745,0-9.618,3.195-12.19,10.053-.576,1.532-2.283,2.343-3.863,1.756-1.551-.583-2.338-2.312-1.756-3.863C66.515,25.42,74.262,23,80,23Zm-27,12c0-11.218,7.065-18.555,14.065-20.851,1.578-.526,3.27.341,3.785,1.916s-.341,3.27-1.916,3.785C63.989,21.472,59,26.785,59,35c0,1.657-1.343,3-3,3S53,36.657,53,35Z"),
    MTN:   new Path2D("M5,12H9V10H5a1.0018,1.0018,0,1,1,.0176-2.0034A.9993.9993,0,0,0,6.1123,6.65a1.883,1.883,0,0,1-.1074-.7974A1.9984,1.9984,0,0,1,9.9443,5.54a1.0006,1.0006,0,0,0,1.5361.6089,1.0386,1.0386,0,0,1,.6914.2681A1.2116,1.2116,0,0,1,13,7.1357V8h2V7.1357a3.2046,3.2046,0,0,0-1.0039-2.3213,2.91,2.91,0,0,0-2.1816-.8091,3.0914,3.0914,0,0,0-.3242.0371,4.0482,4.0482,0,0,0-4.4131-1.939A3.9759,3.9759,0,0,0,4.0088,5.7271a4.2021,4.2021,0,0,0-.0049.4429A3,3,0,0,0,5,12Z M28.93,28,28,15.92a1.0091,1.0091,0,0,0-.8-.9l-.35-.07L24.99,2.85a1.0055,1.0055,0,0,0-1.19-.83l-5,1a.9792.9792,0,0,0-.72.59l-2.76,6.44-3-1a1.0048,1.0048,0,0,0-1.25.58L8,17h4v1L5.84,19.01a1.017,1.017,0,0,0-.82.77L3.2,28H2v2H30V28H28.93Zm-6.14,0L18.97,11.77a.9868.9868,0,0,0-.65-.72l-1.1-.36,2.49-5.81,3.46-.69,1.59,10.34-2.56-.51-.4,1.96,4.26.85L26.92,28H22.79Z"),
    CURSED:new Path2D("M85.21,105.368l20.787,10.721,18.345-15.694Zm-2.99351-3.65246,45.782-5.819L128,95.88281V66.15131L102.16217,65.384Zm17.648-40.34261,25.29.751L96.845,11.275,85.386,44.463ZM45.423,66.986,39.896,96.964l37.584,5.066L98.532,63.684,82.701,47.439Zm-44.69546-.30827,35.46027,28.34021,5.39087-29.23969L30.46985,28.61438.63916,66.54c-.014.01794-.02228.03918-.03589.05737C.64423,66.62543.68817,66.64624.72754,66.67773ZM28.221,118.999l72.501-1.13-22.757-11.737L38.616,100.828Zm6.7414-19.83982L.52277,71.63477l5.58368,31.8584a3.0178,3.0178,0,0,0,1.26318,1.96289l17.24921,11.78485ZM33.93115,26.22754,44.8537,62.76831,81.46136,43.57257,93.3877,9.03186a2.95468,2.95468,0,0,0-.418.08142l-59.208,16.71729A1.99654,1.99654,0,0,1,33.93115,26.22754Z"),
    ELEC:   new Path2D("M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"),
    SNOW:   new Path2D("M223.77,150.09a8,8,0,0,1-5.86,9.68l-24.64,6,6.46,24.11a8,8,0,0,1-5.66,9.8A8.25,8.25,0,0,1,192,200a8,8,0,0,1-7.72-5.93l-7.72-28.8L136,141.86v46.83l21.66,21.65a8,8,0,0,1-11.32,11.32L128,203.31l-18.34,18.35a8,8,0,0,1-11.32-11.32L120,188.69V141.86L79.45,165.27l-7.72,28.8A8,8,0,0,1,64,200a8.25,8.25,0,0,1-2.08-.27,8,8,0,0,1-5.66-9.8l6.46-24.11-24.64-6a8,8,0,0,1,3.82-15.54l29.45,7.23L112,128,71.36,104.54l-29.45,7.23A7.85,7.85,0,0,1,40,112a8,8,0,0,1-1.91-15.77l24.64-6L56.27,66.07a8,8,0,0,1,15.46-4.14l7.72,28.8L120,114.14V67.31L98.34,45.66a8,8,0,0,1,11.32-11.32L128,52.69l18.34-18.35a8,8,0,0,1,11.32,11.32L136,67.31v46.83l40.55-23.41,7.72-28.8a8,8,0,0,1,15.46,4.14l-6.46,24.11,24.64,6A8,8,0,0,1,216,112a7.85,7.85,0,0,1-1.91-.23l-29.45-7.23L144,128l40.64,23.46,29.45-7.23A8,8,0,0,1,223.77,150.09Z"),
    FACTORY:new Path2D("M116,176a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h28A8,8,0,0,1,116,176Zm60-8H148a8,8,0,0,0,0,16h28a8,8,0,0,0,0-16Zm64,48a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16h8V88a8,8,0,0,1,12.8-6.4L96,120V88a8,8,0,0,1,12.8-6.4l38.74,29.05L159.1,29.74A16.08,16.08,0,0,1,174.94,16h18.12A16.08,16.08,0,0,1,208.9,29.74l15,105.13s.08.78.08,1.13v72h8A8,8,0,0,1,240,216Zm-77.86-94.4,8.53,6.4h36.11L193.06,32H174.94ZM48,208H208V144H168a8,8,0,0,1-4.8-1.6l-14.4-10.8,0,0L112,104v32a8,8,0,0,1-12.8,6.4L48,104Z"),
    CABIN: new Path2D("M16,208h224a8,8,0,0,1,0,16H16a8,8,0,0,1,0-16Zm136,16V152a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v72a8,8,0,0,0,16,0V160h16v64a8,8,0,0,0,16,0ZM32,116.69V216a8,8,0,0,0,16,0V116.69a8,8,0,0,0-16,0Zm176,0V216a8,8,0,0,0,16,0V116.69a8,8,0,0,0-16,0ZM235.06,125.78,136.72,27.43a16,16,0,0,0-22.63,0L15.75,125.78a8,8,0,0,0,11.31,11.31L128,36.15,228.94,137.09a8,8,0,1,0,11.31-11.31Z"),
    CARROT: new Path2D("M232,64H203.31l26.35-26.34a8,8,0,0,0-11.32-11.32L192,52.69V24a8,8,0,0,0-16,0V56.57a64,64,0,0,0-77.2,10.12l0,0,0,0,0,0c-40.1,39.39-70.25,133.08-73.19,142.45a16,16,0,0,0,21.26,21.26c9.37-2.94,103.18-33.13,142.47-73.21A64,64,0,0,0,199.43,80H232a8,8,0,0,0,0-16Zm-54.12,82c-8.94,9.12-21.25,17.8-34.85,25.73l-25.38-25.39a8,8,0,0,0-11.32,11.32l22.09,22.09c-40.87,21.19-86.32,35.42-87,35.63A7.93,7.93,0,0,0,40,216a7.93,7.93,0,0,0,.59-1.41c.29-.93,28-89.58,64-130.67l33.77,33.77a8,8,0,0,0,11.32-11.32L116.18,72.88A48,48,0,0,1,177.88,146Z")
};

const ENTITY_ICONS = {
    CAFE: new Path2D("M4,19h16v-2H4V19z M20,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2h-2V5H4v10h14V13z M18,7v4h2l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0V7H18z"),
    BAR: new Path2D("M21,5V3H3v2l8,9v5H6v2h12v-2h-5v-5L21,5z M7.43,5L12,9.57L16.57,5H7.43z"),
    SHOP: new Path2D("M20,6h-4c0-2.21-1.79-4-4-4S8,3.79,8,6H4V4h16V6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z M20,8L20,8H4v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8z M12,15c-1.66,0-3-1.34-3-3h2c0,0.55,0.45,1,1,1s1-0.45,1-1h2C15,13.66,13.66,15,12,15z"),
    PLAZA: new Path2D("M14.4,6L13,2H6l1.4,4H14.4z M17,21H7v-2h10V21z M17,17H7v-8h10V17z M15,15H9v-4h6V15z"),
    GAME: new Path2D("M21,6H3C1.9,6,1,6.9,1,8v8c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M6,13.5v-1h2v1H6z M9.5,12h-1v-2h1V12z M12,13.5v-1h2v1H12z M18,12h-2V9h2V12z"),
    REST: new Path2D("M21,10.78V15h2v2h-2v4h-2v-4H5v4H3v-4H1v-2h2v-4.22c0-0.55,0.45-1,1-1V5c0-1.1,0.9-2,2-2h12c1.1,0,2,0.9,2,2v2.78C20.55,9.78,21,10.23,21,10.78z M16,5H8v2.78C8.55,7.78,9,8.23,9,8.78V11h6V8.78c0-0.55,0.45-1,1-1V5z"),
    HEAL: new Path2D("M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M13,17h-2v-4H7v-2h4V7h2v4h4v2h-4V17z"),
    PC: new Path2D("M20,18c1.1,0,2-0.9,2-2V6c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6v10c0,1.1,0.9,2,2,2H0v2h24v-2H20z M4,6h16v10H4V6z"),
    POLICE: new Path2D("M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11V11.99z"),
    WARP: new Path2D("M12,2L4.5,20.29l0.71,0.71L12,18l6.79,3l0.71-0.71L12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,16,12,16z"),
    GATE: new Path2D("M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M17,19h-2v-8H9v8H7V5h10V19z")
};

const NPC_BASE_URL = "https://raw.githack.com/hasheeper/pkm33/main/data/avatar/";
const FALLBACK_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGc+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTEyLDE0Yy02LjEsMC04LDQtOCw0djJoMTZ2LTJDMjAsMTgsMTguMSwxNCwxMiwxNHoiIGZpbGw9IiNmZmZmZmYiLz48L2c+PC9zdmc+";

const AVATAR_FIXES = {
    "hex": "hexmaniac",
    "mallows": "mallow",
    "mallow": "mallow"
};

const THREAT_MAP = {
    0: { label: "NULL",  color: "#bdc3c7", alert: false },
    6: { label: "PEACE", color: "#2ecc71", alert: false },
    1: { label: "SAFE",  color: "#2ecc71", alert: false },
    2: { label: "LOW",   color: "#f1c40f", alert: false },
    3: { label: "MID",   color: "#f39c12", alert: true  },
    4: { label: "HIGH",  color: "#e74c3c", alert: true  },
    5: { label: "APEX",  color: "#8e44ad", alert: true  }
};

const TRAV_MAP = {
    0: "OPEN",
    3: "PATH",
    5: "FAST"
};

// --- 🎨 现代可视化配置 ---
const TACTICAL_STYLE = {
    TILE_SIZE: 180,
    VIEW_RADIUS: 5,
    DRAG_FRICTION: 0.12,

    // Ver. Dawn Palette
    COLOR_BG: "#f2f4f8",
    CARD_BASE: "rgba(255, 255, 255, 0.95)",
    TXT_PRIMARY: "#2d3436",
    TXT_SECONDARY: "#b2bec3",
    ACCENT_CYAN: "#00cec9",
    ACCENT_BLUE: "#74b9ff",
    ACCENT_WARN: "#fdcb6e",
    ACCENT_CRIT: "#dfe6e930",

    // Typography + legacy compatibility
    FONT_UI: "700 12px 'Exo 2', sans-serif",
    FONT_HEAD: "900 14px 'Exo 2', sans-serif",
    FONT_NUM: "700 12px 'Chakra Petch', monospace",
    ACCENT_PLAYER: "#00cec9",
};

// 辅助：获取特定层ID (IntGrid)
function getIntVal(gx, gy, lid) {
    if(!window.levelData) return 0;
    const l = window.levelData.layerInstances.find(x => x.__identifier === lid);
    if(!l || !l.intGridCsv) return 0;
    if(gx<0||gy<0||gx>=l.__cWid||gy>=l.__cHei) return 0;
    return l.intGridCsv[gx + gy * l.__cWid] || 0;
}

function getZoneInfo(gx, gy) {
    if(!window.groupCache) return {};

    const findInLayer = (lid) => {
        const layerGroups = window.groupCache[lid];
        if(!layerGroups) return null;
        for(let key in layerGroups) {
            const list = layerGroups[key];
            for(let item of list) {
                const worldX = gx * 16;
                const worldY = gy * 16;
                if(worldX >= item.rect.x && worldX < item.rect.x + item.rect.w &&
                   worldY >= item.rect.y && worldY < item.rect.y + item.rect.h) {
                    return key;
                }
            }
        }
        return null;
    };

    return {
        region: findInLayer("Region_Zone"),
        biome: findInLayer("Biome_Zone")
    };
}

function getIntGridTextName(layerIdentifier, valID) {
    if(!valID || !window.levelData || !window.intGridInfoMap) return null;
    const layer = window.levelData.layerInstances.find(l => l.__identifier === layerIdentifier);
    if(!layer) return null;
    const defMap = window.intGridInfoMap[layer.layerDefUid];
    if(!defMap) return null;
    const entry = defMap[valID];
    if(!entry) return null;
    return entry.id || null;
}

function getEntZoneName(layerIdentifier, gx, gy) {
    if(!window.groupCache || !window.groupCache[layerIdentifier]) return null;
    const worldX = gx * 16;
    const worldY = gy * 16;
    const groups = window.groupCache[layerIdentifier];
    for(const key in groups) {
        for(const item of groups[key]) {
            const r = item.rect;
            if(worldX >= r.x && worldX < r.x + r.w && worldY >= r.y && worldY < r.y + r.h) {
                return key;
            }
        }
    }
    return null;
}

const formatZoneName = (name) => name ? name.replace(/_/g, ' ') : null;
const shortenValue = (text, max = 8) => {
    if(!text) return "---";
    return text.length > max ? `${text.slice(0, max - 2)}..` : text;
};

function parseActorName(rawName) {
    if(!rawName) return { name: "NPC", detail: "" };
    const parts = rawName.split('_');
    const name = (parts[0] || "NPC").toUpperCase();
    const detail = parts.length > 1 ? parts.slice(1).join(' ') : "";
    return { name, detail };
}

/* --- 🔧 Autotile Helpers --- */
function checkPathCon(gx, gy) {
    const val = getIntVal(gx, gy, "Traversability");
    return val > 0;
}

function checkInfraCon(gx, gy, selfID) {
    const neighborID = getIntVal(gx, gy, "Infrastructure");
    return neighborID > 0;
}

/* --- 🛠️ Color Utilities --- */
function hexToRgba(hex, alphaMulti = 1) {
    if (!hex) return `rgba(200,200,200,${0.1 * alphaMulti})`;

    let raw = hex.trim();
    if (raw[0] === "#") raw = raw.slice(1);
    let chars = raw.split("");
    if (chars.length === 3) {
        chars = [chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]];
    }

    const rgbHex = chars.join("").substring(0, 6).padEnd(6, "0");
    const hexVal = parseInt(rgbHex, 16);
    return `rgba(${(hexVal >> 16) & 255}, ${(hexVal >> 8) & 255}, ${hexVal & 255}, ${alphaMulti})`;
}

const TacticalSystem = {
    isActive: false,

    imgCache: {},
    
    anchor: { x:0, y:0 }, // 此时鼠标点击的锚点中心
    playerGrid: { x:0, y:0 }, // 真实的玩家所占格子
    
    cam: { x:0, y:0, inputX:0, inputY:0 },
    isDragging: false,
    lastMouse: { x:0, y:0 },
    
    // 数据面板
    hoverData: null,
    
    ctx: null, w:0, h:0,

    enter: function(ctx, w, h, pGx, pGy) {
        this.isActive = true;
        this.ctx = ctx; this.w = w; this.h = h;
        
        // 记录进入时的中心
        this.anchor = { x: Math.floor(pGx), y: Math.floor(pGy) };
        this.playerGrid = { x: Math.floor(pGx), y: Math.floor(pGy) };
        
        this.cam = { x:0, y:0, inputX:0, inputY:0 };
        this.isDragging = false; 
        
        this.bindEvents();
        this.checkHover(this.w/2, this.h/2);
        this.render();
    },

    exit: function() {
        this.isActive = false;
        this.unbindEvents();
        this.ctx.setTransform(1,0,0,1,0,0);
        if(window.resumeGlobalMap) window.resumeGlobalMap();
    },

    bindEvents: function() {
        this.unbindEvents();
        this._down = e => { 
            if(e.button===0) {
                // 检查是否点击了宝可梦面板标题栏
                if (this.handlePokemonPanelClick(e.clientX, e.clientY)) {
                    return; // 点击了折叠按钮，不开始拖拽
                }
                this.isDragging=true; 
                this.lastMouse={x:e.clientX, y:e.clientY};
            } 
        };
        this._up   = () => this.isDragging=false;
        this._move = e => {
            if(this.isDragging) {
                this.cam.inputX += e.clientX - this.lastMouse.x;
                this.cam.inputY += e.clientY - this.lastMouse.y;

                const dragLimit = TACTICAL_STYLE.TILE_SIZE * 1.2;
                this.cam.inputX = Math.max(-dragLimit, Math.min(dragLimit, this.cam.inputX));
                this.cam.inputY = Math.max(-dragLimit, Math.min(dragLimit, this.cam.inputY));

                this.lastMouse={x:e.clientX, y:e.clientY};
            }
            this.checkHover(e.clientX, e.clientY);
        };

        this._click = (e) => {
            // 移动模式下的点击选择
            if(this._movementMode && e.button === 0) {
                const cx = this.w/2 + this.cam.x;
                const cy = this.h/2 + this.cam.y;
                const s = TACTICAL_STYLE.TILE_SIZE;
                const dx = Math.floor((e.clientX - cx + s/2)/s);
                const dy = Math.floor((e.clientY - cy + s/2)/s);
                const gx = this.anchor.x + dx;
                const gy = this.anchor.y + dy;
                
                console.log('[Tactical] 点击相对坐标:', dx, dy, '世界坐标:', gx, gy);
                
                if(this._isInMoveRange(gx, gy)) {
                    this._movementTarget = { gx, gy };
                    console.log('[Tactical] 选择移动目标:', gx, gy);
                } else {
                    console.log('[Tactical] 格子不在移动范围内');
                }
                e.stopPropagation();
            }
        };

        window.addEventListener('mousedown', this._down);
        window.addEventListener('mouseup', this._up);
        window.addEventListener('mousemove', this._move);
        window.addEventListener('click', this._click);
    },
    unbindEvents: function() {
        if(this._down) window.removeEventListener('mousedown', this._down);
        if(this._up) window.removeEventListener('mouseup', this._up);
        if(this._move) window.removeEventListener('mousemove', this._move);
        if(this._click) window.removeEventListener('click', this._click);
    },

    checkHover: function(mx, my) {
        const cx = this.w/2 + this.cam.x; const cy = this.h/2 + this.cam.y;
        const s = TACTICAL_STYLE.TILE_SIZE;
        const dx = Math.floor((mx - cx + s/2)/s);
        const dy = Math.floor((my - cy + s/2)/s);
        const gx = this.anchor.x + dx; 
        const gy = this.anchor.y + dy;

        const tags = getZoneInfo(gx, gy);
        const surfaceVal = getIntVal(gx, gy, "Surface") || 0;
        const threatVal = getIntVal(gx, gy, "Threat") || 0;
        const infraVal = getIntVal(gx, gy, "Infrastructure") || 0;
        const travVal = getIntVal(gx, gy, "Traversability") || 0;
        const obsVal = getIntVal(gx, gy, "Obstacles") || 0;
        const underVal = getIntVal(gx, gy, "Underground_Access") || 0;
        const regionIntVal = getIntVal(gx, gy, "Regions") || 0;

        const threatInfo = THREAT_MAP[threatVal] || THREAT_MAP[0];

        const regionEntity = formatZoneName(tags.region);
        const regionIntName = formatZoneName(getIntGridTextName("Regions", regionIntVal));
        const regionDisplay = regionEntity || regionIntName || (regionIntVal ? `SEC-${regionIntVal}` : "UNDEFINED");
        const biomeDisplay = formatZoneName(tags.biome) || "---";

        const surfaceName = (window.TERRAIN_CONFIG && window.TERRAIN_CONFIG[surfaceVal]?.type) || "VOID";
        const infraLabel = infraVal > 0 ? "YES" : "NO";
        const travLabel = TRAV_MAP[travVal] || "CLOSED";
        const obsLabel = obsVal === 1 ? "BLOCK" : "OPEN";
        const tunnelLabel = underVal > 0 ? "FOUND" : "NONE";

        this.hoverData = {
            gx,
            gy,
            surface: surfaceVal,
            threat: threatVal,
            infra: infraVal,
            trav: travVal,
            obs: obsVal,
            under: underVal,
            regionInt: regionIntVal,
            regionName: regionDisplay,
            biomeName: biomeDisplay,
            surfaceName,
            // 原始值用于宝可梦生成
            biomeZoneRaw: tags.biome || '',
            surfaceTypeRaw: surfaceName,
            infraText: infraLabel,
            travText: travLabel,
            obsText: obsLabel,
            tunnelText: tunnelLabel,
            threatLabel: threatInfo.label,
            threatColor: threatInfo.color,
            threatAlert: threatInfo.alert
        };
    },

    // --- MAIN RENDER ---
    render: function() {
        if(!this.isActive) return;
        const ctx = this.ctx;
        const { w, h } = this;

        // 背景清空
        ctx.fillStyle = TACTICAL_STYLE.COLOR_BG;
        ctx.fillRect(0,0, w, h);

        // 物理缓动相机
        this.cam.x += (this.cam.inputX - this.cam.x) * TACTICAL_STYLE.DRAG_FRICTION;
        this.cam.y += (this.cam.inputY - this.cam.y) * TACTICAL_STYLE.DRAG_FRICTION;

        // View Setup
        ctx.save();
        ctx.translate(w/2 + this.cam.x, h/2 + this.cam.y);

        const R = Math.min(3, TACTICAL_STYLE.VIEW_RADIUS);
        const S = TACTICAL_STYLE.TILE_SIZE;

        // --- Layer 1: 底板卡片 (White Cards) --- 
        for(let dy=-R; dy<=R; dy++) {
            for(let dx=-R; dx<=R; dx++) {
                const gx = this.anchor.x + dx; 
                const gy = this.anchor.y + dy;
                
                // Dist fading
                const d = Math.sqrt(dx*dx + dy*dy);
                if(d > R+0.5) continue;
                const alpha = Math.max(0.2, 1 - (d / (R + 0.5)));
                
                // 绘制这个格子
                this.drawTile(ctx, dx*S, dy*S, S, gx, gy, alpha);
            }
        }

        // --- Layer 2: 实体/标志 (Entity Overlay) ---
        this.drawEntityLayer(ctx, R, S);
        this.drawHoverFrame(ctx, S);

        ctx.restore();

        if(this.hoverData) this.drawSidePanel(ctx);

        requestAnimationFrame(() => this.render());
    },

    // 🏆 Draw Tile UI (核心: 每一个方块就是一个仪表盘)
    drawTile: function(ctx, x, y, size, gx, gy, alpha = 1) {
        const px = x - size / 2;
        const py = y - size / 2;
        this._drawInfoTile(ctx, gx, gy, px, py, size, alpha);
    },

    drawHoverFrame: function(ctx, size) {
        if(!this.hoverData) return;
        ctx.save();
        const dx = this.hoverData.gx - this.anchor.x;
        const dy = this.hoverData.gy - this.anchor.y;
        ctx.strokeStyle = "rgba(52, 152, 219, 0.85)";
        ctx.lineWidth = 4;
        ctx.strokeRect(dx*size - size/2 + 2, dy*size - size/2 + 2, size - 4, size - 4);
        ctx.restore();
    },

    _drawInfoTile: function(ctx, gx, gy, px, py, size, alpha) {
        const gap = 8;
        const realS = size - gap;
        const padding = (size - realS) / 2;
        const x = px + padding;
        const y = py + padding;
        const radius = 10;

        const surfID = getIntVal(gx, gy, "Surface");
        const threatVal = getIntVal(gx, gy, "Threat");
        const infraID = getIntVal(gx, gy, "Infrastructure");
        const travVal = getIntVal(gx, gy, "Traversability");

        const isPlayerPos = (gx === this.playerGrid.x && gy === this.playerGrid.y);
        const isHover = (this.hoverData && this.hoverData.gx === gx && this.hoverData.gy === gy);

        const config = (window.TERRAIN_CONFIG && window.TERRAIN_CONFIG[surfID]) || { el: 0, fill: "#cccccc", type: "VOID" };
        const elev = (config.el === undefined) ? 0 : config.el;
        const isConcave = elev < 2;

        const bgAlphaStart = isConcave ? 0.12 : 0.08;
        const tileBgColor = hexToRgba(config.fill, bgAlphaStart * alpha);

        const prevAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;

        ctx.save();
        if (isConcave) {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        } else {
            const shadowOpacity = 0.3 * alpha;
            const shadowOffset = Math.max(4, elev * 1.5);
            ctx.shadowColor = isPlayerPos 
                ? "rgba(52, 152, 219, 0.6)"
                : `rgba(90, 100, 120, ${shadowOpacity})`;
            ctx.shadowBlur = isPlayerPos ? 30 : 15;
            ctx.shadowOffsetY = isPlayerPos ? 0 : shadowOffset;
        }

        ctx.fillStyle = tileBgColor;
        const renderInset = isConcave ? 1.5 : 0;
        ctx.beginPath();
        ctx.roundRect(x + renderInset, y + renderInset, realS - renderInset * 2, realS - renderInset * 2, radius);
        ctx.fill();

        if (!isConcave) {
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = hexToRgba(config.fill, 0.35 * alpha);
            ctx.beginPath();
            ctx.roundRect(x + renderInset, y + renderInset, realS - renderInset * 2, realS - renderInset * 2, radius);
            ctx.stroke();
        }
        if (isPlayerPos) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = TACTICAL_STYLE.ACCENT_PLAYER;
            ctx.beginPath();
            ctx.roundRect(x + renderInset, y + renderInset, realS - renderInset * 2, realS - renderInset * 2, radius);
            ctx.stroke();
        }
        ctx.restore();

        if (surfID > 0) {
            ctx.save();
            const t = config.type || "";

            let targetIcon = null;
            let iconScale = 1.0;
            let iconOffset = { x: 0, y: 0 };
            let iconBase = 256;
            let customTint = null;

            if (t.includes('Sand') || t === 'Coastal_Sand' || t === 'Desert_Sand') targetIcon = SURF_Icons.SAND;
            else if (t === 'CACTUS') targetIcon = SURF_Icons.CACTUS;
            else if (t.includes('Forest') || t === 'Deep_Jungle') targetIcon = SURF_Icons.TREE;
            else if (t === 'Flower_Field') targetIcon = SURF_Icons.FLOWER;
            else if (t === 'High_Voltage') targetIcon = SURF_Icons.ELEC;
            else if (t === 'Snowfield' || t === 'Withered_Grass') {
                targetIcon = SURF_Icons.SNOW;
                customTint = `rgba(110, 140, 190, ${Math.max(0.35, alpha * 0.6)})`;
            }
            else if (t === 'Swamp') {
                targetIcon = SURF_Icons.PLANT;
            }
            else if (t === 'Magma') {
                targetIcon = SURF_Icons.MAGMA;
                iconScale = 1.4;
                iconOffset = { x: 10, y: 0 };
                iconBase = 125;
            }
            else if (t === 'Rocky_Mountain') {
                targetIcon = SURF_Icons.MTN;
                iconScale = 1.2;
                iconBase = 32;
            }
            else if (t === 'Scorched_Earth') {
                targetIcon = SURF_Icons.CURSED;
                iconScale = 1.2;
                iconBase = 160;
            }
            else if (t === 'Slum_Pavement') {
                targetIcon = SURF_Icons.SLUM;
                iconScale = 2.5;
                iconOffset = { x: 70, y: 100 };
            }
            else if (t === 'Waste') {
                targetIcon = SURF_Icons.WASTE;
                iconBase = 32;
            }
            else if (t === 'Wet_Soil' || t === 'FARM') targetIcon = SURF_Icons.CARROT;
            else if (t === 'Ancient_Timber') targetIcon = SURF_Icons.CABIN;
            else if (t === 'Industrial') targetIcon = SURF_Icons.FACTORY;
            else if (t.includes('Pavement') || t === 'Wall_Block') targetIcon = SURF_Icons.CITY;
            else if (['Water','Sea','Sewage','Glacial'].some(k => t.includes(k))) {
                targetIcon = SURF_Icons.WAVE;
                // 深海使用更深的颜色
                if (t === 'Deep_Sea') {
                    customTint = `rgba(0, 80, 150, ${Math.max(0.4, alpha * 0.6)})`;
                }
            }
            else if (t.includes('Grass') || t === 'Synthetic_Turf') targetIcon = SURF_Icons.PLANT;
            else if (SURF_Icons[t]) targetIcon = SURF_Icons[t];

            if (targetIcon) {
                const baseSize = 80;
                const iconSize = baseSize * iconScale;
                const viewScale = iconSize / iconBase;

                let tintAlpha = isConcave ? 0.25 : 0.4;
                if (elev === 0) tintAlpha = 0.2;
                const drawColor = customTint || hexToRgba(config.fill, alpha * tintAlpha);

                const drawX = x + realS / 2 - iconSize / 2 + iconOffset.x;
                const drawY = y + realS - iconSize - 12 + iconOffset.y;

                ctx.translate(drawX, drawY);
                ctx.scale(viewScale, viewScale);
                ctx.fillStyle = drawColor;
                ctx.fill(targetIcon);
                ctx.restore();
            } else {
                const bH = 6;
                ctx.fillStyle = hexToRgba(config.fill, 0.6 * alpha);
                ctx.fillRect(x + 20, y + realS - 24, realS - 40, bH);
                ctx.restore();
            }
        }

        if (travVal > 0) {
            ctx.save();
            this._drawGridConnections(ctx, gx, gy, px, py, size, (midX, midY) => {
                const strokeW = (travVal === 5) ? 3 : 4;
                const pColor = (travVal === 5)
                    ? "rgba(160, 100, 50, 0.4)"
                    : "rgba(180, 190, 200, 0.5)";
                ctx.strokeStyle = pColor;
                ctx.lineWidth = strokeW;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
            }, "Path");
            ctx.restore();
        }

        this._drawInfrastructure(ctx, gx, gy, px, py, size, infraID, alpha);
        this._drawThreatToken(ctx, x, y, realS, threatVal, alpha);

        if (isHover) {
            ctx.save();
            ctx.strokeStyle = "#3498db";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#3498db";
            ctx.shadowBlur = 5;
            ctx.strokeRect(x, y, realS, realS);
            ctx.restore();
        }
        
        // 移动模式：高亮可达格子
        if (this._movementMode && this._isInMoveRange(gx, gy)) {
            ctx.save();
            const isSelected = this._movementTarget && 
                               this._movementTarget.gx === gx && 
                               this._movementTarget.gy === gy;
            
            if (isSelected) {
                // 选中的目标格子 - 绿色高亮
                ctx.fillStyle = "rgba(46, 204, 113, 0.3)";
                ctx.strokeStyle = "#2ecc71";
                ctx.lineWidth = 3;
            } else {
                // 可达格子 - 蓝色高亮
                ctx.fillStyle = "rgba(52, 152, 219, 0.2)";
                ctx.strokeStyle = "#3498db";
                ctx.lineWidth = 2;
            }
            
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, realS - 4, realS - 4, radius - 2);
            ctx.fill();
            ctx.stroke();
            
            // 添加移动图标
            ctx.fillStyle = isSelected ? "#2ecc71" : "#3498db";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("→", x + realS / 2, y + realS / 2);
            
            ctx.restore();
        }

        ctx.globalAlpha = prevAlpha;
    },

    _drawGridConnections: function(ctx, gx, gy, px, py, size, styleFn, type) {
        const midX = px + size / 2;
        const midY = py + size / 2;
        let n = false, s = false, w = false, e = false;

        if (type === "Path") {
            n = checkPathCon(gx, gy - 1); s = checkPathCon(gx, gy + 1);
            w = checkPathCon(gx - 1, gy); e = checkPathCon(gx + 1, gy);
        }

        ctx.beginPath();
        if (n) { ctx.moveTo(midX, midY); ctx.lineTo(midX, py); }
        if (s) { ctx.moveTo(midX, midY); ctx.lineTo(midX, py + size); }
        if (w) { ctx.moveTo(midX, midY); ctx.lineTo(px, midY); }
        if (e) { ctx.moveTo(midX, midY); ctx.lineTo(px + size, midY); }
        if (!n && !s && !w && !e) {
            ctx.moveTo(midX - 2, midY);
            ctx.lineTo(midX + 2, midY);
        }

        styleFn(midX, midY);
        ctx.stroke();
    },

    _drawThreatToken: function(ctx, x, y, realS, val, alpha) {
        const info = THREAT_MAP[val] || THREAT_MAP[0];
        const cx = x + realS - 16;
        const cy = y + 16;
        const pulse = 1 + Math.sin(Date.now() / 300) * 0.2;
        const radius = info.alert && val >= 4 ? 4 * pulse : 4;

        ctx.save();
        ctx.fillStyle = info.color;
        ctx.shadowColor = info.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    _drawInfrastructure: function(ctx, gx, gy, px, py, size, infraID, alpha) {
        if (!infraID) return;

        const iN = checkInfraCon(gx, gy - 1, infraID);
        const iS = checkInfraCon(gx, gy + 1, infraID);
        const iW = checkInfraCon(gx - 1, gy, infraID);
        const iE = checkInfraCon(gx + 1, gy, infraID);
        const midX = px + size / 2;
        const midY = py + size / 2;

        const pColor = (infraID === 2) ? "#ff4757" : "#ffa502";

        ctx.save();
        ctx.beginPath();
        if (iN) { ctx.moveTo(midX, midY); ctx.lineTo(midX, py); }
        if (iS) { ctx.moveTo(midX, midY); ctx.lineTo(midX, py + size); }
        if (iW) { ctx.moveTo(midX, midY); ctx.lineTo(px, midY); }
        if (iE) { ctx.moveTo(midX, midY); ctx.lineTo(px + size, midY); }
        if (!iN && !iS && !iW && !iE) ctx.arc(midX, midY, 1, 0, Math.PI * 2);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 4;
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.shadowColor = "transparent";
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 6;
        ctx.strokeStyle = pColor;
        ctx.stroke();

        const junctions = (iN ? 1 : 0) + (iS ? 1 : 0) + (iW ? 1 : 0) + (iE ? 1 : 0);
        if (junctions !== 2 || !((iN && iS) || (iW && iE))) {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(midX, midY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    },

    drawEntityLayer: function(ctx, range, S) {
        if(!window.levelData) return;

        const VALID_LAYERS = ["NPC_Actor", "Service", "PlayerStart", "Core_Logic", "Place_Anchor"];
        const minGx = this.anchor.x - range, maxGx = this.anchor.x + range;
        const minGy = this.anchor.y - range, maxGy = this.anchor.y + range;

        const gridBuckets = {};

        window.levelData.layerInstances.forEach(layer => {
            if(!VALID_LAYERS.includes(layer.__identifier)) return;

            layer.entityInstances.forEach(ent => {
                const gx = ent.__grid[0], gy = ent.__grid[1];
                if(gx >= minGx && gx <= maxGx && gy >= minGy && gy <= maxGy) {
                    const key = `${gx},${gy}`;
                    if(!gridBuckets[key]) gridBuckets[key] = [];
                    gridBuckets[key].push({ ent, type: layer.__identifier });
                }
            });
        });

        const SPACING = 52;

        Object.keys(gridBuckets).forEach(key => {
            let stackList = gridBuckets[key];
            stackList.sort((a,b) => (a.type === 'NPC_Actor' ? -1 : 0) - (b.type === 'NPC_Actor' ? -1 : 0));
            if(stackList.length > 4) stackList = stackList.slice(0, 4);

            const [gxStr, gyStr] = key.split(',');
            const gx = parseInt(gxStr, 10);
            const gy = parseInt(gyStr, 10);

            const drawX = (gx - this.anchor.x) * S;
            const drawY = (gy - this.anchor.y) * S;
            const driftBase = Math.sin(Date.now() / 600 + gx * gy) * 3;

            const totalContentH = stackList.length * SPACING;
            let currentY = drawY - (S * 0.25) - (totalContentH * 0.5);

            stackList.forEach(item => {
                this._drawGlassBadge(ctx, drawX, currentY + driftBase, item.ent, item.type);
                currentY += SPACING;
            });
        });
    },

    _drawGlassBadge: function(ctx, x, y, ent, layerName) {
        if(layerName === "NPC_Actor") {
            this._drawNPCBadge(ctx, x, y, ent);
        } else {
            this._drawStandardBadge(ctx, x, y, ent, layerName);
        }
    },

    _drawNPCBadge: function(ctx, x, y, ent) {
        let rawName = ent.__identifier;
        if(ent.fieldInstances[0] && ent.fieldInstances[0].__value) {
            rawName = ent.fieldInstances[0].__value;
        }

        const { name, detail } = parseActorName(rawName);

        let drawAvatar = null;
        let imgKey = name.toLowerCase();
        if(AVATAR_FIXES[imgKey]) imgKey = AVATAR_FIXES[imgKey];

        if(this.imgCache[imgKey] && this.imgCache[imgKey].loaded) {
            drawAvatar = this.imgCache[imgKey].img;
        } else if(!this.imgCache[imgKey]) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            this.imgCache[imgKey] = { loaded: false, img };
            img.onload = () => { this.imgCache[imgKey].loaded = true; };
            img.onerror = () => { this.imgCache[imgKey].img.src = FALLBACK_AVATAR; };
            img.src = `${NPC_BASE_URL}${imgKey}.png`;
        }

        const PLATE_H = 34;
        const BOX_RAD = 4;
        const AVATAR_R = 20;
        const TEXT_PAD_L = 36;

        ctx.font = "800 12px 'Inter', sans-serif";
        const w1 = ctx.measureText(name).width;
        ctx.font = "600 8px monospace";
        const w2 = ctx.measureText(detail || "NPC").width;
        const maxTextW = Math.max(w1, w2);
        const PLATE_W = Math.round(TEXT_PAD_L + maxTextW + 14);

        const PIN_HEIGHT = 12;
        const bx = x - (PLATE_W * 0.4);
        const by = y - PIN_HEIGHT - PLATE_H;
        const cx = bx - 6;
        const cy = by + (PLATE_H / 2);

        ctx.save();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + 10, by + PLATE_H);
        ctx.lineTo(x, y - 2);
        ctx.stroke();

        ctx.fillStyle = "#2ecc71";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = "rgba(33, 40, 50, 0.95)";
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(bx, by, PLATE_W, PLATE_H, BOX_RAD);
        else ctx.rect(bx, by, PLATE_W, PLATE_H);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, cy, AVATAR_R, 0, Math.PI * 2);
        ctx.fillStyle = "#2C3E50";
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, AVATAR_R - 2, 0, Math.PI * 2);
        ctx.clip();
        if(drawAvatar) {
            ctx.drawImage(drawAvatar, cx - AVATAR_R, cy - AVATAR_R, AVATAR_R * 2, AVATAR_R * 2);
        } else {
            ctx.fillStyle = "#555";
            ctx.fill();
        }
        ctx.restore();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#F1C40F";
        ctx.beginPath();
        ctx.arc(cx, cy, AVATAR_R - 1.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px 'Inter', sans-serif";
        ctx.fillText(name, bx + TEXT_PAD_L, by + 12);

        ctx.fillStyle = "#95a5a6";
        ctx.font = "600 8px monospace";
        let renderDetail = detail.length > 20 ? `${detail.substr(0, 18)}..` : detail;
        if(!renderDetail) renderDetail = "ZONE ACTOR";
        ctx.fillText(renderDetail.toUpperCase(), bx + TEXT_PAD_L, by + 24);

        ctx.restore();
    },

    _drawStandardBadge: function(ctx, x, y, ent, layerName) {
        if(layerName === "Default" || layerName === "PlayerStart") return;

        let color = ent.__smartColor || "#333";
        if(layerName === "Core_Logic") color = "#e67e22";

        let dName = (ent.fieldInstances[0]?.__value || ent.__identifier).replace(/_/g, ' ');
        let drawResource = null;
        const upName = dName.toUpperCase();

        if (upName.includes("CAFE")) drawResource = ENTITY_ICONS.CAFE;
        else if (upName.includes("BAR")) drawResource = ENTITY_ICONS.BAR;
        else if (upName.includes("SHOP") || upName.includes("WARES") || upName.includes("STORE") || upName.includes("KIO")) drawResource = ENTITY_ICONS.SHOP;
        else if (upName.includes("PLAZA") || upName.includes("VIEW")) drawResource = ENTITY_ICONS.PLAZA;
        else if (upName.includes("ARCADE") || upName.includes("GAME")) drawResource = ENTITY_ICONS.GAME;
        else if (upName.includes("BED") || upName.includes("REST")) drawResource = ENTITY_ICONS.REST;
        else if (upName.includes("CENTER") || upName.includes("CP")) { drawResource = ENTITY_ICONS.HEAL; color = "#e74c3c"; }
        else if (upName.includes("PC") || upName.includes("TERMINAL")) { drawResource = ENTITY_ICONS.PC; color = "#3498db"; }
        else if (upName.includes("POLICE")) { drawResource = ENTITY_ICONS.POLICE; color = "#34495e"; }
        else if (layerName === "Core_Logic") drawResource = ENTITY_ICONS.WARP;

        ctx.font = "bold 11px sans-serif";
        const txtW = ctx.measureText(dName).width;
        const badgeW = 34 + txtW + 12;
        const badgeH = 28;
        const arrowH = 6;

        const bx = x - badgeW / 2;
        const by = y - badgeH / 2;

        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;

        const r = 5;
        const cxMid = bx + badgeW / 2;
        const botY = by + badgeH;

        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + badgeW - r, by);
        ctx.quadraticCurveTo(bx + badgeW, by, bx + badgeW, by + r);
        ctx.lineTo(bx + badgeW, botY - r);
        ctx.quadraticCurveTo(bx + badgeW, botY, bx + badgeW - r, botY);
        const arrowW = 8;
        ctx.lineTo(cxMid + arrowW / 2, botY);
        ctx.lineTo(cxMid, botY + arrowH);
        ctx.lineTo(cxMid - arrowW / 2, botY);
        ctx.lineTo(bx + r, botY);
        ctx.quadraticCurveTo(bx, botY, bx, botY - r);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = color;
        const pillS = 20;
        const pillX = bx + 4;
        const pillY = by + (badgeH - pillS) / 2;
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(pillX, pillY, pillS, pillS, 4);
        else ctx.rect(pillX, pillY, pillS, pillS);
        ctx.fill();

        if(drawResource) {
            ctx.save();
            ctx.translate(pillX + 1, pillY + 1);
            ctx.fillStyle = "#ffffff";
            ctx.scale(0.75, 0.75);
            ctx.fill(drawResource);
            ctx.restore();
        }

        ctx.fillStyle = "#2c3e50";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(dName, bx + 30, by + badgeH / 2 + 1);

        ctx.restore();
    },

    // 屏幕边缘白晕
    drawVignette: function(ctx) {
        const grd = ctx.createRadialGradient(
            this.w/2, this.h/2, this.h*0.4, 
            this.w/2, this.h/2, this.h*0.9
        );
        grd.addColorStop(0, "rgba(238, 242, 245, 0)");
        grd.addColorStop(1, TACTICAL_STYLE.COLOR_BG);
        ctx.fillStyle = grd;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.fillRect(0,0, this.w, this.h);
    },

    drawSidePanel: function(ctx) {
        if (!this.hoverData) return;
        const d = this.hoverData;
        const width = this.w;
        const isMobile = width < 600;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const threatInfo = THREAT_MAP[d.threat] || THREAT_MAP[0];
        let regionNameDisplay = getIntGridTextName("Regions", d.regionInt) || "WILDERNESS";
        regionNameDisplay = formatZoneName(regionNameDisplay).toUpperCase();
        const regionZoneNameRaw = getEntZoneName('Region_Zone', d.gx, d.gy);
        const regionZoneName = (formatZoneName(regionZoneNameRaw) || "LOCAL GRID").toUpperCase();

        const PADDING = 16;
        const PANEL_W = isMobile ? width - 30 : 320;
        const PANEL_X = isMobile ? 15 : width - PANEL_W - 20;
        const PANEL_Y = 15;

        const HEADER_H = 42;
        const BODY_H = this._infoPanelCollapsed ? 0 : 100;
        const TOTAL_H = HEADER_H + BODY_H + (this._infoPanelCollapsed ? 0 : 10);

        const C_BG = "rgba(255, 255, 255, 0.96)";
        const C_TEXT = "#2d3436";
        const C_SUB = "#b2bec3";
        const C_LINE = "rgba(0,0,0,0.06)";
        const C_ACCENT = threatInfo.color || "#0984e3";

        ctx.save();

        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = C_BG;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(PANEL_X, PANEL_Y, PANEL_W, TOTAL_H, 8);
        else ctx.rect(PANEL_X, PANEL_Y, PANEL_W, TOTAL_H);
        ctx.fill();
        ctx.shadowBlur = 0;

        const STRIPE_W = 6;
        ctx.fillStyle = C_ACCENT;
        ctx.beginPath();
        const stripeY = PANEL_Y + 10;
        const stripeH = HEADER_H - 10;
        if (ctx.roundRect) ctx.roundRect(PANEL_X, stripeY, STRIPE_W, stripeH, [0, 4, 4, 0]);
        else ctx.fillRect(PANEL_X, stripeY, STRIPE_W, stripeH);
        ctx.fill();

        const MAP_CENTER_X = 26; const MAP_CENTER_Y = 26;
        let coordsX = d.gx - MAP_CENTER_X; if (coordsX >= 0) coordsX += 1;
        let coordsY = MAP_CENTER_Y - d.gy - 1; if (coordsY >= 0) coordsY += 1;
        let quad = "?";
        if (coordsX > 0 && coordsY > 0) quad = "S";
        else if (coordsX < 0 && coordsY > 0) quad = "A";
        else if (coordsX < 0 && coordsY < 0) quad = "B";
        else if (coordsX > 0 && coordsY < 0) quad = "N";

        const arrow = this._infoPanelCollapsed ? "▶" : "▼";
        ctx.fillStyle = C_ACCENT;
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const headerMidY = PANEL_Y + (HEADER_H / 2);
        ctx.fillText(arrow, PANEL_X + 18, headerMidY);

        ctx.fillStyle = C_TEXT;
        ctx.font = "700 22px 'Chakra Petch', 'Arial Black', sans-serif";
        const coordText = `[${coordsX}, ${coordsY}]`;
        ctx.fillText(coordText, PANEL_X + 34, headerMidY + 2);

        const cxWidth = ctx.measureText(coordText).width;
        const tagX = PANEL_X + 34 + cxWidth + 8;
        ctx.fillStyle = C_TEXT;
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(tagX, PANEL_Y + 12, 24, 18, 4);
            ctx.fill();
        } else {
            ctx.fillRect(tagX, PANEL_Y + 12, 24, 18);
        }

        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px 'Exo 2', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(quad, tagX + 12, PANEL_Y + 21);

        this._infoPanelHeaderRect = { x: PANEL_X, y: PANEL_Y, w: PANEL_W, h: HEADER_H };

        if (!this._infoPanelCollapsed) {
            const lineY = PANEL_Y + HEADER_H;
            ctx.strokeStyle = C_LINE;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(PANEL_X + 10, lineY);
            ctx.lineTo(PANEL_X + PANEL_W - 10, lineY);
            ctx.stroke();

            const DIVIDER_X = PANEL_X + (PANEL_W * 0.32);
            ctx.beginPath();
            ctx.moveTo(DIVIDER_X, lineY + 10);
            ctx.lineTo(DIVIDER_X, lineY + BODY_H - 10);
            ctx.stroke();

            const leftCtxX = PANEL_X + PADDING;
            const leftLabelY = lineY + 25;
            ctx.fillStyle = C_SUB;
            ctx.font = "800 9px 'Exo 2', sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("SECTOR ASSIGNMENT", leftCtxX, leftLabelY);

            ctx.fillStyle = C_TEXT;
            let fontSize = 24;
            ctx.font = `900 ${fontSize}px 'Exo 2', sans-serif`;
            let rW = ctx.measureText(regionNameDisplay).width;
            const maxW = (DIVIDER_X - leftCtxX) - 10;
            if (rW > maxW) {
                fontSize = fontSize * (maxW / rW);
                ctx.font = `900 ${fontSize}px 'Exo 2', sans-serif`;
            }
            const leftCenterY = lineY + (BODY_H / 2);
            ctx.fillText(regionNameDisplay, leftCtxX, leftCenterY);

            ctx.font = "700 10px 'Chakra Petch', monospace";
            ctx.fillStyle = C_ACCENT;
            ctx.fillText(`STATUS: ${(threatInfo.label || 'ANALYZING').toUpperCase()}`, leftCtxX, lineY + BODY_H - 15);

            const rightCtxX = DIVIDER_X + 12;
            const rowH = 26;
            const startY = lineY + 18;
            const gridW = PANEL_W - (DIVIDER_X - PANEL_X) - 18;
            const colW = gridW / 2;

            const gridData = [
                { k: "BIOME",   v: d.biomeName || "-", c: "#00b894" },
                { k: "INFRA",   v: d.infraText || "NO", c: d.infraText === "YES" ? "#e67e22" : null },
                { k: "SURFACE", v: d.surfaceName || "-" },
                { k: "MOVE",    v: d.travText || "OPEN", c: d.travText !== "OPEN" ? "#ff7675" : null },
                { k: "ZONE",    v: regionZoneName },
                { k: "TUNNEL",  v: d.tunnelText || "NULL", c: "#9b59b6" }
            ];

            gridData.forEach((item, i) => {
                const r = Math.floor(i / 2);
                const c = i % 2;
                const tx = rightCtxX + c * colW;
                const ty = startY + r * rowH;

                ctx.fillStyle = C_SUB;
                ctx.font = "bold 8px 'Exo 2', sans-serif";
                ctx.fillText(item.k, tx, ty);

                ctx.fillStyle = item.c || "#535c68";
                let valFont = 11;
                let valueText = (item.v || "-").toString().toUpperCase();
                let available = colW - 8;
                ctx.font = `700 ${valFont}px 'Chakra Petch', monospace`;
                let textWidth = ctx.measureText(valueText).width;
                while (textWidth > available && valFont > 8) {
                    valFont -= 1;
                    ctx.font = `700 ${valFont}px 'Chakra Petch', monospace`;
                    textWidth = ctx.measureText(valueText).width;
                }
                ctx.fillText(valueText, tx, ty + 12);
            });
        }

        if (typeof this._drawPokemonPanel === 'function') {
            const gap = 12;
            this._drawPokemonPanel(ctx, PANEL_X, PANEL_Y + TOTAL_H + gap, PANEL_W, d);
        }
        
        // 移动模式 UI 提示 - 只在选择目标后显示
        if (this._movementMode && this._movementTarget) {
            this._drawMovementModeUI(ctx);
        }
        
        ctx.restore();
    },
    
    // 绘制移动模式 UI - 右下角弹窗
    _drawMovementModeUI: function(ctx) {
        if (!this._movementTarget) return;
        
        const targetInfo = this._getGridFullInfo(this._movementTarget.gx, this._movementTarget.gy);
        
        // 右下角位置
        const panelW = 280;
        const panelH = 120;
        const padding = 20;
        const horizontalOffset = -50; // pull closer to right edge
        const verticalOffset = 50; // leave room above buttons
        const panelX = ctx.canvas.width - panelW - padding - horizontalOffset;
        const panelY = ctx.canvas.height - panelH - padding - verticalOffset;
        
        ctx.save();
        
        // 斜切变换
        const skewAngle = -0.1;
        ctx.transform(1, 0, skewAngle, 1, 0, 0);
        const adjustedX = panelX - panelY * skewAngle;
        
        // 背景卡片 - 深色玻璃效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 20;
        
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(adjustedX, panelY, panelW, panelH, 6);
        } else {
            ctx.rect(adjustedX, panelY, panelW, panelH);
        }
        ctx.fill();
        ctx.stroke();
        
        // 内部高光
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(adjustedX + 2, panelY + panelH - 2);
        ctx.lineTo(adjustedX + 2, panelY + 2);
        ctx.lineTo(adjustedX + panelW - 2, panelY + 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // 标题栏
        const titleBarH = 32;
        ctx.fillStyle = 'rgba(0, 206, 201, 0.12)';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(adjustedX, panelY, panelW, titleBarH, [6, 6, 0, 0]);
        } else {
            ctx.rect(adjustedX, panelY, panelW, titleBarH);
        }
        ctx.fill();
        
        // 标题
        ctx.fillStyle = '#009dbe';
        ctx.font = "900 11px 'Exo 2', sans-serif";
        ctx.textAlign = 'left';
        ctx.fillText('▶ RELOCATION TARGET', adjustedX + 12, panelY + 20);
        
        // 目标坐标
        ctx.fillStyle = '#111';
        ctx.font = "800 16px 'Chakra Petch', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(`[${targetInfo.displayX}, ${targetInfo.displayY}]`, adjustedX + panelW / 2, panelY + 58);
        
        // 位置信息
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = "600 9px 'Exo 2', sans-serif";
        const locationText = `${targetInfo.region} · ${targetInfo.biome}`;
        ctx.fillText(locationText, adjustedX + panelW / 2, panelY + 74);
        
        // 按钮区域
        const btnW = 110;
        const btnH = 28;
        const btnY = panelY + panelH - btnH - 10;
        const btnGap = 10;
        const totalBtnW = btnW * 2 + btnGap;
        const btnStartX = adjustedX + (panelW - totalBtnW) / 2;
        
        // 确认按钮
        const confirmGradient = ctx.createLinearGradient(btnStartX, btnY, btnStartX + btnW, btnY + btnH);
        confirmGradient.addColorStop(0, '#2ecc71');
        confirmGradient.addColorStop(1, '#27ae60');
        ctx.fillStyle = confirmGradient;
        ctx.shadowColor = 'rgba(39, 174, 96, 0.35)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(btnStartX, btnY, btnW, btnH, 4);
        else ctx.rect(btnStartX, btnY, btnW, btnH);
        ctx.fill();
        
        // 按钮高光
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(btnStartX, btnY + btnH);
        ctx.lineTo(btnStartX, btnY + 2);
        ctx.lineTo(btnStartX + btnW - 2, btnY);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = "800 10px 'Exo 2', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('✓ CONFIRM', btnStartX + btnW / 2, btnY + btnH / 2 + 2);
        
        // 保存确认按钮的实际坐标（未变换）
        this._confirmButtonRect = { 
            x: panelX + (btnStartX - adjustedX), 
            y: btnY, 
            w: btnW, 
            h: btnH 
        };
        
        // 取消按钮
        const cancelX = btnStartX + btnW + btnGap;
        const cancelGradient = ctx.createLinearGradient(cancelX, btnY, cancelX + btnW, btnY + btnH);
        cancelGradient.addColorStop(0, '#ff6b6b');
        cancelGradient.addColorStop(1, '#e84118');
        ctx.fillStyle = cancelGradient;
        ctx.shadowColor = 'rgba(232, 65, 24, 0.35)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(cancelX, btnY, btnW, btnH, 4);
        else ctx.rect(cancelX, btnY, btnW, btnH);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cancelX, btnY + btnH);
        ctx.lineTo(cancelX, btnY + 2);
        ctx.lineTo(cancelX + btnW - 2, btnY);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.fillText('✕ CANCEL', cancelX + btnW / 2, btnY + btnH / 2 + 2);
        
        // 保存取消按钮的实际坐标（未变换）
        this._cancelButtonRect = { 
            x: panelX + (cancelX - adjustedX), 
            y: btnY, 
            w: btnW, 
            h: btnH 
        };
        
        ctx.restore();
    },
    
    // 切换移动模式（从底部按钮调用）
    toggleMovementMode: function() {
        this._movementMode = !this._movementMode;
        this._movementTarget = null;
        console.log('[Tactical] 移动模式:', this._movementMode ? '开启' : '关闭');
    },
    
    // 绘制移动模式按钮 - Ver. Dawn 风格（已废弃，保留用于兼容）
    _drawMovementButtons: function(ctx, panelX, panelY, panelW, panelH) {
        const btnH = 32;
        const btnGap = 10;
        const btnY = panelY + panelH + 180;
        
        // Ver. Dawn 风格按钮绘制函数
        const drawSkewedButton = (x, y, w, h, color, text, isActive = true) => {
            ctx.save();
            
            // 斜切变换
            const skew = 0.15;
            ctx.transform(1, 0, skew, 1, 0, 0);
            const adjustedX = x - y * skew;
            
            // 背景
            if (isActive) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 12;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
            }
            
            // 渐变填充
            const gradient = ctx.createLinearGradient(adjustedX, y, adjustedX + w, y + h);
            if (isActive) {
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, this._adjustColor(color, -20));
            } else {
                gradient.addColorStop(0, '#636e72');
                gradient.addColorStop(1, '#2d3436');
            }
            ctx.fillStyle = gradient;
            
            // 绘制斜切矩形
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(adjustedX, y, w, h, 4);
            } else {
                ctx.rect(adjustedX, y, w, h);
            }
            ctx.fill();
            
            // 高光边缘
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(adjustedX, y + h);
            ctx.lineTo(adjustedX, y + 2);
            ctx.lineTo(adjustedX + w - 2, y);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // 文字
            ctx.fillStyle = isActive ? '#fff' : '#95a5a6';
            ctx.font = "800 11px 'Exo 2', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, adjustedX + w / 2, y + h / 2);
            
            ctx.restore();
        };
        
        if (!this._movementMode) {
            // 显示"移动"和"遭遇战"按钮
            const btnW = 120;
            const totalW = btnW * 2 + btnGap;
            const startX = panelX + (panelW - totalW) / 2;
            
            // RELOCATE 按钮
            drawSkewedButton(startX, btnY, btnW, btnH, '#00cec9', '▶ RELOCATE');
            this._moveButtonRect = { x: startX - 20, y: btnY, w: btnW + 40, h: btnH };
            
            // ENCOUNTER 按钮
            const encounterX = startX + btnW + btnGap;
            drawSkewedButton(encounterX, btnY, btnW, btnH, '#f39c12', '⚔ ENCOUNTER');
            this._encounterButtonRect = { x: encounterX - 20, y: btnY, w: btnW + 40, h: btnH };
            
            this._confirmButtonRect = null;
            this._cancelButtonRect = null;
        } else {
            // 移动模式：显示确认和取消按钮
            const btnW = 90;
            const totalW = btnW * 2 + btnGap;
            const startX = panelX + (panelW - totalW) / 2;
            
            const canConfirm = this._movementTarget !== null;
            
            // 确认按钮
            drawSkewedButton(startX, btnY, btnW, btnH, '#2ecc71', '✓ CONFIRM', canConfirm);
            this._confirmButtonRect = { x: startX - 20, y: btnY, w: btnW + 20, h: btnH };
            
            // 取消按钮
            const cancelX = startX + btnW + btnGap;
            drawSkewedButton(cancelX, btnY, btnW, btnH, '#e74c3c', '✕ CANCEL', true);
            this._cancelButtonRect = { x: cancelX - 20, y: btnY, w: btnW + 20, h: btnH };
            this._moveButtonRect = null;
            
            // 显示移动模式提示
            ctx.save();
            ctx.fillStyle = 'rgba(0, 206, 201, 0.9)';
            ctx.font = "700 10px 'Exo 2', sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText('SELECT TARGET GRID', panelX + panelW / 2, btnY - 12);
            
            if (this._movementTarget) {
                const targetInfo = this._getGridFullInfo(this._movementTarget.gx, this._movementTarget.gy);
                ctx.fillStyle = '#2ecc71';
                ctx.font = "900 12px 'Chakra Petch', monospace";
                ctx.fillText(`TARGET: [${targetInfo.displayX}, ${targetInfo.displayY}]`, panelX + panelW / 2, btnY - 28);
            }
            ctx.restore();
        }
    },
    
    // 颜色调整辅助函数
    _adjustColor: function(hex, amount) {
        let color = hex.replace('#', '');
        if (color.length === 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        }
        const num = parseInt(color, 16);
        let r = Math.min(255, Math.max(0, (num >> 16) + amount));
        let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
    },

    _getSurfaceColor(id, def) {
        // 轻微调整颜色适应白色卡片
        return def || "#ecf0f1";
    },

    // ========== 面板折叠状态 ==========
    _infoPanelCollapsed: false, // 信息面板折叠状态
    _pokemonPanelCollapsed: false, // 宝可梦面板折叠状态
    _pokemonImages: null, // 图片缓存（初始化时创建）
    
    // ========== 移动模式状态 ==========
    _movementMode: false, // 是否处于移动模式
    _movementTarget: null, // 选中的目标格子 { gx, gy }
    _moveButtonRect: null, // 移动按钮区域
    _confirmButtonRect: null, // 确认按钮区域
    _cancelButtonRect: null, // 取消按钮区域
    _encounterButtonRect: null, // 遭遇战按钮区域
    
    // ========== 遭遇战模式状态 ==========
    _encounterPopupVisible: false, // 遭遇战弹窗是否显示
    _encounterPokemonList: [], // 当前格子的宝可梦列表
    
    // 检查格子是否在移动范围内（曼哈顿距离 <= 2）
    _isInMoveRange: function(gx, gy) {
        const dx = Math.abs(gx - this.playerGrid.x);
        const dy = Math.abs(gy - this.playerGrid.y);
        return (dx + dy) <= 2 && (dx + dy) > 0; // 距离1-2，排除当前位置
    },
    
    // 获取当前格子的完整信息（用于比较变更）
    _getGridFullInfo: function(gx, gy) {
        const tags = getZoneInfo(gx, gy);
        const surfaceVal = getIntVal(gx, gy, "Surface") || 0;
        const regionIntVal = getIntVal(gx, gy, "Regions") || 0;
        
        const regionEntity = formatZoneName(tags.region);
        const regionIntName = formatZoneName(getIntGridTextName("Regions", regionIntVal));
        const regionDisplay = regionEntity || regionIntName || (regionIntVal ? `SEC-${regionIntVal}` : "UNDEFINED");
        const biomeDisplay = formatZoneName(tags.biome) || "---";
        const surfaceName = (window.TERRAIN_CONFIG && window.TERRAIN_CONFIG[surfaceVal]?.type) || "VOID";
        
        // 计算显示坐标
        const MAP_CENTER_X = 26, MAP_CENTER_Y = 26;
        let coordsX = gx - MAP_CENTER_X; if (coordsX >= 0) coordsX += 1;
        let coordsY = MAP_CENTER_Y - gy - 1; if (coordsY >= 0) coordsY += 1;
        
        return {
            gx, gy,
            displayX: coordsX,
            displayY: coordsY,
            region: regionDisplay,
            biome: biomeDisplay,
            surface: surfaceName,
            regionZone: formatZoneName(getEntZoneName('Region_Zone', gx, gy)) || "LOCAL GRID"
        };
    },
    
    // 生成移动变更文本
    _generateMoveChangeText: function(fromInfo, toInfo) {
        const lines = [];
        
        // VariableEdit 部分 - 使用正确的 ERA 格式
        lines.push('<VariableEdit>');
        lines.push(`"world_state": {`);
        lines.push(`    "location": {`);
        lines.push(`        "x": ${toInfo.displayX},`);
        lines.push(`        "y": ${toInfo.displayY}`);
        lines.push(`    }`);
        lines.push(`}`);
        lines.push('</VariableEdit>');
        lines.push('');
        
        // 位置变更信息 - AI 提示词部分
        lines.push(`【位置移动】玩家从 [${fromInfo.displayX}, ${fromInfo.displayY}] 移动到了 [${toInfo.displayX}, ${toInfo.displayY}]。`);
        
        // 检查是否有变更
        const changes = [];
        
        if (fromInfo.region !== toInfo.region) {
            const fromRegionInfo = this._getRegionNarrativeInfo(fromInfo.region);
            const toRegionInfo = this._getRegionNarrativeInfo(toInfo.region);
            changes.push(`★ 地区变更: 离开「${fromRegionInfo.name}」，进入「${toRegionInfo.name}」`);
            if (toRegionInfo.prompt) {
                changes.push(`  → ${toRegionInfo.prompt}`);
            }
        }
        if (fromInfo.biome !== toInfo.biome) {
            const fromBiomeInfo = this._getBiomeNarrativeInfo(fromInfo.biome);
            const toBiomeInfo = this._getBiomeNarrativeInfo(toInfo.biome);
            changes.push(`★ 生态区变更: 从「${fromBiomeInfo.name}」进入「${toBiomeInfo.name}」`);
            if (toBiomeInfo.visual) {
                changes.push(`  → ${toBiomeInfo.visual}`);
            }
            if (toBiomeInfo.sensory) {
                changes.push(`  → ${toBiomeInfo.sensory}`);
            }
        }
        if (fromInfo.regionZone !== toInfo.regionZone) {
            const fromZoneInfo = this._getZoneNarrativeInfo(fromInfo.regionZone);
            const toZoneInfo = this._getZoneNarrativeInfo(toInfo.regionZone);
            changes.push(`★ 人文区变更: 离开「${fromZoneInfo.name}」，进入「${toZoneInfo.name}」`);
            if (toZoneInfo.exterior) {
                changes.push(`  → ${toZoneInfo.exterior}`);
            }
        }
        if (fromInfo.surface !== toInfo.surface) {
            changes.push(`★ 地表变更: 从「${fromInfo.surface}」变为「${toInfo.surface}」`);
        }
        
        if (changes.length > 0) {
            lines.push('');
            lines.push('【环境变化】');
            changes.forEach(c => lines.push(c));
        } else {
            lines.push('环境无显著变化，仍在同一区域内移动。');
        }
        
        // 获取目标位置的宝可梦（从 ERA 数据读取）
        const destPokemon = this._getDestinationPokemon(toInfo);
        if (destPokemon && destPokemon.length > 0) {
            lines.push('');
            lines.push('【目标区域宝可梦】');
            destPokemon.forEach(poke => {
                const levelRange = poke.level_range ? ` Lv.${poke.level_range}` : '';
                const rarity = poke.rarity ? ` (${poke.rarity})` : '';
                lines.push(`  • ${poke.name}${levelRange}${rarity}`);
            });
        }
        
        return lines.join('\n');
    },
    
    // 获取地区叙事信息
    _getRegionNarrativeInfo: function(regionKey) {
        const mapInfo = window.mapInfoData;
        if (!mapInfo) return { name: regionKey, prompt: null };
        
        const regions = mapInfo.narrative_layer?.world_atmosphere?.regions || {};
        for (const key in regions) {
            const r = regions[key];
            if (key.toLowerCase().includes(regionKey.toLowerCase()) || 
                (r.display_name && r.display_name.includes(regionKey))) {
                return {
                    name: r.display_name || regionKey,
                    prompt: r.prompt_snippet || null
                };
            }
        }
        return { name: regionKey, prompt: null };
    },
    
    // 获取生态区叙事信息
    _getBiomeNarrativeInfo: function(biomeKey) {
        const mapInfo = window.mapInfoData;
        if (!mapInfo) return { name: biomeKey, visual: null, sensory: null };
        
        const biomes = mapInfo.biome_flavor || {};
        const normalizedKey = biomeKey.replace(/\s+/g, '_');
        
        for (const key in biomes) {
            if (key.toLowerCase() === normalizedKey.toLowerCase() ||
                key.toLowerCase().includes(normalizedKey.toLowerCase())) {
                const b = biomes[key];
                return {
                    name: key.replace(/_/g, ' '),
                    visual: b.visual_texture || null,
                    sensory: b.sensory_feed || null
                };
            }
        }
        return { name: biomeKey, visual: null, sensory: null };
    },
    
    // 获取人文区叙事信息
    _getZoneNarrativeInfo: function(zoneKey) {
        const mapInfo = window.mapInfoData;
        if (!mapInfo) return { name: zoneKey, exterior: null };
        
        const zones = mapInfo.region_zones || {};
        const normalizedKey = zoneKey.replace(/\s+/g, '_');
        
        for (const key in zones) {
            if (key.toLowerCase() === normalizedKey.toLowerCase() ||
                key.toLowerCase().includes(normalizedKey.toLowerCase())) {
                const z = zones[key];
                return {
                    name: key.replace(/_/g, ' '),
                    exterior: z.exterior_view || null
                };
            }
        }
        return { name: zoneKey, exterior: null };
    },
    
    // 获取目标位置的宝可梦（从 ERA 数据读取）
    _getDestinationPokemon: function(toInfo) {
        if (!window.PokemonSpawnCache) {
            console.warn('[Tactical] PokemonSpawnCache 未加载');
            return [];
        }
        
        const locationInfo = {
            gx: toInfo.gx,
            gy: toInfo.gy,
            threat: toInfo.threat || 0,
            surfaceType: toInfo.surface || 'Unknown',
            biomeZone: toInfo.biome || 'Unknown'
        };
        
        const pokemonList = window.PokemonSpawnCache.getForLocation(locationInfo) || [];
        
        // 如果没有数据，返回空数组（不打印警告，因为可能是正常情况）
        if (pokemonList.length === 0) {
            console.log('[Tactical] 目标位置暂无宝可梦数据');
        }
        
        return pokemonList;
    },
    
    // 复制到剪贴板
    _copyToClipboard: function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('[Tactical] 已复制到剪贴板');
            }).catch(err => {
                console.error('[Tactical] 复制失败:', err);
                this._fallbackCopy(text);
            });
        } else {
            this._fallbackCopy(text);
        }
    },
    
    _fallbackCopy: function(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('[Tactical] 已复制到剪贴板 (fallback)');
        } catch (err) {
            console.error('[Tactical] 复制失败:', err);
        }
        document.body.removeChild(textarea);
    },
    
    _getPokemonImageCache: function() {
        if (!this._pokemonImages) {
            this._pokemonImages = {};
        }
        return this._pokemonImages;
    },
    
    _drawPokemonPanel: function(ctx, panelX, panelY, panelW, hoverData) {
        const locationInfo = {
            gx: hoverData.gx,
            gy: hoverData.gy,
            threat: hoverData.threat,
            surfaceType: hoverData.surfaceTypeRaw || hoverData.surfaceName || 'Unknown',
            biomeZone: hoverData.biomeZoneRaw || hoverData.biomeName || 'Unknown'
        };

        let pokemonList = [];
        if (window.PokemonSpawnCache) {
            pokemonList = window.PokemonSpawnCache.getForLocation(locationInfo) || [];
        }

        const threatMap = { 0:'UNKNOWN', 1:'SAFE', 2:'LOW', 3:'MID', 4:'HIGH', 5:'APEX', 6:'PEACE' };
        const isPeace = (hoverData.threat === 6 || hoverData.threat === 0 || hoverData.threat === 1);

        const headerH = 36;
        const itemH = 56;
        const itemGap = 6;
        const shouldExpand = !this._pokemonPanelCollapsed;
        const maxVisibleRows = (pokemonList.length >= 5 && pokemonList.length <= 6) ? 3 : 2;
        const listH = shouldExpand
            ? (pokemonList.length > 0 ? (maxVisibleRows * (itemH + itemGap)) + 20 : 60)
            : 0;
        const totalH = headerH + listH + (shouldExpand ? 10 : 0);

        ctx.fillStyle = TACTICAL_STYLE.CARD_BASE;
        ctx.shadowColor = "rgba(0,0,0,0.05)";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(panelX, panelY, panelW, totalH, 12);
        else ctx.rect(panelX, panelY, panelW, totalH);
        ctx.fill();
        ctx.shadowBlur = 0;

        const arrow = this._pokemonPanelCollapsed ? "▶" : "▼";
        const iconColor = pokemonList.length > 0 ? "#ff7675" : "#55efc4";
        ctx.fillStyle = iconColor;
        ctx.beginPath();
        ctx.arc(panelX + 20, panelY + headerH/2, 3, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = TACTICAL_STYLE.TXT_PRIMARY;
        ctx.font = "900 12px 'Exo 2', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`${arrow}  ENTITY SCAN`, panelX + 30, panelY + headerH/2 + 1);

        const threatLabel = threatMap[hoverData.threat] || "???";
        const threatColor = (THREAT_MAP[hoverData.threat]?.color) || TACTICAL_STYLE.TXT_SECONDARY;
        ctx.font = "900 10px 'Exo 2', sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = threatColor;
        ctx.fillText(`${threatLabel}`, panelX + panelW - 30, panelY + headerH/2 + 1);
        ctx.beginPath();
        ctx.arc(panelX + panelW - 20, panelY + headerH/2, 2, 0, Math.PI*2);
        ctx.fill();

        this._pokemonPanelHeaderRect = { x: panelX, y: panelY, w: panelW, h: headerH };

        if (!shouldExpand) {
            ctx.textAlign = "left";
            return;
        }

        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.beginPath();
        ctx.moveTo(panelX, panelY + headerH);
        ctx.lineTo(panelX + panelW, panelY + headerH);
        ctx.stroke();

        let contentY = panelY + headerH + 10;
        ctx.textAlign = "left";

        if (pokemonList.length === 0) {
            ctx.fillStyle = TACTICAL_STYLE.TXT_SECONDARY;
            ctx.font = "italic 700 12px 'Exo 2', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(isPeace ? "NO HOSTILE SIGNATURES" : "SCAN RETURNS NULL", panelX + panelW/2, contentY + 25);
            ctx.textAlign = "left";
            return;
        }

        const rarityColors = {
            common: "#b2bec3",
            uncommon: "#00b894",
            rare: "#0984e3",
            boss: "#e17055"
        };

        const cols = 2;
        const itemWidth = (panelW - 24 - itemGap) / cols;
        const startX = panelX + 12;

        ctx.save();
        ctx.beginPath();
        ctx.rect(panelX, panelY + headerH, panelW, listH);
        ctx.clip();

        pokemonList.slice(0, 8).forEach((p, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const itemX = startX + col * (itemWidth + itemGap);
            const itemY = contentY + row * (itemH + itemGap);

            ctx.fillStyle = "rgba(0,0,0,0.02)";
            ctx.strokeStyle = "rgba(0,0,0,0.04)";
            ctx.lineWidth = 1;
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(itemX, itemY, itemWidth, itemH, 6);
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fillRect(itemX, itemY, itemWidth, itemH);
                ctx.strokeRect(itemX, itemY, itemWidth, itemH);
            }

            ctx.fillStyle = "#fff";
            ctx.shadowColor = "rgba(0,0,0,0.05)";
            ctx.shadowBlur = 5;
            const size = 40;
            const spriteY = itemY + (itemH - size)/2;
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(itemX + 6, spriteY, size, size, 4);
                ctx.fill();
            } else {
                ctx.fillRect(itemX + 6, spriteY, size, size);
            }
            ctx.shadowBlur = 0;

            this._drawPokemonSprite(ctx, p.id, itemX + 6, spriteY, size);

            const textX = itemX + size + 12;
            const textTop = itemY + 18;

            const pName = p.id.replace(/_/g, ' ').toUpperCase();
            const maxNameWidth = itemWidth - size - 18;
            ctx.fillStyle = TACTICAL_STYLE.TXT_PRIMARY;
            let nameFontSize = 11;
            ctx.font = `900 ${nameFontSize}px 'Exo 2', sans-serif`;
            ctx.textAlign = "left";
            let nameWidth = ctx.measureText(pName).width;
            while (nameWidth > maxNameWidth && nameFontSize > 8) {
                nameFontSize -= 0.5;
                ctx.font = `900 ${nameFontSize}px 'Exo 2', sans-serif`;
                nameWidth = ctx.measureText(pName).width;
            }
            ctx.fillText(pName, textX, textTop);

            const rarityColor = rarityColors[p.rarity] || TACTICAL_STYLE.TXT_SECONDARY;
            ctx.fillStyle = rarityColor;
            ctx.font = "700 8px 'Exo 2', sans-serif";
            ctx.fillText((p.rarity || "---").toUpperCase(), textX, textTop + 11);

            ctx.textAlign = "right";
            ctx.fillStyle = TACTICAL_STYLE.ACCENT_WARN;
            ctx.font = "900 11px 'Chakra Petch', monospace";
            ctx.fillText(`Lv.${p.level}`, itemX + itemWidth - 6, itemY + itemH/2 + 4);
        });

        ctx.restore();

        if (pokemonList.length > 4) {
            const scrollIndicatorY = panelY + totalH - 8;
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.beginPath();
            ctx.arc(panelX + panelW/2 - 8, scrollIndicatorY, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(panelX + panelW/2, scrollIndicatorY, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(panelX + panelW/2 + 8, scrollIndicatorY, 2, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.textAlign = "left";
    },
    
    _drawPokemonSprite: function(ctx, pokemonId, x, y, size) {
        // 参考index.js的完整URL处理逻辑
        const seedIdWithHyphen = pokemonId.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const seedIdCompact = pokemonId.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // 地区形态检测
        const regionalForms = ['alola', 'galar', 'hisui', 'paldea'];
        const isRegionalForm = regionalForms.some(r => seedIdWithHyphen.includes(`-${r}`) || seedIdWithHyphen.endsWith(r));
        
        // 基础ID（去除形态后缀）用于fallback
        let baseId = seedIdCompact;
        for (const r of regionalForms) {
            if (baseId.endsWith(r)) {
                baseId = baseId.slice(0, -r.length);
                break;
            }
        }
        
        // 生成URL
        let imgSrc, fallbackSrc;
        if (isRegionalForm) {
            // 地区形态使用pokesprite
            let pokespriteId = seedIdWithHyphen;
            // 确保格式正确：xxx-alola 而非 xxxalola
            for (const r of regionalForms) {
                if (seedIdCompact.endsWith(r) && !pokespriteId.includes(`-${r}`)) {
                    pokespriteId = baseId + '-' + r;
                    break;
                }
            }
            imgSrc = `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/${pokespriteId}.png`;
            fallbackSrc = `https://play.pokemonshowdown.com/sprites/gen5/${baseId}.png`;
        } else {
            // 普通形态使用Showdown
            imgSrc = `https://play.pokemonshowdown.com/sprites/gen5/${seedIdCompact}.png`;
            fallbackSrc = `https://play.pokemonshowdown.com/sprites/ani/${seedIdCompact}.gif`;
        }
        
        // 检查缓存
        const cache = this._getPokemonImageCache();
        const cacheKey = seedIdCompact;
        
        if (!cache[cacheKey]) {
            const img = new Image();
            img._loadState = 'loading';
            img._triedFallback = false;
            
            img.onload = function() {
                img._loadState = 'loaded';
            };
            
            img.onerror = function() {
                if (!img._triedFallback) {
                    img._triedFallback = true;
                    img.src = fallbackSrc;
                } else {
                    img._loadState = 'failed';
                }
            };
            
            img.src = imgSrc;
            cache[cacheKey] = img;
        }
        
        const img = cache[cacheKey];
        
        // 绘制
        if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, x, y, size, size);
        } else if (img._loadState === 'failed') {
            ctx.fillStyle = "rgba(100,150,255,0.6)";
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(pokemonId.charAt(0).toUpperCase(), x + size/2, y + size/2);
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
        } else {
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("...", x + size/2, y + size/2);
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
        }
    },
    
    // 处理面板点击（折叠/展开）
    handlePanelClick: function(mx, my) {
        // 检查遭遇战按钮
        if (this._encounterButtonRect && !this._movementMode) {
            const r = this._encounterButtonRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._openEncounterPopup();
                return true;
            }
        }
        
        // 检查移动按钮
        if (this._moveButtonRect && !this._movementMode) {
            const r = this._moveButtonRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._movementMode = true;
                this._movementTarget = null;
                console.log('[Tactical] 进入移动模式');
                return true;
            }
        }
        
        // 检查确认按钮
        if (this._confirmButtonRect && this._movementTarget) {
            const r = this._confirmButtonRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._confirmMovement();
                return true;
            }
        }
        
        // 检查取消按钮
        if (this._cancelButtonRect && this._movementMode) {
            const r = this._cancelButtonRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._movementMode = false;
                this._movementTarget = null;
                console.log('[Tactical] 取消移动模式');
                return true;
            }
        }
        
        // 检查信息面板标题栏
        if (this._infoPanelHeaderRect) {
            const r = this._infoPanelHeaderRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._infoPanelCollapsed = !this._infoPanelCollapsed;
                return true;
            }
        }
        
        // 检查宝可梦面板标题栏
        if (this._pokemonPanelHeaderRect) {
            const r = this._pokemonPanelHeaderRect;
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this._pokemonPanelCollapsed = !this._pokemonPanelCollapsed;
                return true;
            }
        }
        
        return false;
    },
    
    // 打开遭遇战弹窗
    _openEncounterPopup: function() {
        // 获取当前格子的宝可梦
        const locationInfo = {
            gx: this.playerGrid.x,
            gy: this.playerGrid.y,
            threat: 0,
            surfaceType: 'Unknown',
            biomeZone: 'Unknown'
        };
        
        if (window.PokemonSpawnCache) {
            this._encounterPokemonList = window.PokemonSpawnCache.getForLocation(locationInfo) || [];
        } else {
            this._encounterPokemonList = [];
        }
        
        if (this._encounterPokemonList.length === 0) {
            // 没有宝可梦时显示提示
            this._showEncounterNotification('当前区域暂无宝可梦', false);
            return;
        }
        
        // 创建遭遇战弹窗
        this._createEncounterPopup();
        
        console.log('[Tactical] 打开遭遇战弹窗，宝可梦数量:', this._encounterPokemonList.length);
    },
    
    // 创建遭遇战弹窗 HTML
    _createEncounterPopup: function() {
        // 移除旧弹窗
        const oldPopup = document.getElementById('encounter-popup');
        if (oldPopup) oldPopup.remove();
        
        // 创建弹窗容器
        const popup = document.createElement('div');
        popup.id = 'encounter-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.98);
            border: 2px solid rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 0;
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            max-height: 70vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 16px 20px;
            font-family: 'Exo 2', sans-serif;
            font-weight: 900;
            font-size: 14px;
            letter-spacing: 1px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>⚔ WILD POKEMON ENCOUNTER</span>
            <button id="encounter-close" style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                transition: background 0.2s;
            ">×</button>
        `;
        
        // 宝可梦列表容器
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        `;
        
        // 生成宝可梦列表
        this._encounterPokemonList.forEach((poke, index) => {
            const item = document.createElement('div');
            item.className = 'encounter-pokemon-item';
            item.dataset.index = index;
            item.style.cssText = `
                background: rgba(243, 156, 18, 0.08);
                border: 2px solid rgba(243, 156, 18, 0.2);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const levelRange = poke.level_range || '??';
            const rarity = poke.rarity || 'common';
            const rarityColors = {
                common: '#95a5a6',
                uncommon: '#3498db',
                rare: '#9b59b6',
                epic: '#e74c3c',
                legendary: '#f39c12'
            };
            const rarityColor = rarityColors[rarity] || '#95a5a6';
            
            item.innerHTML = `
                <div style="flex: 1;">
                    <div style="font-family: 'Chakra Petch', monospace; font-weight: 800; font-size: 16px; color: #2c3e50; margin-bottom: 4px;">
                        ${poke.name}
                    </div>
                    <div style="font-family: 'Exo 2', sans-serif; font-size: 11px; color: rgba(0, 0, 0, 0.6);">
                        Lv.${levelRange} · <span style="color: ${rarityColor}; font-weight: 700;">${rarity.toUpperCase()}</span>
                    </div>
                </div>
                <div style="
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-family: 'Exo 2', sans-serif;
                    font-weight: 800;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                ">
                    BATTLE
                </div>
            `;
            
            // 悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(243, 156, 18, 0.15)';
                item.style.borderColor = 'rgba(243, 156, 18, 0.5)';
                item.style.transform = 'translateX(4px)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'rgba(243, 156, 18, 0.08)';
                item.style.borderColor = 'rgba(243, 156, 18, 0.2)';
                item.style.transform = 'translateX(0)';
            });
            
            // 点击事件
            item.addEventListener('click', () => {
                this._triggerEncounter(poke);
            });
            
            listContainer.appendChild(item);
        });
        
        popup.appendChild(header);
        popup.appendChild(listContainer);
        document.body.appendChild(popup);
        
        // 关闭按钮事件
        document.getElementById('encounter-close').addEventListener('click', () => {
            popup.remove();
        });
        
        // 点击外部关闭
        setTimeout(() => {
            const closeOnOutside = (e) => {
                if (e.target === popup) {
                    popup.remove();
                    document.removeEventListener('click', closeOnOutside);
                }
            };
            document.addEventListener('click', closeOnOutside);
        }, 100);
    },
    
    // 触发遭遇战
    _triggerEncounter: function(pokemon) {
        // 关闭弹窗
        const popup = document.getElementById('encounter-popup');
        if (popup) popup.remove();
        
        // 生成遭遇战提示词
        const encounterText = this._generateEncounterPrompt(pokemon);
        this._copyToClipboard(encounterText);
        
        // 显示通知
        this._showEncounterNotification(`遭遇 ${pokemon.name}！`, true);
        
        console.log('[Tactical] 触发遭遇战:', pokemon.name);
    },
    
    // 生成遭遇战提示词
    _generateEncounterPrompt: function(pokemon) {
        const currentInfo = this._getGridFullInfo(this.playerGrid.x, this.playerGrid.y);
        const levelRange = pokemon.level_range || '??';
        const rarity = pokemon.rarity || 'common';
        
        const lines = [];
        lines.push('【野生宝可梦遭遇】');
        lines.push('');
        lines.push(`玩家在 [${currentInfo.displayX}, ${currentInfo.displayY}] 遭遇了野生宝可梦！`);
        lines.push('');
        lines.push(`▶ 宝可梦: ${pokemon.name}`);
        lines.push(`▶ 等级: Lv.${levelRange}`);
        lines.push(`▶ 稀有度: ${rarity}`);
        lines.push('');
        lines.push(`【当前环境】`);
        lines.push(`地区: ${currentInfo.region}`);
        lines.push(`生态: ${currentInfo.biome}`);
        if (currentInfo.regionZone) lines.push(`区域: ${currentInfo.regionZone}`);
        lines.push(`地表: ${currentInfo.surface}`);
        lines.push('');
        lines.push('战斗即将开始！');
        
        return lines.join('\n');
    },
    
    // 显示遭遇战通知
    _showEncounterNotification: function(message, isSuccess) {
        const old = document.querySelector('.copy-notification');
        if (old) old.remove();
        
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="copy-notif-internal">
                <div class="copy-notif-icon">
                    ${isSuccess ? `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="24" height="24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                        </svg>
                    ` : `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="24" height="24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    `}
                </div>
                <div class="copy-notif-text">
                    <div class="copy-notif-title">${isSuccess ? 'ENCOUNTER TRIGGERED' : 'NO POKEMON'}</div>
                    <div class="copy-notif-desc">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        void notification.offsetWidth;
        requestAnimationFrame(() => notification.classList.add('show'));
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3500);
    },
    
    // 确认移动
    _confirmMovement: function() {
        if (!this._movementTarget) return;
        
        const fromInfo = this._getGridFullInfo(this.playerGrid.x, this.playerGrid.y);
        const toInfo = this._getGridFullInfo(this._movementTarget.gx, this._movementTarget.gy);
        
        const clipboardText = this._generateMoveChangeText(fromInfo, toInfo);
        this._copyToClipboard(clipboardText);
        
        // 显示弹窗通知
        this._showMoveNotification(fromInfo, toInfo);
        
        // 退出移动模式
        this._movementMode = false;
        this._movementTarget = null;
        
        console.log('[Tactical] 移动确认，已复制到剪贴板');
    },
    
    // 显示移动通知弹窗 - 使用 app.js 样式
    _showMoveNotification: function(fromInfo, toInfo) {
        // 移除旧通知
        const old = document.querySelector('.copy-notification');
        if (old) old.remove();
        
        // 检查环境变化
        const changes = [];
        if (fromInfo.region !== toInfo.region) changes.push(`地区: ${toInfo.region}`);
        if (fromInfo.biome !== toInfo.biome) changes.push(`生态: ${toInfo.biome}`);
        if (fromInfo.regionZone !== toInfo.regionZone) changes.push(`区域: ${toInfo.regionZone}`);
        if (fromInfo.surface !== toInfo.surface) changes.push(`地表: ${toInfo.surface}`);
        
        const hasChanges = changes.length > 0;
        const changeDesc = hasChanges ? changes.join(' · ') : '同区域内移动';
        
        // 创建通知元素 - 使用 app.js 的结构
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
                    <div class="copy-notif-title">RELOCATION CONFIRMED</div>
                    <div class="copy-notif-desc">[${fromInfo.displayX}, ${fromInfo.displayY}] → [${toInfo.displayX}, ${toInfo.displayY}]</div>
                    ${hasChanges ? `<div class="copy-notif-desc" style="margin-top: 4px; opacity: 0.8;">${changeDesc}</div>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 强制 reflow
        void notification.offsetWidth;
        
        // 滑入
        requestAnimationFrame(() => notification.classList.add('show'));
        
        // 3.5秒后滑出销毁
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3500);
    },
    
    // 兼容旧方法名
    handlePokemonPanelClick: function(mx, my) {
        return this.handlePanelClick(mx, my);
    }
};

window.TacticalSystem = TacticalSystem;
