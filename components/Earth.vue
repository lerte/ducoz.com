<template>
  <div id="three" class="h-96"></div>
</template>

<script>
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Scene, WebGLRenderer, PerspectiveCamera, AmbientLight } from 'three'

export default {
  name: 'Earth',
  data: () => ({
    container: null,
    width: 0,
    height: 0,
    scene: null,
    camera: null,
    renderer: null,
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
      this.camera.position.set(
        -3.29362652781052,
        -3.2940674785692496,
        201.2736616916079
      )
      this.camera.updateProjectionMatrix()
      this.scene = new Scene()

      const loader = new FBXLoader()
      loader.load(
        'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/63d940c9a1ac9f2d382d6552/63f71a4b3d87683896800a4b',
        (object) => {
          this.mesh = object
          this.scene.add(this.mesh)
        }
      )

      const ambientLight = new AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)

      this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setClearColor(0xffffff, 0)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.width, this.height)
      this.renderer.shadowMap.enabled = true
      this.container.appendChild(this.renderer.domElement)

      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
      this.renderer.setSize(this.width, this.height)
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
    },
    render() {
      requestAnimationFrame(this.render)
      this.camera.updateProjectionMatrix()
      // this.controls.update()
      if (this.mesh) {
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
        this.mesh.rotation.z += 0.01
      }
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
