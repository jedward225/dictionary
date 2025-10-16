import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Globe3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
        this.createGlobe();
        this.setupControls();
        this.animate();
        this.setupResize();
    }

    init() {
        // 场景初始化
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 2.5;
    }

    createGlobe() {
        // 创建简单的地球点阵，不依赖外部纹理
        const particles = 15000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const radius = 1;

        // 生成球面上的点
        for (let i = 0; i < particles; i++) {
            const phi = Math.acos(-1 + (2 * i) / particles);
            const theta = Math.sqrt(particles * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            // 随机过滤一些点来模拟陆地分布
            if (Math.random() > 0.3) {
                positions.push(x, y, z);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x4d7ea8,
            size: 0.008
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    setupControls() {
        // 添加交互控制
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        this.controls.enableZoom = false; // 禁用缩放
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupResize() {
        // 窗口自适应
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

class SearchHandler {
    constructor() {
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        this.errorPopup = document.getElementById('error-popup');

        // 流行语词典
        this.buzzwords = ["brat", "yyds", "躺平", "内卷"];

        this.init();
    }

    init() {
        this.searchForm.addEventListener('submit', (event) => this.handleSearch(event));
    }

    handleSearch(event) {
        event.preventDefault();
        const searchTerm = this.searchInput.value.trim().toLowerCase();

        if (!searchTerm) return;

        if (this.buzzwords.includes(searchTerm)) {
            window.location.href = `word.html?term=${encodeURIComponent(searchTerm)}`;
        } else {
            this.showErrorPopup();
        }
    }

    showErrorPopup() {
        this.errorPopup.classList.remove('hidden');
        setTimeout(() => {
            this.errorPopup.classList.remove('opacity-0');
        }, 10); // 延迟一点以触发CSS过渡

        setTimeout(() => {
            this.errorPopup.classList.add('opacity-0');
            setTimeout(() => {
                this.errorPopup.classList.add('hidden');
            }, 300);
        }, 3000); // 3秒后自动隐藏
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化3D地球
    new Globe3D('globe-container');

    // 初始化搜索功能
    new SearchHandler();
});