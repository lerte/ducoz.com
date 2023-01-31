<template>
  <div id="three" class="h-96"></div>
</template>

<script>
import { Scene, WebGLRenderer, PMREMGenerator, PerspectiveCamera } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'

export default {
  name: 'Earth',
  data: () => ({
    container: null,
    width: 0,
    height: 0,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    mesh: null
  }),
  mounted() {
    this.init()
    this.render()
  },
  methods: {
    init() {
      this.container = document.getElementById('three')
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
      const aspect = this.width / this.height
      this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
      this.camera.position.set(0, 0, 3.5)
      this.camera.updateProjectionMatrix()
      this.scene = new Scene()

      const loader = new FBXLoader()
      loader.load('/earth.fbx', (object) => {
        this.mesh = object
        this.scene.add(this.mesh)
      })

      this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setClearColor(0xffffff, 0)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.width, this.height)
      this.renderer.shadowMap.enabled = true
      this.container.appendChild(this.renderer.domElement)

      const pmremGenerator = new PMREMGenerator(this.renderer)
      pmremGenerator.compileEquirectangularShader()
      this.scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enablePan = false

      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
    },
    render() {
      requestAnimationFrame(this.render)
      this.camera.updateProjectionMatrix()
      this.controls.update()
      if (this.mesh) {
        this.mesh.rotation.y += 0.01
        this.mesh.rotation.z += 0.01
      }
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
