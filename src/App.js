import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import GLB from "./Lock2.glb"

const state = proxy({
  current: null,
  items: {
    fingerPrint: "#0096EB",
    padLock: "#F7F7F7",
    shackle: "#ffffff",
  },
})

const closeShackle = (shackle, lock) => {
  if (lock.current.rotation.y > -1.5) {
    lock.current.rotation.y = lock.current.rotation.y - 0.05
  }
  if (shackle.current.position.y > 1.23 && lock.current.rotation.y < 2.4) {
    shackle.current.position.y = shackle.current.position.y - 0.01
  }
}

const openShackleSuccess = (shackle, lock) => {
  if (lock.current.rotation.y < 4.7) {
    lock.current.rotation.y = lock.current.rotation.y + 0.05
  }
  if (shackle.current.position.y < 1.65 && lock.current.rotation.y > 2.1) {
    shackle.current.position.y = shackle.current.position.y + 0.008
  }
}

function PadLock({ open, toggleOpen }) {
  const ref = useRef()
  const shackle = useRef()
  const snap = useSnapshot(state)
  const lock = useGLTF(GLB)
  const { nodes: lockNodes, materials: lockMaterials } = lock

  useFrame(() => {
    if (open) closeShackle(shackle, ref)
  })

  useFrame(() => {
    if (!open) openShackleSuccess(shackle, ref)
  })

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        toggleOpen()
      }}
      ref={ref}
      dispose={null}
      position={[0, -0.4, -0.5]}
      rotation={[0.1, -1, 0.1]}>
      <mesh
        receiveShadow
        castShadow
        geometry={lockNodes.Cube.geometry}
        position={[0, 0, 0]}
        material={lockMaterials.White}
        // material-color={snap.items.padLock}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={lockNodes.BezierCurve002.geometry}
          material={lockMaterials["Blue Logo 01"]}
          // material-color={snap.items.fingerPrint}
          position={[0.29, 0.02, -0.02]}
          scale={[0.98, 0.9, 0.9]}
        />
        <mesh
          ref={shackle}
          receiveShadow
          castShadow
          geometry={lockNodes.Cube001.geometry}
          material={lockMaterials.Metal}
          position={[0, 1.23, -0.01]}
          material-color={snap.items.shackle}
        />
      </mesh>
    </group>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }} color="#ffffff">
        <ambientLight intensity={1} />
        <spotLight intensity={1} color="#ffffff" angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Suspense fallback={null}>
          <PadLock open={open} toggleOpen={() => setOpen((prev) => !prev)} />
          <Environment preset="studio"></Environment>
          <ContactShadows position={[0, -1.4, 0]} opacity={0.3} scale={10} blur={1.5} far={1.4} />
        </Suspense>
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  )
}
