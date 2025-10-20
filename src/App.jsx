import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  Text3D, 
  Center,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  Environment,
  Stars,
  Html,
  useProgress,
  Text
} from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Loader component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="loader">
        <div className="loader-bar" style={{ width: `${progress}%` }}></div>
        <p>{progress.toFixed(0)}% chargé</p>
      </div>
    </Html>
  )
}

// Animated 3D Logo
function AnimatedLogo() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(t / 2) / 2
      meshRef.current.rotation.y = Math.sin(t / 3) / 2
      meshRef.current.position.y = Math.sin(t) * 0.1
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={hovered ? "#00ffff" : "#a855f7"}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

// Floating Geometric Shapes
function FloatingShapes() {
  const shapes = []
  const count = 20
  
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 20
    const y = (Math.random() - 0.5) * 20
    const z = (Math.random() - 0.5) * 20
    const scale = Math.random() * 0.5 + 0.2
    const type = Math.floor(Math.random() * 3)
    
    shapes.push({ x, y, z, scale, type, key: i })
  }
  
  return (
    <group>
      {shapes.map((shape) => (
        <FloatingShape key={shape.key} {...shape} />
      ))}
    </group>
  )
}

function FloatingShape({ x, y, z, scale, type }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + x) * 0.001
    }
  })
  
  const geometry = type === 0 ? (
    <boxGeometry args={[scale, scale, scale]} />
  ) : type === 1 ? (
    <sphereGeometry args={[scale * 0.5, 16, 16]} />
  ) : (
    <torusGeometry args={[scale * 0.3, scale * 0.1, 16, 32]} />
  )
  
  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      {geometry}
      <meshStandardMaterial
        color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// Code Particles Component
function CodeParticles() {
  const particlesRef = useRef()
  const count = 100
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Scene
function Scene3D() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* 3D Elements */}
      <AnimatedLogo />
      <FloatingShapes />
      <CodeParticles />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
    </>
  )
}

// Main App Component
function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const containerRef = useRef()
  
  useGSAP(() => {
    // Hero animations
    gsap.from('.hero-title', {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    })
    
    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.8,
      ease: 'power3.out'
    })
    
    gsap.from('.cta-button', {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 1.2,
      ease: 'back.out(1.7)'
    })
    
    // Section animations with ScrollTrigger
    gsap.utils.toArray('.section').forEach((section) => {
      gsap.from(section.querySelector('.section-title'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        },
        opacity: 0,
        y: 100,
        scale: 0.8
      })
    })
    
    // Cards animations
    gsap.utils.toArray('.project-card, .skill-category, .experience-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1
        },
        opacity: 0,
        y: 50,
        rotation: index % 2 === 0 ? -5 : 5,
        scale: 0.9
      })
    })
  }, { scope: containerRef })
  
  const scrollToSection = (section) => {
    setCurrentSection(section)
    setMobileMenuOpen(false)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <div ref={containerRef} className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">Hasan Biçer</div>
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={() => scrollToSection('home')} className={currentSection === 'home' ? 'active' : ''}>
            Accueil
          </button>
          <button onClick={() => scrollToSection('about')} className={currentSection === 'about' ? 'active' : ''}>
            À propos
          </button>
          <button onClick={() => scrollToSection('experience')} className={currentSection === 'experience' ? 'active' : ''}>
            Expérience
          </button>
          <button onClick={() => scrollToSection('projects')} className={currentSection === 'projects' ? 'active' : ''}>
            Projets
          </button>
          <button onClick={() => scrollToSection('skills')} className={currentSection === 'skills' ? 'active' : ''}>
            Compétences
          </button>
          <button onClick={() => scrollToSection('contact')} className={currentSection === 'contact' ? 'active' : ''}>
            Contact
          </button>
        </div>
      </nav>
      
      {/* Hero Section with 3D Canvas */}
      <section id="home" className="hero-section">
        <div className="canvas-container">
          <Canvas shadows>
            <Suspense fallback={<Loader />}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Hasan <span className="gradient-text">Biçer</span>
          </h1>
          <p className="hero-subtitle">
            Technicien Informatique & Développeur Full Stack
          </p>
          <p className="hero-description">
            Spécialisé en IA, Automatisation et Technologies 3D
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => scrollToSection('projects')}>
              Découvrir mes projets
            </button>
            <button className="cta-button secondary" onClick={() => scrollToSection('contact')}>
              Me contacter
            </button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title">À propos de moi</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Fort de plus de <strong>5 ans d'expérience technique</strong>, j'ai évolué de la réparation 
                électronique chez <strong>Apple</strong> vers le support informatique chez <strong>Netz Informatique</strong>, 
                tout en me spécialisant dans le développement web et l'intelligence artificielle.
              </p>
              <p>
                Passionné par l'innovation et les nouvelles technologies, je crée des solutions intelligentes 
                qui combinent <strong>automatisation</strong>, <strong>IA</strong> et <strong>développement web moderne</strong>. 
                Certifié en automatisation avec ChatGPT et Zapier par Vanderbilt University.
              </p>
              <p>
                Mon expertise couvre le <strong>full stack development</strong>, les <strong>technologies 3D</strong> 
                (Three.js, WebGL), et l'intégration d'<strong>intelligence artificielle</strong> dans des applications 
                web interactives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <h2 className="section-title">Expérience Professionnelle</h2>
          <div className="experience-grid">
            <div className="experience-card">
              <div className="experience-header">
                <h3>Technicien Informatique</h3>
                <span className="company">Netz Informatique - CDI</span>
              </div>
              <div className="experience-period">
                Sept. 2023 - Aujourd'hui (2 ans 2 mois)
              </div>
              <div className="experience-location">
                📍 Haguenau, Grand Est, France
              </div>
              <ul className="experience-tasks">
                <li>Maintenance et réparation de systèmes informatiques</li>
                <li>Support technique avancé pour entreprises</li>
                <li>Installation et configuration de réseaux</li>
                <li>Gestion de projets IT</li>
              </ul>
            </div>
            
            <div className="experience-card">
              <div className="experience-header">
                <h3>Technicien Réparateur Électronique</h3>
                <span className="company">Apple - CDI</span>
              </div>
              <div className="experience-period">
                Avr. 2020 - Août 2023 (3 ans 5 mois)
              </div>
              <div className="experience-location">
                📍 Marseille, Provence-Alpes-Côte d'Azur, France
              </div>
              <ul className="experience-tasks">
                <li>Réparation de matériel électronique Apple</li>
                <li>Diagnostic et résolution de problèmes complexes</li>
                <li>Service client de haute qualité</li>
                <li>Formation continue sur les nouvelles technologies</li>
              </ul>
            </div>
          </div>
          
          <div className="certifications">
            <h3 className="certifications-title">🎓 Certifications</h3>
            <div className="certifications-grid">
              <div className="certification-card">
                <h4>ChatGPT + Zapier : Automatisation emails IA</h4>
                <p>Vanderbilt University - Mars 2025</p>
              </div>
              <div className="certification-card">
                <h4>ChatGPT + Zapier : Email vers Excel</h4>
                <p>Vanderbilt University - Mars 2025</p>
              </div>
              <div className="certification-card">
                <h4>ChatGPT + Zapier : Emails intelligents</h4>
                <p>Vanderbilt University - Mars 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="section projects-section">
        <div className="container">
          <h2 className="section-title">Projets Innovants</h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-number">01</div>
              <h3>Portfolio 3D Interactif</h3>
              <p>Site web portfolio avec animations 3D avancées utilisant Three.js et GSAP</p>
              <div className="tech-tags">
                <span>Three.js</span>
                <span>React</span>
                <span>GSAP</span>
                <span>WebGL</span>
              </div>
            </div>
            
            <div className="project-card">
              <div className="project-number">02</div>
              <h3>Système d'Automatisation IA</h3>
              <p>Automatisation d'emails et workflows avec ChatGPT et Zapier</p>
              <div className="tech-tags">
                <span>ChatGPT</span>
                <span>Zapier</span>
                <span>API</span>
                <span>Python</span>
              </div>
            </div>
            
            <div className="project-card">
              <div className="project-number">03</div>
              <h3>Application Full Stack</h3>
              <p>Application web complète avec backend Node.js et frontend React</p>
              <div className="tech-tags">
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
                <span>Express</span>
              </div>
            </div>
            
            <div className="project-card">
              <div className="project-number">04</div>
              <h3>Dashboard Analytics 3D</h3>
              <p>Interface de visualisation de données en temps réel avec graphiques 3D</p>
              <div className="tech-tags">
                <span>Vue.js</span>
                <span>D3.js</span>
                <span>WebSocket</span>
                <span>PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="container">
          <h2 className="section-title">Compétences Techniques</h2>
          
          <div className="skills-categories">
            <div className="skill-category">
              <h3>💻 Langages</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>JavaScript</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>TypeScript</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Python</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>PHP</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>C#</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '80%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Java</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '75%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🎨 Frontend</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>React</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Vue.js</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>HTML5/CSS3</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '98%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Tailwind CSS</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '92%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Bootstrap</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>⚙️ Backend</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>Node.js</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '92%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>ASP.NET</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Laravel</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Symfony</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '82%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Express</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🗄️ Databases</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>MySQL</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>SQL Server</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>MongoDB</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>PostgreSQL</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Oracle</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '80%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🚀 DevOps & Cloud</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>Docker</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Kubernetes</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '82%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>CI/CD</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>AWS</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Azure</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '80%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Google Cloud</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '78%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🛠️ Outils & Technologies</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>Git</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>VS Code</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '98%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Jira</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Confluence</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Figma</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '82%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🎮 3D & Animation</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>Three.js</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '92%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>WebGL</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '85%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>GSAP</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '90%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>React Three Fiber</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Babylon.js</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '80%'}}></div></div>
                </div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>🤖 IA & Automatisation</h3>
              <div className="skills-list">
                <div className="skill-item">
                  <span>ChatGPT API</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Zapier</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '92%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>TensorFlow</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '78%'}}></div></div>
                </div>
                <div className="skill-item">
                  <span>Machine Learning</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: '82%'}}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <h2 className="section-title">Contactez-moi</h2>
          <div className="contact-content">
            <p className="contact-intro">
              Prêt à collaborer sur votre prochain projet ? N'hésitez pas à me contacter !
            </p>
            
            <div className="contact-cards">
              <div className="contact-card france">
                <h3>🇫🇷 France</h3>
                <div className="contact-info">
                  <p><strong>Email:</strong> hasan@bicer.fr</p>
                  <p><strong>Téléphone:</strong> +33 7 49 96 37 07</p>
                  <p><strong>Adresse:</strong> 2 rue des Tulipes, 67500 HAGUENAU</p>
                </div>
              </div>
              
              <div className="contact-card turkey">
                <h3>🇹🇷 Türkiye</h3>
                <div className="contact-info">
                  <p><strong>Email:</strong> hasan@bicer.fr</p>
                  <p><strong>Téléphone:</strong> +90 534 358 94 87</p>
                  <p><strong>Adresse:</strong> Tepeköy Mahallesi, Çengel Çeşme Caddesi No: 44, 59800 Şarköy / Tekirdağ</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <button 
                className="social-button github"
                onClick={() => window.open('https://github.com/BOZYILDIZ', '_blank')}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
              
              <button 
                className="social-button linkedin"
                onClick={() => window.open('https://www.linkedin.com/in/hasan-bi%C3%A7er-0155292a0/', '_blank')}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </button>
              
              <button 
                className="social-button email"
                onClick={() => window.location.href = 'mailto:hasan@bicer.fr'}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
                </svg>
                Email
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Hasan Biçer. Tous droits réservés.</p>
        <p>Conçu avec ❤️ en utilisant React, Three.js & GSAP</p>
      </footer>
    </div>
  )
}

export default App

