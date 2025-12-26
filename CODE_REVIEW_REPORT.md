# 🔍 ポートフォリオサイト コードレビューレポート

**レビュー日**: 2025年1月  
**プロジェクト**: shotaro-portfolio  
**技術スタック**: Next.js 16.0.1, React 19.2.0, TypeScript, Tailwind CSS 4, Three.js

---

## 🔍 総合評価スコア

**72 / 100** - デザインとアニメーションは優れているが、パフォーマンス最適化とコード品質に改善の余地あり。特に画像最適化とバンドルサイズの削減が急務。

---

## 🛠️ 重点修正項目 (High Priority)

### 1. **画像リソースの最適化不足 - LCP悪化の主因**

**問題点**: 
- `shotaro-img13.JPG` (14MB) と `shotaro-img14.JPG` (15MB) が未最適化
- 全画像がJPG/JPEG形式で、WebP/AVIF未対応
- `next/image`未使用（`unoptimized: true`設定）
- 画像に`width`/`height`属性がなく、CLS（Cumulative Layout Shift）の原因

**理由**: 
- LCP（Largest Contentful Paint）が3秒超の可能性が高い
- モバイルユーザーの離脱率増加
- SEO順位への悪影響
- データ通信量の無駄（特にモバイル）

**改善案**:
```typescript
// next.config.ts を修正
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // 静的エクスポートでも画像最適化を有効化（ビルド時最適化）
  images: {
    unoptimized: false, // または削除
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

```tsx
// app/page.tsx - 画像コンポーネントの改善例
import Image from 'next/image';

// ギャラリー画像にwidth/heightを追加
<img
  src={image.src}
  alt={image.alt}
  width={400}
  height={400}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  loading="lazy"
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>
```

**追加対応**:
- ビルド前に画像をWebP/AVIFに変換するスクリプトを追加
- または、`sharp`を使用した画像最適化パイプラインを構築

---

### 2. **Three.jsパーティクルのパフォーマンス問題**

**問題点**: 
- 2000個のパーティクルが常時レンダリング
- バックグラウンドでも`requestAnimationFrame`が動作
- モバイルデバイスでのバッテリー消費が高い
- 低性能デバイスでのフレームレート低下

**理由**: 
- 不要なGPU負荷
- バッテリー消費増加
- ユーザー体験の悪化（特にモバイル）

**改善案**:
```tsx
// app/page.tsx - ParticleBackground コンポーネントの改善
function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // IntersectionObserverでビューポート外では停止
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);

    // デバイス性能の検出
    const isLowEndDevice = 
      navigator.hardwareConcurrency <= 4 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const particlesCount = isLowEndDevice ? 500 : 2000; // 低性能デバイスでは減らす

    // ... 既存のThree.js初期化コード ...

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += mouseRef.current.y * 0.0005;
      particlesMesh.rotation.y += mouseRef.current.x * 0.0005;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // ... 既存のクリーンアップ ...
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
```

---

### 3. **メモ化不足による不要な再レンダリング**

**問題点**: 
- `GalleryGrid`の`shuffledImages`が毎回再計算される可能性
- `PersonalBestTimes`のアニメーションロジックが複雑で最適化されていない
- イベントハンドラーが再生成される

**理由**: 
- パフォーマンス低下
- メモリリークのリスク
- ユーザー体験の悪化

**改善案**:
```tsx
// useMemoとuseCallbackの活用
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // シャッフルをメモ化（初回のみ実行）
  const shuffledImages = useMemo(() => {
    return [...galleryImages].sort(() => Math.random() - 0.5);
  }, []);

  const openModal = useCallback((image: typeof galleryImages[0]) => {
    const originalIndex = galleryImages.findIndex(img => img.src === image.src);
    setSelectedIndex(originalIndex);
  }, []);

  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev => prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1);
  }, []);

  const goToNext = useCallback(() => {
    setSelectedIndex(prev => prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1);
  }, []);

  // ... 残りのコード ...
}
```

---

### 4. **フォームバリデーションとセキュリティの不足**

**問題点**: 
- クライアント側バリデーションのみ
- XSS対策が不十分（`mailto:`リンクは安全だが、将来的な拡張時にリスク）
- フォーム送信のエラーハンドリングなし
- スパム対策（reCAPTCHA等）なし

**理由**: 
- セキュリティリスク
- ユーザー体験の悪化（エラー時のフィードバック不足）

**改善案**:
```tsx
// ContactForm コンポーネントの改善
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "名前は必須です";
    } else if (formData.name.length > 100) {
      newErrors.name = "名前は100文字以内で入力してください";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (formData.phone && !/^[\d\-\+\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = "有効な電話番号を入力してください";
    }

    if (!formData.message.trim()) {
      newErrors.message = "メッセージは必須です";
    } else if (formData.message.length > 5000) {
      newErrors.message = "メッセージは5000文字以内で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // XSS対策: エスケープ処理
    const sanitize = (str: string) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    const body = `
Name: ${sanitize(formData.name)}
Email: ${sanitize(formData.email)}
Phone: ${sanitize(formData.phone || 'N/A')}

Message:
${sanitize(formData.message)}
    `.trim();

    const mailtoLink = `mailto:info@shotaro.dev?subject=Contact from Portfolio&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // 送信後の処理
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1000);
  };

  // ... 残りのコード ...
}
```

---

### 5. **アクセシビリティの改善**

**問題点**: 
- モーダルのフォーカストラップが不完全
- キーボードナビゲーションの改善余地
- ARIA属性の不足箇所
- スキップリンクが実装されていない

**理由**: 
- WCAG 2.1準拠のため
- スクリーンリーダーユーザーのアクセシビリティ向上
- 法的コンプライアンス

**改善案**:
```tsx
// スキップリンクの追加（layout.tsxまたはpage.tsx）
<a href="#main-content" className="skip-link">
  メインコンテンツへスキップ
</a>

// モーダルのフォーカストラップ改善
useEffect(() => {
  if (selectedIndex === null) return;

  const modal = document.querySelector('[role="dialog"]');
  const focusableElements = modal?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements?.[0] as HTMLElement;
  const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  firstElement?.focus();
  window.addEventListener('keydown', handleTabKey);

  return () => {
    window.removeEventListener('keydown', handleTabKey);
  };
}, [selectedIndex]);
```

---

## 📈 中長期的な改善提案 (Medium/Low Priority)

### Medium Priority

#### 6. **コード分割と動的インポート**
- Three.jsを動的インポートに変更（初回ロード時間の短縮）
- GSAPも必要に応じて動的インポート

```tsx
const ParticleBackground = dynamic(() => import('./components/ParticleBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
});
```

#### 7. **フォント最適化**
- `next/font`は使用されているが、`display: swap`の設定を確認
- 日本語フォントのサブセット化を検討

#### 8. **構造化データの拡充**
- `Works`セクションに`CreativeWork`スキーマを追加
- `Gallery`に`ImageObject`スキーマを追加

#### 9. **エラーバウンダリーの実装**
- React Error Boundaryを追加して、クラッシュ時のフォールバックUIを提供

#### 10. **パフォーマンス監視**
- Web Vitalsの計測とレポート機能を追加
- 本番環境でのパフォーマンス監視ツールの導入

### Low Priority

#### 11. **PWA対応**
- Service Workerの実装
- オフライン対応
- インストール可能なWebアプリとしての機能追加

#### 12. **多言語対応（i18n）**
- 英語版の追加を検討
- Next.jsのi18n機能を活用

#### 13. **アナリティクス統合**
- Google Analytics 4またはPlausible Analyticsの統合
- プライバシーに配慮した実装

#### 14. **コンポーネントの分離**
- `app/page.tsx`が1293行と非常に長い
- コンポーネントを個別ファイルに分割（`components/`ディレクトリに整理）

---

## 💡 プロのエンジニアとしてのプラスアルファ

### 1. **画像最適化パイプラインの構築**

ビルド時に自動的に画像を最適化するスクリプトを追加：

```typescript
// scripts/optimize-images.ts
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function optimizeImages() {
  const publicDir = join(process.cwd(), 'public');
  const files = await readdir(publicDir);
  
  for (const file of files) {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const inputPath = join(publicDir, file);
      const stats = await stat(inputPath);
      
      // 5MB以上のファイルは警告
      if (stats.size > 5 * 1024 * 1024) {
        console.warn(`⚠️  Large image detected: ${file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      // WebP変換
      const webpPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      // AVIF変換（オプション）
      const avifPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      await sharp(inputPath)
        .avif({ quality: 80 })
        .toFile(avifPath);
    }
  }
}

optimizeImages();
```

### 2. **パフォーマンスバジェットの設定**

`package.json`にパフォーマンスバジェットを追加：

```json
{
  "performance": {
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "500kb",
        "maximumError": "1mb"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "50kb"
      }
    ]
  }
}
```

### 3. **コンテンツセキュリティポリシー（CSP）の実装**

セキュリティヘッダーの追加：

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // ... 既存の設定
};
```

### 4. **Storybookの導入**

コンポーネントの開発とテストを効率化：

```bash
npx sb init
```

### 5. **E2Eテストの導入**

PlaywrightまたはCypressを使用したE2Eテスト：

```typescript
// e2e/gallery.spec.ts
import { test, expect } from '@playwright/test';

test('ギャラリー画像の表示とモーダル動作', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label*="拡大表示"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

### 6. **CMS統合の検討**

将来的なコンテンツ管理のために、Headless CMS（Contentful、Strapi等）の統合を検討。

### 7. **CDNの活用**

Cloudflare PagesやVercelのCDNを最大限活用し、エッジキャッシングを最適化。

---

## 📊 優先度マトリックス

| 優先度 | 項目 | 影響度 | 工数 | スコア改善 |
|--------|------|--------|------|------------|
| High | 画像最適化 | 高 | 中 | +15点 |
| High | Three.js最適化 | 中 | 低 | +5点 |
| High | メモ化 | 中 | 低 | +3点 |
| High | フォーム改善 | 中 | 中 | +2点 |
| High | アクセシビリティ | 中 | 中 | +3点 |
| Medium | コード分割 | 中 | 中 | +5点 |
| Medium | エラーバウンダリー | 低 | 低 | +2点 |
| Low | PWA対応 | 低 | 高 | +3点 |

---

## 🎯 推奨アクションプラン

### フェーズ1（即座に実施）
1. 画像のWebP/AVIF変換と最適化
2. Three.jsパーティクルの最適化
3. メモ化の実装

### フェーズ2（1週間以内）
4. フォームバリデーション強化
5. アクセシビリティ改善
6. エラーバウンダリー実装

### フェーズ3（1ヶ月以内）
7. コンポーネントの分離
8. パフォーマンス監視の導入
9. E2Eテストの実装

---

**レビュー担当**: AI Code Reviewer  
**次回レビュー推奨日**: 改善実装後

