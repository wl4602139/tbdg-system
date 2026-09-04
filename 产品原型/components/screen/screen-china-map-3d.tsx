'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import * as d3 from 'd3-geo'

export interface ParkMarker3D {
  id: string
  name: string
  shortName: string
  province: string
  city: string
  coordinates: [number, number]
  greenRatio: number // 绿电占比 %
  carbonIntensity: number // 碳排放强度 tCO2/万元
  pvCapacityMw: number
  transformerMva: number
  lastYearBuyGwh: number
  thisYearGenGwh: number
  status: '运行中' | '建设中' | '规划中'
  company: string
}

export interface ScreenChinaMap3DProps {
  parks: ParkMarker3D[]
  selectedParkId: string
  onSelectPark: (parkId: string) => void
  onProjectedPos?: (pos: { screenX: number; screenY: number } | null) => void
  className?: string
}

// 跨省绿电输送飞线连接配置
const FLY_LINE_CONNECTIONS = [
  { from: 'xinjiang', to: 'nanjing', label: '疆电入苏绿电特高压通道' },
  { from: 'xinjiang', to: 'xian', label: '西北清洁能源消纳通道' },
  { from: 'xian', to: 'shenbian', label: '特高压换流装备协同' },
  { from: 'xian', to: 'hengyang', label: '华中特高压主网互济' },
  { from: 'baobian', to: 'nanjing', label: '华东区域输配电协同' },
]

export function ScreenChinaMap3D({
  parks,
  selectedParkId,
  onSelectPark,
  onProjectedPos,
  className = '',
}: ScreenChinaMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredPark, setHoveredPark] = useState<ParkMarker3D | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  // 内部 Three.js 状态引用
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    reqId: number
    projection: d3.GeoProjection
    parkObjects: Map<string, { group: THREE.Group; position: THREE.Vector3; height: number }>
    pulseRings: { mesh: THREE.Mesh; maxScale: number; speed: number }[]
    radarSweeps: THREE.Mesh[]
    flyParticles: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number }[]
    isDragging: boolean
    prevMousePos: { x: number; y: number }
    targetRotation: { x: number; y: number }
    currentRotation: { x: number; y: number }
    targetCameraPos: THREE.Vector3
    mapGroup: THREE.Group
  } | null>(null)

  // 初始化与销毁 Three.js 场景
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // 1. 场景
    const scene = new THREE.Scene()

    // 2. 摄像机
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 36, 42)
    camera.lookAt(2, 0, 0)

    // 3. 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 4. 灯光系统
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.5)
    dirLight1.position.set(25, 45, 25)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6)
    dirLight2.position.set(-25, 30, -20)
    scene.add(dirLight2)

    const pointLight = new THREE.PointLight(0x00ffff, 2.0, 90)
    pointLight.position.set(0, 2, 0)
    scene.add(pointLight)

    // 5. 地图根容器
    const mapGroup = new THREE.Group()
    scene.add(mapGroup)

    // 6. 底部深空科技网格与脉冲光环
    const floorGroup = new THREE.Group()
    floorGroup.position.y = -0.6
    mapGroup.add(floorGroup)

    // 环形雷达网格
    for (let r = 15; r <= 45; r += 10) {
      const ringGeo = new THREE.RingGeometry(r - 0.08, r, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.12 - r * 0.002,
        side: THREE.DoubleSide,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = -Math.PI / 2
      floorGroup.add(ringMesh)
    }

    // 底部方形微网格
    const gridHelper = new THREE.GridHelper(100, 36, 0x00b4d8, 0x061e40)
    gridHelper.position.y = -0.05
    const gridMat = gridHelper.material as THREE.LineBasicMaterial
    gridMat.transparent = true
    gridMat.opacity = 0.2
    floorGroup.add(gridHelper)

    // 7. 墨卡托投影算法设置
    const projection = d3.geoMercator().center([104, 35]).scale(52).translate([0, 0])

    const parkObjects = new Map<string, { group: THREE.Group; position: THREE.Vector3; height: number }>()
    const pulseRings: { mesh: THREE.Mesh; maxScale: number; speed: number }[] = []
    const radarSweeps: THREE.Mesh[] = []
    const flyParticles: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number }[] = []

    threeRef.current = {
      scene,
      camera,
      renderer,
      reqId: 0,
      projection,
      parkObjects,
      pulseRings,
      radarSweeps,
      flyParticles,
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      targetRotation: { x: 0, y: 0 },
      currentRotation: { x: 0, y: 0 },
      targetCameraPos: camera.position.clone(),
      mapGroup,
    }

    // 8. 异步加载 GeoJSON 并构建三维立体模型
    fetch('/china.geo.json')
      .then((res) => res.json())
      .then((geoData) => {
        const topMaterial = new THREE.MeshStandardMaterial({
          color: 0x051b3a,
          roughness: 0.35,
          metalness: 0.85,
          emissive: 0x020a1c,
        })

        const sideMaterial = new THREE.MeshStandardMaterial({
          color: 0x09264c,
          roughness: 0.45,
          metalness: 0.75,
          emissive: 0x031228,
        })

        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.85,
        })

        const extrudeSettings = {
          depth: 1.6,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.1,
          bevelThickness: 0.15,
        }

        const chinaMeshGroup = new THREE.Group()

        geoData.features.forEach((feature: any) => {
          const geom = feature.geometry
          if (!geom) return

          const coordinates = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates

          coordinates.forEach((multiPoly: any) => {
            multiPoly.forEach((poly: any, idx: number) => {
              if (idx > 0) return // 暂跳过复杂洞孔以保极速性能

              const shape = new THREE.Shape()
              const linePoints: THREE.Vector3[] = []

              poly.forEach(([lng, lat]: [number, number], pIdx: number) => {
                const projected = projection([lng, lat])
                if (!projected) return
                const [x, y] = projected

                if (pIdx === 0) {
                  shape.moveTo(x, -y)
                } else {
                  shape.lineTo(x, -y)
                }

                linePoints.push(new THREE.Vector3(x, 1.88, y))
              })

              const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
              geometry.rotateX(-Math.PI / 2)

              const mesh = new THREE.Mesh(geometry, [topMaterial, sideMaterial])
              chinaMeshGroup.add(mesh)

              // 晶体发光边缘线
              if (linePoints.length > 2) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)
                const line = new THREE.LineLoop(lineGeo, lineMaterial)
                chinaMeshGroup.add(line)
              }
            })
          })
        })

        mapGroup.add(chinaMeshGroup)
        setLoading(false)

        // 9. 构建各产业园区三维地标与光柱
        buildParkMarkers()

        // 10. 构建绿电输送空间飞线
        buildFlyLines()
      })
      .catch((err) => {
        console.error('Failed to load china.geo.json for 3D map:', err)
        setLoading(false)
      })

    // 构建光柱与雷达地标
    function buildParkMarkers() {
      parks.forEach((park) => {
        const projected = projection(park.coordinates)
        if (!projected) return
        const [x, y] = projected
        const posX = x
        const posZ = y
        const posY = 1.9

        const parkGroup = new THREE.Group()
        parkGroup.position.set(posX, posY, posZ)
        mapGroup.add(parkGroup)

        // 高度依据光伏装机与绿电动态设定
        const pillarHeight = Math.max(4.5, Math.min(8.5, park.pvCapacityMw * 0.12 + 3.0))

        // 颜色映射
        const isCyan = park.greenRatio >= 60 || park.id === 'nanjing'
        const baseColor = isCyan ? 0x00f0ff : 0xf59e0b

        // 外层锥光柱
        const pillarGeo = new THREE.CylinderGeometry(0.12, 0.45, pillarHeight, 16, 1, true)
        pillarGeo.translate(0, pillarHeight / 2, 0)
        const pillarMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
        const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat)
        parkGroup.add(pillarMesh)

        // 核心激光柱
        const coreGeo = new THREE.CylinderGeometry(0.04, 0.04, pillarHeight * 1.15, 8)
        coreGeo.translate(0, (pillarHeight * 1.15) / 2, 0)
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9,
        })
        const coreMesh = new THREE.Mesh(coreGeo, coreMat)
        parkGroup.add(coreMesh)

        // 底部扩散涟漪光环
        const ringGeo = new THREE.RingGeometry(0.3, 1.6, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
        })
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        ringMesh.rotation.x = -Math.PI / 2
        ringMesh.position.y = 0.05
        parkGroup.add(ringMesh)
        pulseRings.push({ mesh: ringMesh, maxScale: 2.2, speed: 0.015 })

        // 旋转雷达扇叶
        const radarGeo = new THREE.CircleGeometry(1.5, 32, 0, Math.PI / 2)
        const radarMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
        const radarMesh = new THREE.Mesh(radarGeo, radarMat)
        radarMesh.rotation.x = -Math.PI / 2
        radarMesh.position.y = 0.06
        parkGroup.add(radarMesh)
        radarSweeps.push(radarMesh)

        // 交互拾取用透明碰撞球
        const hitGeo = new THREE.SphereGeometry(1.8, 8, 8)
        hitGeo.translate(0, 2.0, 0)
        const hitMat = new THREE.MeshBasicMaterial({ visible: false })
        const hitMesh = new THREE.Mesh(hitGeo, hitMat)
        hitMesh.userData = { parkId: park.id }
        parkGroup.add(hitMesh)

        parkObjects.set(park.id, {
          group: parkGroup,
          position: new THREE.Vector3(posX, posY, posZ),
          height: pillarHeight,
        })
      })
    }

    // 构建跨省绿电输送飞线
    function buildFlyLines() {
      FLY_LINE_CONNECTIONS.forEach(({ from, to }) => {
        const pFrom = parks.find((p) => p.id === from)
        const pTo = parks.find((p) => p.id === to)
        if (!pFrom || !pTo) return

        const projFrom = projection(pFrom.coordinates)
        const projTo = projection(pTo.coordinates)
        if (!projFrom || !projTo) return

        const vFrom = new THREE.Vector3(projFrom[0], 2.0, projFrom[1])
        const vTo = new THREE.Vector3(projTo[0], 2.0, projTo[1])

        const dist = vFrom.distanceTo(vTo)
        const midPoint = new THREE.Vector3()
          .addVectors(vFrom, vTo)
          .multiplyScalar(0.5)
        midPoint.y = 2.0 + Math.min(10, Math.max(4, dist * 0.35))

        const curve = new THREE.QuadraticBezierCurve3(vFrom, midPoint, vTo)
        const points = curve.getPoints(50)
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points)

        // 静态半透明底线
        const curveMat = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.22,
        })
        const curveLine = new THREE.Line(curveGeo, curveMat)
        mapGroup.add(curveLine)

        // 流动发光粒子球
        const particleGeo = new THREE.SphereGeometry(0.24, 8, 8)
        const particleMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        })
        const particleMesh = new THREE.Mesh(particleGeo, particleMat)
        mapGroup.add(particleMesh)

        flyParticles.push({
          mesh: particleMesh,
          curve,
          t: Math.random(),
          speed: 0.006 + Math.random() * 0.004,
        })
      })
    }

    // 11. 帧渲染主循环
    const animate = () => {
      threeRef.current!.reqId = requestAnimationFrame(animate)

      const state = threeRef.current!

      // 旋转阻尼插值
      state.currentRotation.x += (state.targetRotation.x - state.currentRotation.x) * 0.06
      state.currentRotation.y += (state.targetRotation.y - state.currentRotation.y) * 0.06
      state.mapGroup.rotation.y = state.currentRotation.y
      state.mapGroup.rotation.x = state.currentRotation.x

      // 脉冲波纹扩展动画
      state.pulseRings.forEach((p) => {
        p.mesh.scale.x += p.speed
        p.mesh.scale.y += p.speed
        const mat = p.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.7 * (1 - (p.mesh.scale.x - 1) / (p.maxScale - 1)))
        if (p.mesh.scale.x >= p.maxScale) {
          p.mesh.scale.set(1, 1, 1)
        }
      })

      // 雷达扇叶旋转
      state.radarSweeps.forEach((r) => {
        r.rotation.z -= 0.04
      })

      // 飞线粒子流动
      state.flyParticles.forEach((fp) => {
        fp.t += fp.speed
        if (fp.t > 1) fp.t = 0
        const pt = fp.curve.getPoint(fp.t)
        fp.mesh.position.copy(pt)
      })

      // 选中项三维屏幕坐标实时反向投影
      if (onProjectedPos) {
        const selectedObj = state.parkObjects.get(selectedParkId)
        if (selectedObj) {
          const worldPos = selectedObj.position.clone()
          worldPos.y += selectedObj.height + 0.4
          worldPos.applyMatrix4(state.mapGroup.matrixWorld)
          worldPos.project(state.camera)

          const screenX = ((worldPos.x + 1) * container.clientWidth) / 2
          const screenY = ((-worldPos.y + 1) * container.clientHeight) / 2
          onProjectedPos({ screenX, screenY })
        }
      }

      state.renderer.render(state.scene, state.camera)
    }

    animate()

    // 12. 交互事件绑定：鼠标悬停、拖拽微调视角与点击
    const handleMouseDown = (e: MouseEvent) => {
      threeRef.current!.isDragging = true
      threeRef.current!.prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const state = threeRef.current!
      if (!state) return

      // 拖拽微旋转
      if (state.isDragging) {
        const deltaX = e.clientX - state.prevMousePos.x
        const deltaY = e.clientY - state.prevMousePos.y
        state.targetRotation.y += deltaX * 0.004
        state.targetRotation.x = Math.max(-0.25, Math.min(0.2, state.targetRotation.x + deltaY * 0.003))
        state.prevMousePos = { x: e.clientX, y: e.clientY }
        return
      }

      // Raycaster 悬停检测
      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), state.camera)

      const hitMeshes: THREE.Object3D[] = []
      state.parkObjects.forEach(({ group }) => {
        group.children.forEach((c) => {
          if (c.userData && c.userData.parkId) hitMeshes.push(c)
        })
      })

      const intersects = raycaster.intersectObjects(hitMeshes)
      if (intersects.length > 0) {
        const hitParkId = intersects[0].object.userData.parkId
        const park = parks.find((p) => p.id === hitParkId)
        if (park) {
          setHoveredPark(park)
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          container.style.cursor = 'pointer'
          return
        }
      }

      setHoveredPark(null)
      container.style.cursor = 'default'
    }

    const handleMouseUp = () => {
      if (threeRef.current) threeRef.current.isDragging = false
    }

    const handleClick = (e: MouseEvent) => {
      const state = threeRef.current
      if (!state) return

      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), state.camera)

      const hitMeshes: THREE.Object3D[] = []
      state.parkObjects.forEach(({ group }) => {
        group.children.forEach((c) => {
          if (c.userData && c.userData.parkId) hitMeshes.push(c)
        })
      })

      const intersects = raycaster.intersectObjects(hitMeshes)
      if (intersects.length > 0) {
        const hitParkId = intersects[0].object.userData.parkId
        onSelectPark(hitParkId)
      }
    }

    // 窗口尺寸自适应 Resize
    const handleResize = () => {
      if (!container || !threeRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      threeRef.current.camera.aspect = w / h
      threeRef.current.camera.updateProjectionMatrix()
      threeRef.current.renderer.setSize(w, h)
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    // 销毁清理
    return () => {
      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.reqId)
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [parks, onSelectPark, onProjectedPos])

  return (
    <div ref={containerRef} className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020817]/80 backdrop-blur-sm z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-primary animate-pulse tracking-widest">
              三维 WebGL 数字孪生引擎加载中...
            </span>
          </div>
        </div>
      )}

      {/* 悬停气泡提示 */}
      {hoveredPark && tooltipPos && (
        <div
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 48 }}
          className="pointer-events-none absolute z-40 rounded-lg border border-primary/40 bg-[#081a30]/95 px-3 py-2 shadow-2xl backdrop-blur-md text-xs space-y-1"
        >
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            {hoveredPark.name}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
            <span>装机: <span className="text-amber-400 font-bold">{hoveredPark.pvCapacityMw} MW</span></span>
            <span>绿电: <span className="text-emerald-400 font-bold">{hoveredPark.greenRatio}%</span></span>
            <span>状态: <span className="text-primary">{hoveredPark.status}</span></span>
          </div>
        </div>
      )}
    </div>
  )
}
