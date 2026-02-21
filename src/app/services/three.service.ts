import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {

  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private frameId: number | null = null;

  constructor(private ngZone: NgZone) { }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    console.log(`ThreeService init. Canvas size: ${width}x${height}`);

    if (width === 0 || height === 0) {
      console.warn('Canvas has 0 dimensions! Renderer might be invisible.');
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222); // Slightly darker

    // Camera setup
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000); // Increased far plane
    this.camera.position.z = 4; // Moved back a bit
    this.camera.position.y = 0; // Centered vertically

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2); // Better angle
    this.scene.add(directionalLight);
    
    // Back light to see outline
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-1, 0, -2);
    this.scene.add(backLight);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Start animation loop
    this.animate();
  }

  loadMesh(url: string) {
    console.log('Loading mesh from:', url);
    const loader = new OBJLoader();
    loader.load(url, (object) => {
      console.log('Mesh loaded successfully', object);
      
      this.scene.add(object);

      // Compute bounding box
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      console.log('Mesh size:', size);
      console.log('Mesh center before reset:', center);

      // Center the object
      object.position.x += (object.position.x - center.x);
      object.position.y += (object.position.y - center.y);
      object.position.z += (object.position.z - center.z);

      // Auto-scale to fit in view (target height ~2 units)
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 2 / maxDim;
        object.scale.set(scale, scale, scale);
        console.log('Auto-scaling applied:', scale);
      }

      // Add material
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            color: 0x00ff7f, // Spring Green
            roughness: 0.5,
            metalness: 0.1,
            side: THREE.DoubleSide // Ensure visible from inside if needed
          });
        }
      });

    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened loading the mesh', error);
    });
  }

  resize() {
    if (!this.renderer || !this.camera || !this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        this.frameId = requestAnimationFrame(loop);
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };
      loop();
    });
  }

  /**
   * Draws visual paths (lines) on the mesh based on API response.
   * @param visualPaths Object containing point arrays for each measurement
   */
  drawVisualPaths(visualPaths: { [key: string]: [number, number, number][] }) {
    if (!this.scene) return;

    // Remove existing lines if any
    const existingLines = this.scene.getObjectByName('measurementLines');
    if (existingLines) {
      this.scene.remove(existingLines);
    }

    const linesGroup = new THREE.Group();
    linesGroup.name = 'measurementLines';

    Object.entries(visualPaths).forEach(([key, points]) => {
      if (points && points.length > 0) {
        const vector3Points = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        const geometry = new THREE.BufferGeometry().setFromPoints(vector3Points);
        const material = new THREE.LineBasicMaterial({ 
          color: 0xff0000, 
          linewidth: 2,
          depthTest: false // Render on top of everything
        });
        
        const line = new THREE.LineLoop(geometry, material);
        line.renderOrder = 999; // Ensure it renders on top
        linesGroup.add(line);
      }
    });

    // Try to find the mesh to apply same scaling/positioning
    const model = this.scene.children.find(c => c.type === 'Group' || c.type === 'Object3D');
    if (model) {
      linesGroup.scale.copy(model.scale);
      linesGroup.position.copy(model.position);
      linesGroup.rotation.copy(model.rotation);
    }

    this.scene.add(linesGroup);
  }
}
