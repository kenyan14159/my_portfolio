"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  ChevronLeft,
  ChevronRight,
  Trophy,
  ArrowUpRight,
  Instagram,
  Twitter,
  X,
  ArrowDown,
  Timer
} from "lucide-react";
import Lenis from "lenis";
import * as THREE from "three";
import gsap from "gsap";

// ========================================
// Lenisスムーススクロール
// ========================================
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

// ========================================
// Three.js パーティクル背景
// ========================================
function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // パーティクル作成
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
      
      // オレンジ〜白のグラデーション
      const isOrange = Math.random() > 0.7;
      if (isOrange) {
        colorsArray[i] = 0.98;     // R
        colorsArray[i + 1] = 0.45; // G
        colorsArray[i + 2] = 0.09; // B
      } else {
        colorsArray[i] = 0.4;
        colorsArray[i + 1] = 0.4;
        colorsArray[i + 2] = 0.4;
      }
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // マウス移動
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // リサイズ
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;
      
      // マウス追従
      particlesMesh.rotation.x += mouseRef.current.y * 0.0005;
      particlesMesh.rotation.y += mouseRef.current.x * 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}

// ========================================
// テキストスプリットアニメーション
// ========================================
function SplitText({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }`}
            style={{
              transitionDelay: `${delay + index * 30}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 磁気ボタン
// ========================================
function MagneticButton({ 
  children, 
  href,
  className = "",
  external = false
}: { 
  children: React.ReactNode; 
  href: string;
  className?: string;
  external?: boolean;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </a>
  );
}

// ========================================
// パララックスセクション
// ========================================
function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: React.ReactNode; 
  speed?: number;
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed * 0.1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div 
      ref={sectionRef} 
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

// ========================================
// 自己ベストタイム表示（ランニングテーマUI）
// ========================================
function PersonalBestTimes() {
  const { ref, isInView } = useInView();
  const [animatedTimes, setAnimatedTimes] = useState({
    fiveK: "00:00.00",
    tenK: "00:00.00",
    half: "0:00:00"
  });

  const times = [
    { event: "5000m", time: "13'56\"57", animatedKey: "fiveK", targetTime: "13:56.57" },
    { event: "10000m", time: "28'31\"64", animatedKey: "tenK", targetTime: "28:31.64" },
    { event: "HALF MARATHON", time: "1:03'58", animatedKey: "half", targetTime: "1:03:58" },
  ];

  useEffect(() => {
    if (isInView) {
      // 5000mのアニメーション
      let count5k = 0;
      const interval5k = setInterval(() => {
        count5k += 0.47;
        if (count5k >= 13.94) {
          setAnimatedTimes(prev => ({ ...prev, fiveK: "13:56.57" }));
          clearInterval(interval5k);
        } else {
          const mins = Math.floor(count5k);
          const secs = ((count5k - mins) * 60).toFixed(2);
          setAnimatedTimes(prev => ({ ...prev, fiveK: `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}` }));
        }
      }, 50);

      // 10000mのアニメーション
      let count10k = 0;
      const interval10k = setInterval(() => {
        count10k += 0.95;
        if (count10k >= 28.53) {
          setAnimatedTimes(prev => ({ ...prev, tenK: "28:31.64" }));
          clearInterval(interval10k);
        } else {
          const mins = Math.floor(count10k);
          const secs = ((count10k - mins) * 60).toFixed(2);
          setAnimatedTimes(prev => ({ ...prev, tenK: `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}` }));
        }
      }, 50);

      // ハーフのアニメーション
      let countHalf = 0;
      const intervalHalf = setInterval(() => {
        countHalf += 2.1;
        if (countHalf >= 63.97) {
          setAnimatedTimes(prev => ({ ...prev, half: "1:03:58" }));
          clearInterval(intervalHalf);
        } else {
          const hours = Math.floor(countHalf / 60);
          const mins = Math.floor(countHalf % 60);
          const secs = Math.floor((countHalf - Math.floor(countHalf)) * 60);
          setAnimatedTimes(prev => ({ ...prev, half: `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` }));
        }
      }, 50);

      return () => {
        clearInterval(interval5k);
        clearInterval(interval10k);
        clearInterval(intervalHalf);
      };
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      {/* トラックを模したデザイン */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {times.map((item, index) => (
          <div
            key={item.event}
            className={`relative p-6 lg:p-8 border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm group hover:border-orange-500/50 transition-all duration-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-zinc-500 font-mono tracking-wider">PERSONAL BEST</span>
            </div>
            
            <p className="text-sm text-zinc-400 mb-2">{item.event}</p>
            <p className="text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight group-hover:text-orange-500 transition-colors">
              {isInView ? animatedTimes[item.animatedKey as keyof typeof animatedTimes] : "00:00.00"}
            </p>
            
            {/* プログレスバー風 */}
            <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000 ease-out ${
                  isInView ? "w-full" : "w-0"
                }`}
                style={{ transitionDelay: `${index * 200 + 500}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// ナビゲーション
// ========================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      const sections = ["about", "records", "career", "works", "gallery", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // メニューが開いているときはスクロールを無効化
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: "#about", label: "01 ABOUT" },
    { href: "#records", label: "02 RECORDS" },
    { href: "#career", label: "03 CAREER" },
    { href: "#works", label: "04 WORKS" },
    { href: "#gallery", label: "05 GALLERY" },
    { href: "#contact", label: "06 CONTACT" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/80 backdrop-blur-xl" : "bg-transparent"
      }`}>
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          <a href="#" className="text-white font-bold text-xl tracking-tighter relative z-50">
            SHOTARO<span className="text-orange-500">.</span>
          </a>
          
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-xs font-medium tracking-widest transition-colors relative group ${
                  activeSection === item.href.slice(1) ? "text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-orange-500 transition-all duration-300 ${
                  activeSection === item.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <span className="text-xs text-zinc-500 font-mono">{time} JST</span>
            <MagneticButton
              href="#contact"
              className="px-4 py-2 text-xs font-bold text-black bg-white rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              CONTACT
            </MagneticButton>
          </div>

          <button 
            className="lg:hidden text-white relative z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <div className={`w-6 h-px bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <div className={`w-4 h-px bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-6 h-px bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* モバイルメニューオーバーレイ */}
      <div className={`fixed inset-0 z-40 bg-black transition-transform duration-500 ease-in-out lg:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-orange-500 transition-colors"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-8">
             <MagneticButton
                href="#contact"
                className="px-8 py-4 text-sm font-bold text-black bg-white rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                CONTACT
              </MagneticButton>
          </div>
        </div>
      </div>
    </>
  );
}

// ========================================
// マーキーテキスト
// ========================================
function MarqueeText({ text, speed = 20, reverse = false }: { text: string; speed?: number; reverse?: boolean }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4">
      <div className={`inline-flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`} style={{ animationDuration: `${speed}s` }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[12vw] lg:text-[10vw] font-bold text-transparent stroke-text mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========================================
// ギャラリー画像データ
// ========================================
const galleryImages = [
  { src: "/shotaro-img1.JPG", alt: "競技写真1" },
  { src: "/shotaro-img2.JPG", alt: "競技写真2" },
  { src: "/shotaro-img3.JPG", alt: "競技写真3" },
  { src: "/shotaro-img4.JPG", alt: "競技写真4" },
  { src: "/shotaro-img5.jpg", alt: "競技写真5" },
  { src: "/shotaro-img6.JPEG", alt: "競技写真6" },
  { src: "/shotaro-img7.JPG", alt: "競技写真7" },
  { src: "/shotaro-img9.JPG", alt: "競技写真9" },
  { src: "/shotaro-img10.JPG", alt: "競技写真10" },
  { src: "/shotaro-img11.JPG", alt: "競技写真11" },
  { src: "/shotaro-img12.JPG", alt: "競技写真12" },
];

// ========================================
// ギャラリー（グリッド表示）
// ========================================
function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);
  
  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 lg:px-12">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => openModal(index)}
            className="group relative aspect-square overflow-hidden cursor-pointer bg-zinc-900"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium tracking-widest">VIEW</span>
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 p-2 text-white hover:text-orange-500 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 lg:left-12 p-2 text-white hover:text-orange-500 transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div 
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 lg:right-12 p-2 text-white hover:text-orange-500 transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </>
  );
}

// ========================================
// スクロールアニメーション用フック
// ========================================
function useInView() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// ========================================
// アニメーション付きセクションタイトル
// ========================================
function SectionTitle({ number, title }: { number: string; title: string }) {
  const { ref, isInView } = useInView();
  
  return (
    <div ref={ref} className="mb-16 lg:mb-24 overflow-hidden">
      <div className={`flex items-end gap-4 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
        <span className="text-orange-500 font-mono text-sm">{number}</span>
        <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tighter">
          {title}
        </h2>
      </div>
      <div className={`h-px bg-zinc-800 mt-6 transition-all duration-1000 delay-300 ${isInView ? "w-full" : "w-0"}`} />
    </div>
  );
}

// ========================================
// タイムラインアイテム
// ========================================
function TimelineItem({ 
  period, 
  title, 
  achievements,
  index
}: { 
  period: string; 
  title: string; 
  achievements: string[];
  index: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <div 
      ref={ref}
      className={`grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-12 pb-12 border-b border-zinc-800 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div>
        <span className="inline-block px-4 py-2 text-sm font-bold bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/30">
          {period}
        </span>
      </div>
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">{title}</h3>
        <ul className="space-y-3">
          {achievements.map((achievement, idx) => (
            <li key={idx} className="flex items-start gap-3 text-zinc-400">
              <Trophy className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ========================================
// 実績カード
// ========================================
function WorkCard({ 
  title, 
  description, 
  link,
  index
}: { 
  title: string; 
  description: string; 
  link?: string;
  index: number;
}) {
  const { ref, isInView } = useInView();

  const Content = () => (
    <div className="p-6 lg:p-8 border border-zinc-800 hover:border-orange-500/50 transition-colors duration-500 bg-zinc-950 h-full relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs text-orange-500 font-mono">0{index + 1}</span>
          {link && (
            <div className="p-2 border border-zinc-800 group-hover:border-orange-500 group-hover:bg-orange-500 transition-all duration-300 rounded-full">
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
          )}
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-zinc-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref as any}
        className={`group relative block transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <Content />
      </a>
    );
  }

  return (
    <div 
      ref={ref}
      className={`group relative transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Content />
    </div>
  );
}

// ========================================
// お問い合わせフォーム
// ========================================
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
    `.trim();
    
    const mailtoLink = `mailto:info@shotaro.dev?subject=Contact from Portfolio&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-xs text-zinc-500 font-bold tracking-wider">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-orange-500 text-white px-4 py-3 outline-none transition-colors"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs text-zinc-500 font-bold tracking-wider">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-orange-500 text-white px-4 py-3 outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-xs text-zinc-500 font-bold tracking-wider">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-orange-500 text-white px-4 py-3 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-xs text-zinc-500 font-bold tracking-wider">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-orange-500 text-white px-4 py-3 outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold text-sm tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-300"
      >
        Send Message
      </button>
    </form>
  );
}

// ========================================
// メインコンポーネント
// ========================================
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Lenisスムーススクロールを有効化
  useLenis();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />

      {/* ========== FIRST VIEW ========== */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Three.js パーティクル背景 */}
        <ParticleBackground />
        
        {/* 背景グラデーション */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.1),transparent_50%)]" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/shotaro-img2.JPG')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 px-6 lg:px-12 pt-32 lg:pt-0">
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* ラベル */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-orange-500" />
              <span className="text-xs font-medium tracking-[0.3em] text-zinc-500">ENGINEER × HAKONE EKIDEN RUNNER</span>
            </div>

            {/* 名前（スプリットアニメーション） */}
            <h1 className="text-[15vw] lg:text-[12vw] font-bold leading-[0.85] tracking-tighter mb-8">
              <SplitText text="SHOTARO" className="block text-white" delay={500} />
              <SplitText text="FUTAMURA" className="block text-transparent stroke-text-white" delay={800} />
            </h1>

            {/* サブテキスト */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
              <ParallaxSection speed={0.3} className="max-w-md">
                <p className="text-lg lg:text-xl text-zinc-400 leading-relaxed mb-2">
                  箱根駅伝を走ったエンジニア
                </p>
                <p className="text-sm text-zinc-600">
                  16年の陸上競技で培った継続力を、ITへ。
                </p>
              </ParallaxSection>

              <div className="flex gap-4">
                <MagneticButton
                  href="#works"
                  className="group px-6 py-3 bg-orange-500 text-black font-bold text-sm tracking-wider hover:bg-white transition-colors duration-300 inline-flex items-center gap-2"
                >
                  VIEW WORKS
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </MagneticButton>
                <MagneticButton
                  href="#contact"
                  className="px-6 py-3 border border-zinc-700 text-white font-medium text-sm tracking-wider hover:border-orange-500 hover:text-orange-500 transition-colors duration-300"
                >
                  CONTACT
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-xs text-zinc-600 tracking-widest">SCROLL</span>
          <ArrowDown className="w-4 h-4 text-zinc-600 animate-bounce" />
        </div>

        {/* サイドテキスト */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-center z-10">
          <span className="text-xs text-zinc-600 tracking-[0.5em]">PORTFOLIO 2025</span>
        </div>
      </section>

      {/* マーキー */}
      <div className="border-y border-zinc-900 bg-black overflow-hidden relative z-10">
        <MarqueeText text="ENGINEER × RUNNER" speed={30} />
      </div>

      {/* ========== ABOUT ========== */}
      <section id="about" className="py-24 lg:py-40 px-6 lg:px-12 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <SectionTitle number="01" title="ABOUT" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* プロフィール画像 */}
            <ParallaxSection speed={0.2} className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/shotaro-img5.jpg"
                  alt="二村昇太朗"
                  className="w-full h-full object-cover object-[center_15%] grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-orange-500/30 -z-10" />
            </ParallaxSection>

            {/* プロフィールテキスト */}
            <div className="lg:pt-12">
              <div className="mb-8">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">二村 昇太朗</h3>
                <p className="text-orange-500 font-mono text-sm tracking-wider">SHOTARO FUTAMURA</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "富山県出身 / 2003年生まれ",
                  "日本体育大学 体育学部 体育学科",
                  "箱根駅伝ランナー（10区）",
                  "2026年よりITエンジニアとして就職予定",
                  "16年間陸上競技を継続",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-zinc-400">
                    <div className="w-1 h-1 bg-orange-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-zinc-500 leading-loose mb-8">
                小学1年生から始めた陸上競技を16年間継続し、箱根駅伝をはじめとする数々の大会に出場。
                競技で培った粘り強さ・目標達成力・継続力を武器に、エンジニアとして成長中。
                スポーツとテクノロジーの架け橋となることを目指しています。
              </p>

              {/* 資格 */}
              <div className="border-t border-zinc-800 pt-8">
                <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">保有資格</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "応用情報技術者", date: "令和6年12月" },
                    { name: "基本情報技術者", date: "令和5年12月" },
                    { name: "情報セキュリティマネジメント", date: "令和6年11月" },
                    { name: "ITパスポート", date: "令和5年11月" },
                  ].map((cert) => (
                    <div key={cert.name} className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 flex items-baseline gap-2">
                      <span className="text-zinc-400">{cert.name}</span>
                      <span className="text-[10px] text-zinc-600">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PERSONAL RECORDS ========== */}
      <section id="records" className="py-24 lg:py-40 px-6 lg:px-12 bg-zinc-950 relative overflow-hidden">
        {/* トラック風の背景装飾 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-[2/1] border-[40px] border-orange-500 rounded-[50%]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle number="02" title="RECORDS" />
          <p className="text-zinc-500 mb-12 -mt-8">Personal Best Times</p>
          <PersonalBestTimes />
        </div>
      </section>

      {/* ========== ATHLETIC CAREER ========== */}
      <section id="career" className="py-24 lg:py-40 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionTitle number="03" title="CAREER" />

          <div className="space-y-12">
            <TimelineItem
              period="小学生"
              title="陸上競技との出会い"
              achievements={[
                "第17回 全国小学生クロスカントリーリレー研修大会出走（5年生）",
                "第18回 全国小学生クロスカントリーリレー研修大会出走（6年生）",
              ]}
              index={0}
            />

            <TimelineItem
              period="中学生"
              title="全国の舞台へ"
              achievements={[
                "第45回 全日本中学校陸上競技選手権大会出走（1500m / 3000m）",
                "第26回 全国中学校駅伝競走大会 1区出走（3年生）",
              ]}
              index={1}
            />

            <TimelineItem
              period="高校"
              title="試練の時期"
              achievements={[
                "名門・仙台育英学園高等学校に進学",
                "高校3年間で疲労骨折を4回経験",
              ]}
              index={2}
            />

            <TimelineItem
              period="大学"
              title="夢の舞台へ"
              achievements={[
                "関東インカレ 10000m出走（2年生）",
                "全日本大学駅伝 5区出走（3年生）",
                "箱根駅伝 10区出走（3年生）",
                "関東インカレ 5000m出走（4年生）",
                "箱根駅伝予選会出走（4年生）",
                "全日本大学駅伝 4区出走（4年生）",
              ]}
              index={3}
            />
          </div>
        </div>
      </section>

      {/* マーキー */}
      <div className="border-y border-zinc-900 bg-black overflow-hidden">
        <MarqueeText text="ENGINEER × HAKONE EKIDEN" speed={25} reverse />
      </div>

      {/* ========== WORKS ========== */}
      <section id="works" className="py-24 lg:py-40 px-6 lg:px-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <SectionTitle number="04" title="WORKS" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkCard
              title="日本体育大学駅伝部 公式Webサイト"
              description="母校の駅伝部公式サイトの制作・運用を担当。選手情報、試合結果、ニュースなどを掲載。"
              link="https://nssu-ekiden.com/"
              index={0}
            />

            <WorkCard
              title="陸上写真家 公式ホームページ"
              description="陸上競技の瞬間を切り取るカメラマンの作品ギャラリーサイト。"
              link="https://photographer-saya.com/"
              index={1}
            />

            <WorkCard
              title="駅伝リザルト管理サイト"
              description="駅伝大会の結果を一元管理・検索できるWebアプリケーション。"
              link="https://ekiden-results.com/"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section id="gallery" className="py-24 lg:py-40 bg-black">
        <div className="mb-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <SectionTitle number="05" title="GALLERY" />
        </div>

        <GalleryGrid />
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="py-24 lg:py-40 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionTitle number="06" title="CONTACT" />

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24">
            <div>
              <p className="text-zinc-500 leading-loose mb-8">
                撮影のご依頼、ご相談など、お気軽にお問い合わせください。
              </p>

              <div className="space-y-4 mb-12">
                <a href="https://www.instagram.com/shotaro.f_04/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-orange-500 transition-colors group">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-mono">@shotaro.f_04</span>
                </a>
                <a href="https://x.com/shotaro_93993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-orange-500 transition-colors group">
                  <Twitter className="w-5 h-5" />
                  <span className="text-sm font-mono">@shotaro_93993</span>
                </a>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900/30">
                <p className="text-xs text-zinc-500 font-bold tracking-wider mb-2">EMAIL</p>
                <a href="mailto:info@shotaro.dev" className="text-xl font-bold text-white hover:text-orange-500 transition-colors break-all">
                  info@shotaro.dev
                </a>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-8 px-6 lg:px-12 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs tracking-widest">
            © 2025 shotaro.dev
          </p>
          <a href="#" className="text-xs text-zinc-600 hover:text-orange-500 transition-colors">
            BACK TO TOP ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
