import { fa_comment, fa_paper_plane, fa_street_view, fa_shirt, fa_camera_retro, fa_info_circle, fa_xmark } from './icons.js';
import { showMessage, i18n } from './message.js';
class ToolsManager {
    constructor(model, config, tips) {
        this.config = config;
        this.tools = {
            hitokoto: {
                icon: fa_comment,
                callback: async () => {
                    const response = await fetch('https://v1.hitokoto.cn');
                    const result = await response.json();
                    const template = tips.message.hitokoto;
                    const text = i18n(template, result.from, result.creator);
                    showMessage(result.hitokoto, 6000, 9);
                    setTimeout(() => {
                        showMessage(text, 4000, 9);
                    }, 6000);
                }
            },
            asteroids: {
                icon: fa_paper_plane,
                callback: () => {
                    if (window.Asteroids) {
                        if (!window.ASTEROIDSPLAYERS)
                            window.ASTEROIDSPLAYERS = [];
                        window.ASTEROIDSPLAYERS.push(new window.Asteroids());
                    }
                    else {
                        const script = document.createElement('script');
                        script.src =
                            'https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js';
                        document.head.appendChild(script);
                    }
                }
            },
            'switch-model': {
                icon: fa_street_view,
                callback: () => model.loadNextModel()
            },
            'switch-texture': {
                icon: fa_shirt,
                callback: () => {
                    let successMessage = '', failMessage = '';
                    if (tips) {
                        successMessage = tips.message.changeSuccess;
                        failMessage = tips.message.changeFail;
                    }
                    model.loadRandTexture(successMessage, failMessage);
                }
            },
            photo: {
                icon: fa_camera_retro,
                callback: () => {
                    const message = tips.message.photo;
                    showMessage(message, 6000, 9);
                    const canvas = document.getElementById('live2d');
                    if (!canvas)
                        return;
                    const imageUrl = canvas.toDataURL();
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = imageUrl;
                    link.download = 'live2d-photo.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            },
            info: {
                icon: fa_info_circle,
                callback: () => {
                    open('https://github.com/stevenjoezhang/live2d-widget');
                }
            },
            quit: {
                icon: fa_xmark,
                callback: () => {
                    localStorage.setItem('waifu-display', Date.now().toString());
                    const message = tips.message.goodbye;
                    showMessage(message, 2000, 11);
                    const waifu = document.getElementById('waifu');
                    if (!waifu)
                        return;
                    waifu.classList.remove('waifu-active');
                    setTimeout(() => {
                        waifu.classList.add('waifu-hidden');
                        const waifuToggle = document.getElementById('waifu-toggle');
                        waifuToggle === null || waifuToggle === void 0 ? void 0 : waifuToggle.classList.add('waifu-toggle-active');
                    }, 3000);
                }
            }
        };
    }
    registerTools() {
        var _b;
        if (!Array.isArray(this.config.tools)) {
            this.config.tools = Object.keys(this.tools);
        }
        for (const toolName of this.config.tools) {
            if (this.tools[toolName]) {
                const { icon, callback } = this.tools[toolName];
                const element = document.createElement('span');
                element.id = `waifu-tool-${toolName}`;
                element.innerHTML = icon;
                (_b = document
                    .getElementById('waifu-tool')) === null || _b === void 0 ? void 0 : _b.insertAdjacentElement('beforeend', element);
                element.addEventListener('click', callback);
            }
        }
    }
}
export { ToolsManager };
